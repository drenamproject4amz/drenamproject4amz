import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { MenuItem, OrderRecord } from '../types';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add Workspace scopes for Drive, Sheets, and Calendar
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/calendar');

let isSigningIn = false;
let cachedAccessToken: string | null = localStorage.getItem('ws_access_token'); // cache in local storage to prevent reload logouts but keep safe

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If we don't have a token, we must prompt for login
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      localStorage.removeItem('ws_access_token');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Workspace login');
    }

    cachedAccessToken = credential.accessToken;
    localStorage.setItem('ws_access_token', cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  localStorage.removeItem('ws_access_token');
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// ==========================================
// GOOGLE DRIVE API WRAPPERS (v3)
// ==========================================

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  size?: string;
}

/**
 * List files in user's Drive matching certain criteria
 */
export async function listJsonBackupsFromDrive(accessToken: string): Promise<DriveFile[]> {
  const query = encodeURIComponent("mimeType = 'application/json' and name contains 'wellness-' and trashed = false");
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,size)&orderBy=createdTime desc`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to list files from Google Drive');
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Upload a JSON file to Google Drive (menu or orders)
 */
export async function uploadJsonToDrive(
  accessToken: string,
  fileName: string,
  content: any
): Promise<DriveFile> {
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
  };

  const boundary = 'foo_bar_baz';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body = 
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(content, null, 2) +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to upload file to Google Drive');
  }

  return response.json();
}

/**
 * Load and parse a JSON backup file content from Google Drive
 */
export async function loadJsonFromDrive(accessToken: string, fileId: string): Promise<any> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to fetch file content from Google Drive');
  }

  return response.json();
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFileFromDrive(accessToken: string, fileId: string): Promise<void> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to delete file from Google Drive');
  }
}

// ==========================================
// GOOGLE SHEETS API WRAPPERS (v4)
// ==========================================

export interface SpreadsheetInfo {
  id: string;
  title: string;
  url: string;
}

/**
 * Create a new spreadsheet in Google Drive for logging orders
 */
export async function createOrdersSpreadsheet(accessToken: string, title: string): Promise<SpreadsheetInfo> {
  const body = {
    properties: {
      title: title,
    },
    sheets: [
      {
        properties: {
          title: 'Live Orders Log',
        },
      },
      {
        properties: {
          title: 'Menu Catalog',
        },
      }
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create Google Spreadsheet');
  }

  const data = await response.json();

  // Populate Headers for Orders sheet
  const headers = [
    ['Token #', 'Timestamp', 'Customer Type', 'Customer Name', 'Mobile', 'Staff ID / Cabin', 'Pickup/Delivery', 'Building/Floor', 'Ordered Items', 'Total Price (BDT)', 'Kitchen Provider', 'Status']
  ];
  
  await updateSheetValues(accessToken, data.spreadsheetId, 'Live Orders Log!A1:L1', headers);

  // Populate Headers for Menu sheet
  const menuHeaders = [
    ['ID', 'Name (English)', 'Name (Bengali)', 'Price (BDT)', 'Staff Price (BDT)', 'Calories (kcal)', 'Protein (g)', 'Fat (g)', 'Food Category', 'Tags']
  ];
  await updateSheetValues(accessToken, data.spreadsheetId, 'Menu Catalog!A1:J1', menuHeaders);

  return {
    id: data.spreadsheetId,
    title: data.properties.title,
    url: data.spreadsheetUrl,
  };
}

/**
 * Generic helper to write values into a sheet range
 */
export async function updateSheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to update Google Sheet cell values');
  }

  return response.json();
}

/**
 * Sync the entire Menu Catalog to a specified Google Sheet
 */
export async function syncMenuToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  menuItems: MenuItem[]
): Promise<void> {
  // Clear existing menu catalog data (except headers, write up to row 100)
  const clearRange = 'Menu Catalog!A2:J200';
  const emptyRows = Array(199).fill(null).map(() => Array(10).fill(''));
  await updateSheetValues(accessToken, spreadsheetId, clearRange, emptyRows);

  // Build rows from menu items
  const rows = menuItems.map(item => [
    item.id,
    item.name,
    item.nameBn,
    item.price,
    item.staffPrice,
    item.calories,
    item.protein,
    item.fat,
    item.source,
    item.tags.join(', ')
  ]);

  await updateSheetValues(accessToken, spreadsheetId, `Menu Catalog!A2:J${rows.length + 1}`, rows);
}

/**
 * Import/Append menu items from a custom Google Sheet spreadsheet
 */
export async function importMenuFromSpreadsheet(
  accessToken: string,
  spreadsheetId: string
): Promise<Partial<MenuItem>[]> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Menu Catalog!A2:J200`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to fetch menu items from Google Sheet. Make sure the sheet name is exactly "Menu Catalog"');
  }

  const data = await response.json();
  const rows = data.values || [];

  return rows
    .filter((row: any[]) => row[0] && row[1]) // Must have ID and Name
    .map((row: any[]) => ({
      id: row[0],
      name: row[1],
      nameBn: row[2] || row[1],
      price: parseInt(row[3]) || 0,
      staffPrice: parseInt(row[4]) || parseInt(row[3]) || 0,
      calories: parseInt(row[5]) || 0,
      protein: parseInt(row[6]) || 0,
      fat: parseInt(row[7]) || 0,
      source: (row[8] === 'cafe' || row[8] === 'canteen') ? row[8] : 'canteen',
      tags: row[9] ? row[9].split(',').map((t: string) => t.trim()) : [],
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
    }));
}

/**
 * Append a live order record to Google Sheets
 */
export async function appendOrderToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  order: OrderRecord
): Promise<any> {
  const itemsSummary = order.items.map(it => `${it.qty}x ${it.name} (${it.source})`).join(', ');
  const providerSummary = Array.from(new Set(order.items.map(it => it.source))).join(' & ');

  const row = [
    `#${order.id}`,
    new Date(order.timestamp).toLocaleString(),
    order.ordererType === 'staff' ? 'Hospital Staff' : 'Patient/Visitor',
    order.name,
    order.mobile,
    order.ordererType === 'staff' ? (order.staffId || 'N/A') : (order.location.bedCabin || 'N/A'),
    order.pickupOption,
    `${order.location.building || 'Main Tower'} - ${order.location.floor || 'G'}`,
    itemsSummary,
    order.totalPrice,
    providerSummary,
    order.status
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Live Orders Log!A1:L1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to append live order to Google Sheets');
  }

  return response.json();
}

// ==========================================
// GOOGLE CALENDAR API WRAPPERS (v3)
// ==========================================

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
}

/**
 * List events from primary calendar (such as scheduled nutrition slots or deliveries)
 */
export async function listPrimaryCalendarEvents(accessToken: string): Promise<CalendarEvent[]> {
  const timeMin = new Date();
  timeMin.setDate(timeMin.getDate() - 3); // last 3 days
  const isoTimeMin = encodeURIComponent(timeMin.toISOString());

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${isoTimeMin}&maxResults=30&orderBy=startTime&singleEvents=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to retrieve events from Google Calendar');
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Schedule a food meal program event or delivery slot in the primary calendar
 */
export async function createPrimaryCalendarEvent(
  accessToken: string,
  eventData: {
    summary: string;
    description: string;
    location: string;
    startIso: string;
    endIso: string;
  }
): Promise<CalendarEvent> {
  const body = {
    summary: eventData.summary,
    description: eventData.description,
    location: eventData.location,
    start: {
      dateTime: eventData.startIso,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
    end: {
      dateTime: eventData.endIso,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to schedule event in Google Calendar');
  }

  return response.json();
}
