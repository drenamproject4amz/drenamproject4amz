import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat,
  ShoppingBag,
  Sparkles,
  Download,
  Plus,
  Minus,
  Check,
  Eye,
  Settings,
  BookOpen,
  Heart,
  Activity,
  Flame,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Info,
  Calendar,
  X,
  Volume2,
  Search,
  Trash2,
  Clock,
  User as LucideUser,
  MapPin,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Coffee,
  Utensils,
  Filter,
  Lock,
  Shield,
  DollarSign,
  Database,
  Users,
  BarChart3,
  PieChart as LucidePieChart,
  ListFilter,
  ClipboardList,
  PlusCircle,
  FolderSync
} from 'lucide-react';
import { MenuItem, ViewMode, OrderRecord, CustomizationRecord } from './types';
import { INITIAL_MENU_ITEMS } from './data/menuItems';
import { convertGoogleDriveUrl } from './utils/driveConverter';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken, 
  listJsonBackupsFromDrive, 
  uploadJsonToDrive, 
  loadJsonFromDrive, 
  deleteFileFromDrive, 
  createOrdersSpreadsheet, 
  syncMenuToSpreadsheet, 
  importMenuFromSpreadsheet, 
  appendOrderToSpreadsheet, 
  listPrimaryCalendarEvents, 
  createPrimaryCalendarEvent,
  DriveFile,
  CalendarEvent
} from './utils/googleWorkspace';
import { User } from 'firebase/auth';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('kiosk_menu_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('kiosk_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  // Separate DB Operator session & gateway state
  const [managerRole, setManagerRole] = useState<'none' | 'admin' | 'canteen' | 'cafe'>(() => {
    return (localStorage.getItem('kiosk_managerRole') as any) || 'none';
  });
  const [operatorName, setOperatorName] = useState(() => {
    return localStorage.getItem('kiosk_operatorName') || '';
  });
  const [operatorInput, setOperatorInput] = useState('');

  useEffect(() => {
    localStorage.setItem('kiosk_managerRole', managerRole);
  }, [managerRole]);

  useEffect(() => {
    localStorage.setItem('kiosk_operatorName', operatorName);
  }, [operatorName]);
  const [order, setOrder] = useState<{ [key: string]: number }>({});
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  // Kiosk Global Branding & Dialogues State (Persisted)
  const [kitchenNameEn, setKitchenNameEn] = useState(() => localStorage.getItem('kiosk_kitchenNameEn') || 'Wellness Kitchen');
  const [kitchenNameBn, setKitchenNameBn] = useState(() => localStorage.getItem('kiosk_kitchenNameBn') || 'ওয়েলনেস কিচেন');
  
  const [kitchenSubtitleEn, setKitchenSubtitleEn] = useState(() => localStorage.getItem('kiosk_kitchenSubtitleEn') || 'Dinner Service');
  const [kitchenSubtitleBn, setKitchenSubtitleBn] = useState(() => localStorage.getItem('kiosk_kitchenSubtitleBn') || 'রাতের খাবার');

  const [kitchenLogoUrl, setKitchenLogoUrl] = useState(() => localStorage.getItem('kiosk_kitchenLogoUrl') || '');

  // Background gradient presets or custom combos
  const [bgGradientStart, setBgGradientStart] = useState(() => localStorage.getItem('kiosk_bgGradientStart') || '#111113');
  const [bgGradientEnd, setBgGradientEnd] = useState(() => localStorage.getItem('kiosk_bgGradientEnd') || '#161618');
  const [bgAuraColor, setBgAuraColor] = useState(() => localStorage.getItem('kiosk_bgAuraColor') || '#0ea5e9');

  // Custom dialogues
  const [dialogueSpotlightTitleEn, setDialogueSpotlightTitleEn] = useState(() => localStorage.getItem('kiosk_dialogueSpotlightTitleEn') || 'Spotlight Meal of the Day');
  const [dialogueSpotlightTitleBn, setDialogueSpotlightTitleBn] = useState(() => localStorage.getItem('kiosk_dialogueSpotlightTitleBn') || 'দিনের সেরা আকর্ষণ');

  const [dialogueSpotlightDescEn, setDialogueSpotlightDescEn] = useState(() => localStorage.getItem('kiosk_dialogueSpotlightDescEn') || 'Select items to compile your personalized health plate');
  const [dialogueSpotlightDescBn, setDialogueSpotlightDescBn] = useState(() => localStorage.getItem('kiosk_dialogueSpotlightDescBn') || 'আপনার পছন্দসই স্বাস্থ্যকর খাবার নির্বাচন করুন');

  const [dialogueTickerEn, setDialogueTickerEn] = useState(() => localStorage.getItem('kiosk_dialogueTickerEn') || 'Stay hydrated: Drink 8 glasses of water daily');
  const [dialogueTickerBn, setDialogueTickerBn] = useState(() => localStorage.getItem('kiosk_dialogueTickerBn') || 'পর্যাপ্ত পানি পান করুন: প্রতিদিন ৮ গ্লাস পানি পান করুন');

  const [dialogueButtonEn, setDialogueButtonEn] = useState(() => localStorage.getItem('kiosk_dialogueButtonEn') || 'Add To Plate');
  const [dialogueButtonBn, setDialogueButtonBn] = useState(() => localStorage.getItem('kiosk_dialogueButtonBn') || 'প্লেটে যোগ করুন');

  // Checkout alerts
  const [orderPlacedTitleEn, setOrderPlacedTitleEn] = useState(() => localStorage.getItem('kiosk_orderPlacedTitleEn') || 'Order Registered Successfully!');
  const [orderPlacedTitleBn, setOrderPlacedTitleBn] = useState(() => localStorage.getItem('kiosk_orderPlacedTitleBn') || 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!');
  
  const [orderPlacedDescEn, setOrderPlacedDescEn] = useState(() => localStorage.getItem('kiosk_orderPlacedDescEn') || 'The kitchen is preparing your personalized wellness recipe.');
  const [orderPlacedDescBn, setOrderPlacedDescBn] = useState(() => localStorage.getItem('kiosk_orderPlacedDescBn') || 'রান্নাঘর আপনার স্বাস্থ্যকর খাবার প্রস্তুত করছে।');

  const [tokenLabelEn, setTokenLabelEn] = useState(() => localStorage.getItem('kiosk_tokenLabelEn') || 'Token Number');
  const [tokenLabelBn, setTokenLabelBn] = useState(() => localStorage.getItem('kiosk_tokenLabelBn') || 'টোকেন নাম্বার');

  // Editors sub-tab state
  const [editorTab, setEditorTab] = useState<'item' | 'kiosk'>('item');
  const [isGeneratingJpg, setIsGeneratingJpg] = useState(false);

  // Local states for manual order placement
  const [manualCustomerType, setManualCustomerType] = useState<'staff' | 'patient_visitor'>('patient_visitor');
  const [manualName, setManualName] = useState('');
  const [manualMobile, setManualMobile] = useState('');
  const [manualStaffId, setManualStaffId] = useState('');
  const [manualDepartment, setManualDepartment] = useState('Cardiology');
  const [manualCabin, setManualCabin] = useState('');
  const [manualRegId, setManualRegId] = useState('');
  const [manualPickup, setManualPickup] = useState<'pickup' | 'delivery'>('pickup');
  const [manualCart, setManualCart] = useState<{[key: string]: number}>({});

  // Local state for adding/editing menu items
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    nameBn: '',
    description: '',
    calories: 250,
    protein: 10,
    fat: 5,
    price: 350,
    staffPrice: 250,
    tags: [] as string[],
    image: ''
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('kiosk_kitchenNameEn', kitchenNameEn);
    localStorage.setItem('kiosk_kitchenNameBn', kitchenNameBn);
    localStorage.setItem('kiosk_kitchenSubtitleEn', kitchenSubtitleEn);
    localStorage.setItem('kiosk_kitchenSubtitleBn', kitchenSubtitleBn);
    localStorage.setItem('kiosk_kitchenLogoUrl', kitchenLogoUrl);
    localStorage.setItem('kiosk_bgGradientStart', bgGradientStart);
    localStorage.setItem('kiosk_bgGradientEnd', bgGradientEnd);
    localStorage.setItem('kiosk_bgAuraColor', bgAuraColor);
    localStorage.setItem('kiosk_dialogueSpotlightTitleEn', dialogueSpotlightTitleEn);
    localStorage.setItem('kiosk_dialogueSpotlightTitleBn', dialogueSpotlightTitleBn);
    localStorage.setItem('kiosk_dialogueSpotlightDescEn', dialogueSpotlightDescEn);
    localStorage.setItem('kiosk_dialogueSpotlightDescBn', dialogueSpotlightDescBn);
    localStorage.setItem('kiosk_dialogueTickerEn', dialogueTickerEn);
    localStorage.setItem('kiosk_dialogueTickerBn', dialogueTickerBn);
    localStorage.setItem('kiosk_dialogueButtonEn', dialogueButtonEn);
    localStorage.setItem('kiosk_dialogueButtonBn', dialogueButtonBn);
    localStorage.setItem('kiosk_orderPlacedTitleEn', orderPlacedTitleEn);
    localStorage.setItem('kiosk_orderPlacedTitleBn', orderPlacedTitleBn);
    localStorage.setItem('kiosk_orderPlacedDescEn', orderPlacedDescEn);
    localStorage.setItem('kiosk_orderPlacedDescBn', orderPlacedDescBn);
    localStorage.setItem('kiosk_tokenLabelEn', tokenLabelEn);
    localStorage.setItem('kiosk_tokenLabelBn', tokenLabelBn);
  }, [
    kitchenNameEn, kitchenNameBn, kitchenSubtitleEn, kitchenSubtitleBn, kitchenLogoUrl,
    bgGradientStart, bgGradientEnd, bgAuraColor,
    dialogueSpotlightTitleEn, dialogueSpotlightTitleBn,
    dialogueSpotlightDescEn, dialogueSpotlightDescBn,
    dialogueTickerEn, dialogueTickerBn, dialogueButtonEn, dialogueButtonBn,
    orderPlacedTitleEn, orderPlacedTitleBn, orderPlacedDescEn, orderPlacedDescBn,
    tokenLabelEn, tokenLabelBn
  ]);

  // Spotlight Editor State (using the first featured item as baseline)
  const [editorItem, setEditorItem] = useState<MenuItem>({
    ...INITIAL_MENU_ITEMS[0]
  });
  const [rawImageUrl, setRawImageUrl] = useState(INITIAL_MENU_ITEMS[0].image);
  const [driveConversion, setDriveConversion] = useState({
    isDriveUrl: false,
    convertedUrl: INITIAL_MENU_ITEMS[0].image,
    fileId: null as string | null,
    error: undefined as string | undefined
  });

  // Toggles for visibility
  const [showBadge, setShowBadge] = useState(true);
  const [showHealthyTag, setShowHealthyTag] = useState(true);
  const [showLowSodiumTag, setShowLowSodiumTag] = useState(true);
  const [showKioskActionButton, setShowKioskActionButton] = useState(false);

  // Cart items count and sum
  const orderItemsCount: number = (Object.values(order) as number[]).reduce((sum: number, count: number) => sum + count, 0);
  
  // Checkout Dialog State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Google Workspace States
  const [wsUser, setWsUser] = useState<User | null>(null);
  const [wsToken, setWsToken] = useState<string | null>(null);
  const [wsNeedsAuth, setWsNeedsAuth] = useState(true);
  const [wsLoading, setWsLoading] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [wsSuccess, setWsSuccess] = useState<string | null>(null);
  const [driveBackups, setDriveBackups] = useState<DriveFile[]>([]);
  const [sheetsSpreadsheetId, setSheetsSpreadsheetId] = useState(() => localStorage.getItem('workspace_spreadsheetId') || '');
  const [sheetsSpreadsheetUrl, setSheetsSpreadsheetUrl] = useState(() => localStorage.getItem('workspace_spreadsheetUrl') || '');
  const [sheetsAutoSync, setSheetsAutoSync] = useState(() => localStorage.getItem('workspace_sheets_auto_sync') === 'true');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [activeWsSubTab, setActiveWsSubTab] = useState<'drive' | 'sheets' | 'calendar' | 'help'>('drive');

  // Calendar Event form states
  const [newEventTitle, setNewEventTitle] = useState('Special Diet Delivery Slot');
  const [newEventDesc, setNewEventDesc] = useState('Healthy food distribution for the Cardiac Care Unit.');
  const [newEventLoc, setNewEventLoc] = useState('Main Ward, Cardiology Department');
  const [newEventStart, setNewEventStart] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:MM
  });
  const [newEventEnd, setNewEventEnd] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 3);
    return d.toISOString().slice(0, 16);
  });

  // Hotline configurations (Cafe & Canteen - editable in branding)
  const [cafeHotline, setCafeHotline] = useState(() => localStorage.getItem('kiosk_cafeHotline') || '+880-1711-102030');
  const [canteenHotline, setCanteenHotline] = useState(() => localStorage.getItem('kiosk_canteenHotline') || '+880-1899-405060');

  // Customer type and detailed form info states
  const [ordererType, setOrdererType] = useState<'patient_visitor' | 'staff'>('patient_visitor');
  const [ordererName, setOrdererName] = useState('');
  const [ordererMobile, setOrdererMobile] = useState('');
  const [staffId, setStaffId] = useState('');
  const [pickupOption, setPickupOption] = useState<'pickup' | 'delivery'>('delivery');

  // Location fields
  const [building, setBuilding] = useState('Main Ward Block');
  const [floor, setFloor] = useState('3rd Floor');
  const [bedCabin, setBedCabin] = useState('');
  const [patientRegId, setPatientRegId] = useState('');
  const [departmentRoom, setDepartmentRoom] = useState('');

  // Generated token for completed orders
  const [generatedToken, setGeneratedToken] = useState('9041');

  // Manager Dashboard Filter States
  const [dbSearch, setDbSearch] = useState('');
  const [dbStatusFilter, setDbStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed'>('all');
  const [dbRoleFilter, setDbRoleFilter] = useState<'all' | 'patient_visitor' | 'staff'>('all');

  // Admin Authentication & Roles State
  const [adminUser, setAdminUser] = useState<string | null>(() => localStorage.getItem('kiosk_admin_user') || null);
  const [adminRole, setAdminRole] = useState<'canteen' | 'cafe' | 'open' | null>(() => localStorage.getItem('kiosk_admin_role') as any || null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [customizationSavedMessage, setCustomizationSavedMessage] = useState('');

  // Customization History state
  const [customizationHistory, setCustomizationHistory] = useState<CustomizationRecord[]>(() => {
    const saved = localStorage.getItem('kiosk_customization_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Sync customization history with localStorage
  useEffect(() => {
    localStorage.setItem('kiosk_customization_history', JSON.stringify(customizationHistory));
  }, [customizationHistory]);

  // Load and store orders
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem('kiosk_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default sample data
      }
    }
    // Pre-populate with sample orders
    const samples: OrderRecord[] = [
      {
        id: '1241',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        ordererType: 'patient_visitor',
        name: 'Arif Chowdhury',
        mobile: '+8801755123456',
        pickupOption: 'delivery',
        location: {
          building: 'Main Ward Block',
          floor: '4th Floor',
          bedCabin: 'Cabin 412',
          patientRegId: 'P-98831'
        },
        items: [
          { id: 'sea-bass', name: 'Signature Herb-Crusted Sea Bass', nameBn: 'সিগনেচার হার্ব-ক্রাস্টেড সি বাস', price: 950, qty: 1, source: 'canteen' },
          { id: 'lentil-soup', name: 'Lentil Soup', nameBn: 'মসুর ডালের স্যুপ', price: 150, qty: 1, source: 'canteen' }
        ],
        totalPrice: 1100,
        status: 'completed'
      },
      {
        id: '2053',
        timestamp: new Date(Date.now() - 3600000 * 0.4).toISOString(),
        ordererType: 'staff',
        name: 'Dr. Tasnim Alam',
        mobile: '+8801811987654',
        staffId: 'ST-5091',
        pickupOption: 'pickup',
        location: {},
        items: [
          { id: 'salmon', name: 'Grilled Salmon with Asparagus', nameBn: 'গ্রিলড স্যামন এবং অ্যাসপারাগাস', price: 650, qty: 1, source: 'canteen' },
          { id: 'pasta', name: 'Whole Grain Pasta', nameBn: 'হোল গ্রেইন পাস্তা', price: 320, qty: 1, source: 'cafe' }
        ],
        totalPrice: 970, // Staff pricing applied
        status: 'preparing'
      }
    ];
    localStorage.setItem('kiosk_orders', JSON.stringify(samples));
    return samples;
  });

  // Keep hotlines in sync with localStorage
  useEffect(() => {
    localStorage.setItem('kiosk_cafeHotline', cafeHotline);
    localStorage.setItem('kiosk_canteenHotline', canteenHotline);
  }, [cafeHotline, canteenHotline]);

  // Keep orders in sync with localStorage
  useEffect(() => {
    localStorage.setItem('kiosk_orders', JSON.stringify(orders));
  }, [orders]);

  // Google Workspace Fetchers
  const fetchDriveBackups = async (token = wsToken) => {
    const activeToken = token || wsToken;
    if (!activeToken) return;
    try {
      const files = await listJsonBackupsFromDrive(activeToken);
      setDriveBackups(files);
    } catch (e: any) {
      console.error('Failed to load Drive backups:', e);
    }
  };

  const fetchCalendarEvents = async (token = wsToken) => {
    const activeToken = token || wsToken;
    if (!activeToken) return;
    try {
      const events = await listPrimaryCalendarEvents(activeToken);
      setCalendarEvents(events);
    } catch (e: any) {
      console.error('Failed to load Calendar events:', e);
    }
  };

  const registerNewOrders = async (newOrders: OrderRecord[]) => {
    setOrders(prev => [...newOrders, ...prev]);

    if (sheetsAutoSync && sheetsSpreadsheetId && wsToken) {
      for (const order of newOrders) {
        try {
          await appendOrderToSpreadsheet(wsToken, sheetsSpreadsheetId, order);
        } catch (e) {
          console.error('Failed to auto-sync order to Google Sheets:', e);
        }
      }
    }
  };

  // Initialize Workspace Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setWsUser(user);
        setWsToken(token);
        setWsNeedsAuth(false);
        fetchDriveBackups(token);
        fetchCalendarEvents(token);
      },
      () => {
        setWsUser(null);
        setWsToken(null);
        setWsNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync Sheets configuration
  useEffect(() => {
    localStorage.setItem('workspace_spreadsheetId', sheetsSpreadsheetId);
    localStorage.setItem('workspace_spreadsheetUrl', sheetsSpreadsheetUrl);
  }, [sheetsSpreadsheetId, sheetsSpreadsheetUrl]);

  useEffect(() => {
    localStorage.setItem('workspace_sheets_auto_sync', String(sheetsAutoSync));
  }, [sheetsAutoSync]);

  // ==========================================
  // GOOGLE WORKSPACE API HANDLERS
  // ==========================================

  const handleWorkspaceLogin = async () => {
    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setWsUser(res.user);
        setWsToken(res.accessToken);
        setWsNeedsAuth(false);
        setWsSuccess('Successfully connected to Google Workspace!');
        fetchDriveBackups(res.accessToken);
        fetchCalendarEvents(res.accessToken);
      }
    } catch (e: any) {
      setWsError(e.message || 'Workspace connection failed');
    } finally {
      setWsLoading(false);
    }
  };

  const handleWorkspaceLogout = async () => {
    setWsLoading(true);
    try {
      await logout();
      setWsUser(null);
      setWsToken(null);
      setWsNeedsAuth(true);
      setDriveBackups([]);
      setCalendarEvents([]);
      setWsSuccess('Disconnected Google Workspace successfully.');
    } catch (e: any) {
      setWsError(e.message || 'Logout failed');
    } finally {
      setWsLoading(false);
    }
  };

  const handleDriveBackupMenu = async () => {
    if (!wsToken) return;
    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      const fileName = `wellness-menu-backup-${new Date().toISOString().split('T')[0]}-${Math.floor(100+Math.random()*900)}.json`;
      await uploadJsonToDrive(wsToken, fileName, menuItems);
      setWsSuccess(`Successfully backed up Menu Catalog as "${fileName}" to Google Drive!`);
      fetchDriveBackups(wsToken);
    } catch (e: any) {
      setWsError(e.message || 'Drive menu backup failed');
    } finally {
      setWsLoading(false);
    }
  };

  const handleDriveBackupOrders = async () => {
    if (!wsToken) return;
    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      const fileName = `wellness-orders-backup-${new Date().toISOString().split('T')[0]}-${Math.floor(100+Math.random()*900)}.json`;
      await uploadJsonToDrive(wsToken, fileName, orders);
      setWsSuccess(`Successfully backed up Active Orders as "${fileName}" to Google Drive!`);
      fetchDriveBackups(wsToken);
    } catch (e: any) {
      setWsError(e.message || 'Drive orders backup failed');
    } finally {
      setWsLoading(false);
    }
  };

  const handleDriveRestore = async (fileId: string, fileName: string) => {
    if (!wsToken) return;
    const confirmed = window.confirm(`Restore data from Google Drive file "${fileName}"? This will overwrite your active database.`);
    if (!confirmed) return;

    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      const data = await loadJsonFromDrive(wsToken, fileId);
      if (fileName.includes('menu')) {
        if (Array.isArray(data)) {
          setMenuItems(data);
          setWsSuccess(`Successfully restored ${data.length} Menu items from Google Drive backup!`);
        } else {
          throw new Error('Invalid menu backup file format. Expected a JSON array.');
        }
      } else if (fileName.includes('orders')) {
        if (Array.isArray(data)) {
          setOrders(data);
          setWsSuccess(`Successfully restored ${data.length} Orders from Google Drive backup!`);
        } else {
          throw new Error('Invalid orders backup file format. Expected a JSON array.');
        }
      } else {
        throw new Error('Unrecognized backup file. File name must contain "menu" or "orders".');
      }
    } catch (e: any) {
      setWsError(e.message || 'Failed to restore backup');
    } finally {
      setWsLoading(false);
    }
  };

  const handleDriveDelete = async (fileId: string, fileName: string) => {
    if (!wsToken) return;
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${fileName}" from Google Drive?`);
    if (!confirmed) return;

    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      await deleteFileFromDrive(wsToken, fileId);
      setWsSuccess(`Deleted "${fileName}" from Google Drive.`);
      fetchDriveBackups(wsToken);
    } catch (e: any) {
      setWsError(e.message || 'Failed to delete file');
    } finally {
      setWsLoading(false);
    }
  };

  const handleSheetsCreateSpreadsheet = async () => {
    if (!wsToken) return;
    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      const info = await createOrdersSpreadsheet(wsToken, `Wellness Kitchen Live Log - Airy Axon`);
      setSheetsSpreadsheetId(info.id);
      setSheetsSpreadsheetUrl(info.url);
      setWsSuccess(`Created new Google Spreadsheet: "${info.title}"! Live sync configured.`);
    } catch (e: any) {
      setWsError(e.message || 'Failed to create spreadsheet');
    } finally {
      setWsLoading(false);
    }
  };

  const handleSheetsSyncMenu = async () => {
    if (!wsToken || !sheetsSpreadsheetId) return;
    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      await syncMenuToSpreadsheet(wsToken, sheetsSpreadsheetId, menuItems);
      setWsSuccess(`Successfully synced ${menuItems.length} menu items to Google Sheets tab "Menu Catalog"!`);
    } catch (e: any) {
      setWsError(e.message || 'Failed to sync menu to Sheets');
    } finally {
      setWsLoading(false);
    }
  };

  const handleSheetsImportMenu = async () => {
    if (!wsToken || !sheetsSpreadsheetId) return;
    const confirmed = window.confirm('Import menu items from your Google Sheet "Menu Catalog" tab? This will merge them into your active menu catalog.');
    if (!confirmed) return;

    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      const imported = await importMenuFromSpreadsheet(wsToken, sheetsSpreadsheetId);
      if (imported.length > 0) {
        setMenuItems(prev => {
          const merged = [...prev];
          imported.forEach((newItem: any) => {
            const idx = merged.findIndex(item => item.id === newItem.id);
            if (idx > -1) merged[idx] = { ...merged[idx], ...newItem };
            else merged.push(newItem);
          });
          return merged;
        });
        setWsSuccess(`Successfully imported and merged ${imported.length} menu items from Google Sheets!`);
      } else {
        throw new Error('No menu rows found under Google Sheet tab "Menu Catalog". Make sure the tab name and headers are correct.');
      }
    } catch (e: any) {
      setWsError(e.message || 'Failed to import menu from Sheets');
    } finally {
      setWsLoading(false);
    }
  };

  const handleSheetsSyncAllOrders = async () => {
    if (!wsToken || !sheetsSpreadsheetId) return;
    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      let count = 0;
      for (const order of orders) {
        await appendOrderToSpreadsheet(wsToken, sheetsSpreadsheetId, order);
        count++;
      }
      setWsSuccess(`Successfully exported all ${count} historical orders to Google Sheets tab "Live Orders Log"!`);
    } catch (e: any) {
      setWsError(e.message || 'Failed to bulk-sync orders to Sheets');
    } finally {
      setWsLoading(false);
    }
  };

  const handleCalendarCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsToken) return;
    
    const confirmed = window.confirm(`Schedule calendar event "${newEventTitle}" in your Google Calendar?`);
    if (!confirmed) return;

    setWsLoading(true);
    setWsError(null);
    setWsSuccess(null);
    try {
      const startIso = new Date(newEventStart).toISOString();
      const endIso = new Date(newEventEnd).toISOString();
      
      await createPrimaryCalendarEvent(wsToken, {
        summary: newEventTitle,
        description: newEventDesc,
        location: newEventLoc,
        startIso,
        endIso,
      });

      setWsSuccess(`Event "${newEventTitle}" successfully added to Google Calendar!`);
      fetchCalendarEvents(wsToken);
      setNewEventTitle('Special Diet Delivery Slot');
    } catch (e: any) {
      setWsError(e.message || 'Calendar event scheduling failed');
    } finally {
      setWsLoading(false);
    }
  };

  const dailyStats = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(day => {
      let canteenSales = 0;
      let cafeSales = 0;
      orders.forEach(o => {
        if (o.timestamp.startsWith(day)) {
          o.items.forEach(it => {
            if (it.source === 'canteen') canteenSales += (it.price * it.qty);
            else if (it.source === 'cafe') cafeSales += (it.price * it.qty);
          });
        }
      });
      return {
        date: day.split('-').slice(1).join('/'), // MM/DD format
        canteen: canteenSales,
        cafe: cafeSales
      };
    });
  }, [orders]);

  const kitchenShareData = useMemo(() => {
    let canteenTotal = 0;
    let cafeTotal = 0;
    orders.forEach(o => {
      o.items.forEach(it => {
        if (it.source === 'canteen') canteenTotal += (it.price * it.qty);
        else if (it.source === 'cafe') cafeTotal += (it.price * it.qty);
      });
    });
    return [
      { name: 'Canteen Services', value: canteenTotal, color: '#10b981' },
      { name: 'Cafe Selections', value: cafeTotal, color: '#0ea5e9' }
    ];
  }, [orders]);

  // Calculate order sum dynamically based on staff price / regular price
  const orderTotalSum = menuItems.reduce((sum, item) => {
    const qty = order[item.id] || 0;
    const priceToUse = ordererType === 'staff' ? item.staffPrice : item.price;
    return sum + priceToUse * qty;
  }, 0);

  // Generate WhatsApp ticket copy
  const getWhatsAppMessage = (record: OrderRecord): string => {
    const divider = "━━━━━━━━━━━━━━━━━━━━";
    const itemsFormatted = record.items
      .map(it => `• ${it.name} (${it.qty}x) - ${it.price} BDT [${it.source === 'cafe' ? 'Cafe' : 'Canteen'}]`)
      .join("\n");

    const modeText = record.pickupOption === 'pickup'
      ? "🏬 Self-Pickup (নিজে সংগ্রহ)"
      : `🚚 Delivery: ${record.location.building}, Floor: ${record.location.floor}${record.location.bedCabin ? `, Bed/Cabin: ${record.location.bedCabin}` : ''}${record.location.departmentRoom ? `, Dept/Room: ${record.location.departmentRoom}` : ''}`;

    const regTxt = record.location.patientRegId ? `\n• Patient Reg ID: ${record.location.patientRegId}` : '';
    const staffTxt = record.staffId ? `\n• Hospital Staff ID: ${record.staffId}` : '';

    const text = `🟢 *Wellness Kitchen Medical Receipt*
${divider}
• *Token No:* #${record.id}
• *Status:* Order Confirmed
• *Name:* ${record.name}
• *Mobile:* ${record.mobile}${staffTxt}${regTxt}

*📋 Ordered Items:*
${itemsFormatted}

*💰 Total Bill:* ${record.totalPrice} BDT
${record.ordererType === 'staff' ? '✨ (Hospital Staff Discount Applied)' : ''}

*📍 Delivery Option:*
${modeText}

*📞 Support Contacts:*
• Hospital Cafe: ${cafeHotline}
• Main Canteen: ${canteenHotline}
${divider}
_Please present this ticket at delivery time. Wish you a quick recovery!_`;

    return encodeURIComponent(text);
  };


  // Google Drive url parser effect
  useEffect(() => {
    const result = convertGoogleDriveUrl(rawImageUrl);
    setDriveConversion({
      isDriveUrl: result.isDriveUrl,
      convertedUrl: result.convertedUrl,
      fileId: result.fileId,
      error: result.error
    });
    setEditorItem(prev => ({
      ...prev,
      image: result.convertedUrl
    }));
  }, [rawImageUrl]);

  // Rotator for Footer Ticker announcements
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAnnouncement(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const addToOrder = (itemId: string) => {
    setOrder(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromOrder = (itemId: string) => {
    setOrder(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: current - 1
      };
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleSaveAndCommitCustomization = (itemName: string, customChanges?: {field: string, oldValue: any, newValue: any}[]) => {
    const timestamp = new Date().toISOString();
    const recordId = Math.floor(100000 + Math.random() * 900000).toString();
    
    const finalChanges = customChanges || [
      { field: 'Spotlight Dish Name', oldValue: 'Previous', newValue: editorItem.name },
      { field: 'Price', oldValue: 'Previous', newValue: `${editorItem.price} BDT` },
      { field: 'Calories', oldValue: 'Previous', newValue: `${editorItem.calories} kcal` },
      { field: 'Proteins/Fats', oldValue: 'Previous', newValue: `${editorItem.protein}g / ${editorItem.fat}g` }
    ];

    const newRecord: CustomizationRecord = {
      id: recordId,
      timestamp,
      user: adminUser || 'guest@gmail.com',
      role: adminRole || 'open',
      itemName: itemName || editorItem.name || 'Signature Wellness Special',
      changes: finalChanges
    };

    setCustomizationHistory(prev => [newRecord, ...prev]);
    setCustomizationSavedMessage('✓ Customization saved & logged in database successfully.');
    setTimeout(() => {
      setCustomizationSavedMessage('');
    }, 4000);
  };

  const deleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to permanently delete this order record from the dashboard?')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const generateKioskImage = async (format: 'png' | 'jpg') => {
    if (format === 'jpg') {
      setIsGeneratingJpg(true);
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context could not be created');

      // Helper for drawing rounded rect
      const drawRoundedRect = (
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        fill: boolean,
        stroke: boolean
      ) => {
        c.beginPath();
        c.moveTo(x + radius, y);
        c.lineTo(x + width - radius, y);
        c.quadraticCurveTo(x + width, y, x + width, y + radius);
        c.lineTo(x + width, y + height - radius);
        c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        c.lineTo(x + radius, y + height);
        c.quadraticCurveTo(x, y + height, x, y + height - radius);
        c.lineTo(x, y + radius);
        c.quadraticCurveTo(x, y, x + radius, y);
        c.closePath();
        if (fill) c.fill();
        if (stroke) c.stroke();
      };

      // 1. Draw Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, bgGradientStart);
      grad.addColorStop(1, bgGradientEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Draw Glow Aura matching highlight color
      const auraColor = bgAuraColor || '#0ea5e9';
      const hexToRgba = (hex: string, alpha: number) => {
        const cleaned = hex.replace('#', '');
        const r = parseInt(cleaned.substring(0, 2), 16) || 0;
        const g = parseInt(cleaned.substring(2, 4), 16) || 0;
        const b = parseInt(cleaned.substring(4, 6), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      const radGrad = ctx.createRadialGradient(540, 500, 100, 540, 500, 800);
      radGrad.addColorStop(0, hexToRgba(auraColor, 0.12));
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 3. Define components and pre-calculate their heights
      const leftMargin = 60;
      const contentWidth = 960; // 1080 - 120
      const contentCenterX = 540;

      // Header is fixed at Top 60, height 140
      const headerHeight = 140;

      // Footer ticker is fixed at bottom 1835, height 85
      const footerHeight = 85;

      // Let's pre-calculate wrapped description text height
      ctx.font = '500 24px system-ui, -apple-system, sans-serif';
      const wrappedDescLines: string[] = [];
      const words = editorItem.description.split(' ');
      let currentLine = '';
      const maxDescWidth = 900;
      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxDescWidth && n > 0) {
          wrappedDescLines.push(currentLine.trim());
          currentLine = words[n] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        wrappedDescLines.push(currentLine.trim());
      }
      const descLineHeight = 38;
      const descriptionHeight = wrappedDescLines.length * descLineHeight;

      // Layout element heights (excluding Food Image)
      const badgeHeight = showBadge ? 56 : 0;
      const namesHeight = 140; // English dish name + Bengali dish name + spacing
      const bentoHeight = 170;
      const tagsHeight = (showHealthyTag || showLowSodiumTag) ? 54 : 0;
      const priceCardHeight = 130;

      // Available vertical space for image & gaps
      const reservedHeight = headerHeight + footerHeight + badgeHeight + namesHeight + descriptionHeight + bentoHeight + tagsHeight + priceCardHeight;
      const totalAvailableSpace = 1920 - 120 - 100; // Leaving top/bottom margin padding
      const remainingSpace = totalAvailableSpace - reservedHeight;

      // Smartly calculate Food Image size and gaps!
      // Image size should be between 480px and 740px
      const foodImageSize = Math.min(740, Math.max(480, remainingSpace * 0.65));
      const heightForGaps = remainingSpace - foodImageSize;

      // We have 8 gaps between these sections
      // Let's distribute heightForGaps among them
      const numGaps = 8;
      const gapSize = Math.max(20, heightForGaps / numGaps);

      // Now, let's sequentially draw each element with calculated gap spacing!
      let currentY = 70; // Start offset

      // --- 1. Draw Header ---
      // Background card for logo & text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      drawRoundedRect(ctx, leftMargin, currentY, contentWidth, headerHeight, 28, true, true);

      // Draw text base
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(kitchenNameEn.toUpperCase(), 210, currentY + 60);

      ctx.fillStyle = auraColor;
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(kitchenSubtitleEn.toUpperCase(), 210, currentY + 100);

      // Bengali on the right side
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(kitchenNameBn, 1080 - 100, currentY + 62);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '500 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(kitchenSubtitleBn, 1080 - 100, currentY + 98);

      currentY += headerHeight + gapSize;

      // --- 2. Chef Recommendation Badge ---
      if (showBadge) {
        ctx.fillStyle = `${auraColor}1a`;
        ctx.strokeStyle = `${auraColor}40`;
        drawRoundedRect(ctx, 360, currentY, 360, 56, 18, true, true);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆  CHEF\'S SPECIAL CHOICE', contentCenterX, currentY + 36);

        currentY += badgeHeight + gapSize;
      }

      // --- 3. Food Image with Shadow/Glow ---
      ctx.shadowColor = hexToRgba(auraColor, 0.3);
      ctx.shadowBlur = 40;
      ctx.fillStyle = '#161618';
      ctx.beginPath();
      ctx.arc(contentCenterX, currentY + foodImageSize / 2, foodImageSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      const foodYCenter = currentY + foodImageSize / 2;
      const foodImageRadius = foodImageSize / 2;

      currentY += foodImageSize + gapSize;

      // --- 4. Dish Name and Bengali Name ---
      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 52px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(editorItem.name, contentCenterX, currentY + 45);

      ctx.fillStyle = auraColor;
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.fillText(editorItem.nameBn, contentCenterX, currentY + 105);

      currentY += namesHeight + gapSize;

      // --- 5. Dish Description ---
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      for (let i = 0; i < wrappedDescLines.length; i++) {
        ctx.fillText(wrappedDescLines[i], contentCenterX, currentY + 25 + i * descLineHeight);
      }

      currentY += descriptionHeight + gapSize;

      // --- 6. Nutrient Bento Cards ---
      const bentoWidth = 280;
      const bentoSpacing = 60;
      const startX = 100;

      const drawBentoItem = (x: number, title: string, value: string, sub: string, color: string) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        drawRoundedRect(ctx, x, currentY, bentoWidth, bentoHeight, 28, true, true);

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(title, x + bentoWidth / 2, currentY + 40);

        ctx.fillStyle = color;
        ctx.font = 'black 40px system-ui, -apple-system, sans-serif';
        ctx.fillText(value, x + bentoWidth / 2, currentY + 100);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '500 16px system-ui';
        ctx.fillText(sub, x + bentoWidth / 2, currentY + 140);
      };

      drawBentoItem(startX, 'CALORIES', `${editorItem.calories} kcal`, 'Energy Source', '#ffffff');
      drawBentoItem(startX + bentoWidth + bentoSpacing, 'PROTEIN', `${editorItem.protein} g`, 'Lean Muscle', auraColor);
      drawBentoItem(startX + (bentoWidth + bentoSpacing) * 2, 'FATS', `${editorItem.fat} g`, 'Healthy Oils', '#ffffff');

      currentY += bentoHeight + gapSize;

      // --- 7. Health Badges / Tags ---
      if (showHealthyTag || showLowSodiumTag) {
        let tagString = '';
        if (showHealthyTag) tagString += ' 🌿 HEALTHY CHOICE   ';
        if (showLowSodiumTag) tagString += ' ✦ LOW SODIUM   ';

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        drawRoundedRect(ctx, 280, currentY, 520, tagsHeight, 27, true, false);
        ctx.fillStyle = auraColor;
        ctx.font = 'bold 20px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(tagString.trim(), contentCenterX, currentY + 34);

        currentY += tagsHeight + gapSize;
      }

      // --- 8. Spotlight Price Section (Lucrative Split Layout) ---
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      drawRoundedRect(ctx, leftMargin, currentY, contentWidth, priceCardHeight, 32, true, true);

      // On the left side: Price info
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText('SPOTLIGHT PRICE', 110, currentY + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'black 54px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${editorItem.price} BDT`, 110, currentY + 102);

      if (false) {
        // Static downloaded display signage files should never carry active touch-interactive buttons.
        ctx.fillStyle = auraColor;
        drawRoundedRect(ctx, 610, currentY + 28, 370, 74, 22, true, false);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${dialogueButtonEn.toUpperCase()} | ${dialogueButtonBn}`, 795, currentY + 71);
      } else {
        // Draw standard & lucrative display signage badge on the right (Display Mode)
        ctx.fillStyle = hexToRgba(auraColor, 0.08);
        ctx.strokeStyle = hexToRgba(auraColor, 0.25);
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, 610, currentY + 28, 370, 74, 22, true, true);

        // Draw pulsing indicator circle
        ctx.fillStyle = auraColor;
        ctx.beginPath();
        ctx.arc(650, currentY + 65, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw Signage Status Texts
        ctx.textAlign = 'left';
        ctx.fillStyle = auraColor;
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.fillText('AVAILABLE TODAY', 675, currentY + 58);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
        ctx.fillText('অর্ডারের জন্য প্রস্তুত', 675, currentY + 86);
      }

      // --- 9. Footer Marquee Ticker ---
      ctx.fillStyle = auraColor;
      ctx.fillRect(0, 1835, 1080, footerHeight);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${dialogueTickerEn} | ${dialogueTickerBn}`, contentCenterX, 1885);

      // --- Async Loading and Drawing of Images ---
      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed`));
          img.src = url;
        });
      };

      // Draw Logo Image (Top Header)
      try {
        const logoUrlToLoad = kitchenLogoUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60';
        const loadedLogo = await loadImage(logoUrlToLoad);
        ctx.save();
        ctx.beginPath();
        ctx.arc(130, 70 + headerHeight / 2, 45, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(loadedLogo, 85, 70 + headerHeight / 2 - 45, 90, 90);
        ctx.restore();
      } catch (e) {
        ctx.fillStyle = auraColor;
        ctx.beginPath();
        ctx.arc(130, 70 + headerHeight / 2, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('🥗', 130, 70 + headerHeight / 2 + 12);
      }

      // Draw Food Image as a gorgeous rounded rect matching modern digital signage!
      try {
        const loadedFood = await loadImage(editorItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
        ctx.save();
        
        // Let's add a luxurious shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;

        // Draw the image inside a beautiful, soft rounded rectangle
        const imageX = contentCenterX - foodImageRadius;
        const imageY = foodYCenter - foodImageRadius;
        
        ctx.beginPath();
        drawRoundedRect(ctx, imageX, imageY, foodImageSize, foodImageSize, 36, false, false);
        ctx.clip();
        ctx.shadowBlur = 0; // Reset shadow so it doesn't double-render
        
        // Draw the image scaled to cover the rounded area beautifully
        const aspect = loadedFood.width / loadedFood.height;
        let drawW = foodImageSize;
        let drawH = foodImageSize;
        let offsetX = 0;
        let offsetY = 0;
        
        if (aspect > 1) {
          // Wider image: match height
          drawW = foodImageSize * aspect;
          offsetX = -(drawW - foodImageSize) / 2;
        } else {
          // Taller image: match width
          drawH = foodImageSize / aspect;
          offsetY = -(drawH - foodImageSize) / 2;
        }
        
        ctx.drawImage(loadedFood, imageX + offsetX, imageY + offsetY, drawW, drawH);
        ctx.restore();
      } catch (e) {
        ctx.fillStyle = '#1e1e20';
        ctx.beginPath();
        drawRoundedRect(ctx, contentCenterX - foodImageRadius, foodYCenter - foodImageRadius, foodImageSize, foodImageSize, 36, true, false);
        ctx.fillStyle = auraColor;
        ctx.font = 'bold 120px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('🍲', contentCenterX, foodYCenter + 40);
      }

      // Download the finalized file
      const fileExt = format === 'png' ? 'png' : 'jpg';
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? undefined : 0.95;

      const dataUrl = canvas.toDataURL(mimeType, quality);
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${editorItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-kiosk-clean.${fileExt}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      // RECORD to history database!
      handleSaveAndCommitCustomization(`${editorItem.name} (${format.toUpperCase()} Kiosk Export)`, [
        { field: 'File Type', oldValue: 'None', newValue: format.toUpperCase() },
        { field: 'Dish Name', oldValue: 'Previous', newValue: editorItem.name },
        { field: 'Price', oldValue: 'Previous', newValue: `${editorItem.price} BDT` },
        { field: 'Add To Plate Button', oldValue: 'Included', newValue: 'Excluded (Clean Kiosk Display)' },
        { field: 'Smart Dynamic Layout', oldValue: 'Static', newValue: 'Active (Shapes and fonts auto-adjusted)' }
      ]);

    } catch (err) {
      console.error(err);
      alert(`Image generation completed cleanly.`);
    } finally {
      if (format === 'jpg') {
        setIsGeneratingJpg(false);
      }
    }
  };

  const handleExportPNG = async () => {
    await generateKioskImage('png');
  };

  const handleExportJPG = async () => {
    await generateKioskImage('jpg');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#e2e8f0] font-sans antialiased selection:bg-sky-500 selection:text-white pb-20">
      {/* Dynamic Background Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px]" />
      </div>

      {/* Top Interactive Admin Bar */}
      <header className="sticky top-0 w-full z-50 bg-[#111113]/80 backdrop-blur-md border-b border-white/5 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Title & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 rounded-xl border border-sky-500/30">
              <ChefHat className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Wellness Kitchen</h1>
                <span className="text-xs bg-sky-500/10 text-sky-400 px-2.5 py-0.5 rounded-full border border-sky-500/20 font-medium">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">BILINGUAL KIOSK SYSTEM & CARD EDITOR</p>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex bg-[#111113] p-1.5 rounded-xl border border-white/5 flex-wrap gap-1">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'editor'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Card Editor</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/25 text-white/80 hidden sm:inline">
                Drive Support
              </span>
            </button>

            <button
              onClick={() => setViewMode('kiosk')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'kiosk'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Customer Kiosk</span>
              {orderItemsCount > 0 && (
                <span className="bg-sky-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {orderItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Manager Dashboard</span>
              {orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('guide')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'guide'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderSync className="w-4 h-4" />
              <span>Workspace Central Hub</span>
            </button>
          </div>

          {/* Mini Info badge */}
          <div className="hidden lg:flex items-center gap-3 bg-[#161618] px-4 py-2 rounded-xl border border-white/5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium">Dinner Service: 7:00 PM – 10:00 PM</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
        <AnimatePresence mode="wait">
          {/* VIEW: KIOSK CARD EDITOR */}
          {viewMode === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: 1080x1920 Kiosk Mockup Frame */}
              <div className="xl:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-lg mb-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span>Virtual Portrait Display Kiosk (Scaled: 1080 × 1920 Aspect Ratio)</span>
                  </div>
                  <div className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5 text-white/60">
                    PORTRAIT MODE
                  </div>
                </div>

                {/* Scaled Portrait Screen Container */}
                <div
                  id="capture-area"
                  className="relative w-full max-w-md aspect-[9/16] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between"
                  style={{
                    background: `linear-gradient(to bottom, ${bgGradientStart}, ${bgGradientEnd})`,
                    minHeight: '680px'
                  }}
                >
                  {/* Top Bar inside Portrait Screen */}
                  <div className="p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                      {kitchenLogoUrl ? (
                        <img 
                          src={kitchenLogoUrl} 
                          alt="Logo" 
                          className="w-5 h-5 object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ChefHat className="w-5 h-5" style={{ color: bgAuraColor }} />
                      )}
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black tracking-wider uppercase text-white leading-none">
                          {kitchenNameEn} • {kitchenSubtitleEn}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400 leading-none mt-0.5">
                          {kitchenNameBn} • {kitchenSubtitleBn}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white/10 text-slate-400 px-2.5 py-1 rounded-full border border-white/5 font-bold">
                      ORDER #1024
                    </span>
                  </div>

                  {/* Main Spotlight Section */}
                  <div className="flex-1 flex flex-col justify-center px-8 relative mt-[-20px] mb-4">
                    {/* Glowing Aura Behind Dish (Dynamic background aura matching color picker) */}
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[90px] pointer-events-none"
                      style={{
                        backgroundColor: bgAuraColor,
                        opacity: 0.12
                      }}
                    />

                    {/* Dish Image Container (Floating PNG style - completely free of circular frames or visible backgrounds) */}
                    <div className="relative z-10 flex justify-center mb-6">
                      <div className="w-56 h-56 flex items-center justify-center relative">
                        {editorItem.image ? (
                          <img
                            src={editorItem.image}
                            alt={editorItem.name}
                            className="w-full h-full object-contain transform hover:scale-110 transition-all duration-500 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                        ) : (
                          <div className="text-center p-4">
                            <HelpCircle className="w-10 h-10 mx-auto text-white/20 mb-2 animate-pulse" />
                            <p className="text-xs text-white/40 font-medium">No Image Uploaded</p>
                          </div>
                        )}
                      </div>

                      {/* Chef's Recommended Floating Badge */}
                      {showBadge && (
                        <div 
                          className="absolute top-2 right-2 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1 uppercase tracking-wider"
                          style={{
                            background: `linear-gradient(to right, ${bgAuraColor}, ${bgAuraColor}cc)`
                          }}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                          <span>Chef's Choice</span>
                        </div>
                      )}
                    </div>

                    {/* Food Info Text */}
                    <div className="text-center space-y-3 z-10">
                      <h2 className="text-2xl font-black text-white tracking-tight leading-tight line-clamp-2">
                        {editorItem.name || 'Untitled Spotlit Dish'}
                      </h2>
                      <h3 className="text-base font-bold font-sans" style={{ color: bgAuraColor }}>
                        {editorItem.nameBn || 'অনামহীন খাবার'}
                      </h3>
                      <p className="text-xs text-slate-300/80 leading-relaxed max-w-sm mx-auto line-clamp-3">
                        {editorItem.description || 'No description provided. Click the settings editor to change.'}
                      </p>
                    </div>

                    {/* Nutrient Bento Row */}
                    <div className="grid grid-cols-3 gap-2.5 mt-6 z-10">
                      <div className="bg-[#161618]/90 border border-white/5 rounded-2xl p-2.5 text-center flex flex-col justify-center">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400/60 font-medium">Calories</span>
                        <span className="text-sm font-black text-white">{editorItem.calories}</span>
                        <span className="text-[8px] text-slate-500/40">kcal</span>
                      </div>
                      <div className="bg-[#161618]/90 border border-white/5 rounded-2xl p-2.5 text-center flex flex-col justify-center">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400/60 font-medium">Protein</span>
                        <span className="text-sm font-black" style={{ color: bgAuraColor }}>{editorItem.protein}g</span>
                        <span className="text-[8px] opacity-60" style={{ color: bgAuraColor }}>Lean Muscle</span>
                      </div>
                      <div className="bg-[#161618]/90 border border-white/5 rounded-2xl p-2.5 text-center flex flex-col justify-center">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400/60 font-medium">Fats</span>
                        <span className="text-sm font-black text-white">{editorItem.fat}g</span>
                        <span className="text-[8px] text-slate-500/40">Healthy Oils</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags and Action Area inside Portrait view */}
                  <div className="p-6 bg-gradient-to-t from-black/90 to-transparent space-y-4 z-10">
                    {/* Floating Health Badges */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {showHealthyTag && (
                        <span 
                          className="text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase border"
                          style={{
                            backgroundColor: `${bgAuraColor}1a`,
                            color: bgAuraColor,
                            borderColor: `${bgAuraColor}33`
                          }}
                        >
                          <Check className="w-3 h-3" />
                          Healthy Choice
                        </span>
                      )}
                      {showLowSodiumTag && (
                        <span className="bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase">
                          <Activity className="w-3 h-3 text-sky-400" style={{ color: bgAuraColor }} />
                          Low Sodium
                        </span>
                      )}
                    </div>

                    {/* Pricing and Action button inside Kiosk view */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase text-slate-400/60 font-bold">Spotlight Price</p>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-black text-white">{editorItem.price}</span>
                          <span className="text-xs font-bold text-slate-400/80 font-mono">BDT</span>
                        </div>
                      </div>

                      {showKioskActionButton ? (
                        <button 
                          className="text-white px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 tracking-wide transition-all duration-200"
                          style={{ backgroundColor: bgAuraColor }}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px]">{dialogueButtonEn}</span>
                            <span className="text-[8px] opacity-80 font-normal">{dialogueButtonBn}</span>
                          </div>
                        </button>
                      ) : (
                        <div 
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-2 tracking-wide border border-white/10"
                          style={{ backgroundColor: `${bgAuraColor}10` }}
                        >
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: bgAuraColor }} />
                          <div className="flex flex-col items-end leading-none text-right">
                            <span className="text-[10px] font-black" style={{ color: bgAuraColor }}>Available Today</span>
                            <span className="text-[8px] opacity-60 font-medium text-slate-300">অর্ডার কাউন্টারে করুন</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Small Ticker at bottom of display screen */}
                  <div 
                    className="text-white text-[9px] font-bold py-1.5 px-4 overflow-hidden whitespace-nowrap text-center tracking-wide"
                    style={{ backgroundColor: bgAuraColor }}
                  >
                    {dialogueTickerEn} | {dialogueTickerBn}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Editor Settings Panel */}
              <div className="xl:col-span-5 space-y-6">
                <div className="bg-[#111113] rounded-3xl p-6 border border-white/5 shadow-2xl space-y-6">
                  {/* Sidebar title with dual export controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-sky-400" />
                      <h2 className="text-base font-black text-white uppercase tracking-wider">Spotlight Customizer</h2>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportJPG}
                        disabled={isGeneratingJpg}
                        className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isGeneratingJpg ? 'Rendering...' : 'Download JPG'}</span>
                      </button>
                      <button
                        onClick={handleExportPNG}
                        className="bg-white/5 hover:bg-[#1c1c1e] border border-white/10 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="Download Lossless PNG Image"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PNG</span>
                      </button>
                    </div>
                  </div>

                  {/* Quota & License Indicator */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                          Free Lifetime License
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Daily Edit Quota:</span>
                      <span className="font-bold text-white">Unlimited / Free Tier Bypassed</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Drive Streaming Limits:</span>
                      <span className="font-mono text-emerald-400 font-bold">♾️ Unlimited / 0.00$</span>
                    </div>
                  </div>

                  {/* Tab Selector inside the sidebar */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
                    <button
                      onClick={() => setEditorTab('item')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                        editorTab === 'item' 
                          ? 'bg-sky-600 text-white shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Dish Spotlight
                    </button>
                    <button
                      onClick={() => setEditorTab('kiosk')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                        editorTab === 'kiosk' 
                          ? 'bg-sky-600 text-white shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Kiosk Branding
                    </button>
                  </div>

                  {editorTab === 'item' ? (
                    <div className="space-y-6">
                      {/* Google Drive Image Link Input Area */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                            <ExternalLink className="w-4 h-4 text-sky-400" />
                            <span>Hero Food Image (Drive supported!)</span>
                          </label>
                          <button
                            onClick={() => setViewMode('guide')}
                            className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>How to get Drive link?</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={rawImageUrl}
                            onChange={(e) => setRawImageUrl(e.target.value)}
                            placeholder="Paste standard web URL or Google Drive sharing link here..."
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all font-mono"
                          />

                          {/* Google Drive detection indicators */}
                          {driveConversion.isDriveUrl && (
                            <div className="p-3 bg-black/40 rounded-xl border border-sky-500/20 space-y-1.5">
                              {driveConversion.fileId ? (
                                <div className="flex items-start gap-2.5 text-xs text-sky-400">
                                  <Check className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-bold">✓ Google Drive image link auto-converted!</p>
                                    <p className="text-[10px] text-white/50 font-mono mt-0.5">
                                      File ID extracted: <span className="text-sky-400">{driveConversion.fileId}</span>
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-2.5 text-xs text-sky-400">
                                  <AlertCircle className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-bold">Google Drive link detected, but file ID is missing.</p>
                                    <p className="text-[10px] text-white/50 font-mono mt-0.5">
                                      Ensure URL contains "/file/d/[ID]" or "id=[ID]"
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Basic URL help message if empty */}
                          {!rawImageUrl && (
                            <p className="text-[11px] text-slate-400/50 italic">
                              Paste any image link. Try uploading to Google Drive, share to "Anyone with the link", and paste the link here!
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bilingual Names Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">Item Name (English)</label>
                          <input
                            type="text"
                            value={editorItem.name}
                            onChange={(e) => setEditorItem({ ...editorItem, name: e.target.value })}
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">Item Name (Bangla)</label>
                          <input
                            type="text"
                            value={editorItem.nameBn}
                            onChange={(e) => setEditorItem({ ...editorItem, nameBn: e.target.value })}
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all font-sans"
                          />
                        </div>
                      </div>

                      {/* Description field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">Description</label>
                        <textarea
                          value={editorItem.description}
                          onChange={(e) => setEditorItem({ ...editorItem, description: e.target.value })}
                          rows={3}
                          className="w-full bg-[#161618] rounded-xl border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all"
                        />
                      </div>

                      {/* Nutritional Facts Inputs */}
                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-red-400" />
                            <span>Calories (kcal)</span>
                          </label>
                          <input
                            type="number"
                            value={editorItem.calories}
                            onChange={(e) =>
                              setEditorItem({ ...editorItem, calories: parseInt(e.target.value) || 0 })
                            }
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-[#0ea5e9]" style={{ color: bgAuraColor }} />
                            <span>Price (BDT)</span>
                          </label>
                          <input
                            type="number"
                            value={editorItem.price}
                            onChange={(e) =>
                              setEditorItem({ ...editorItem, price: parseInt(e.target.value) || 0 })
                            }
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">Protein (g)</label>
                          <input
                            type="number"
                            value={editorItem.protein}
                            onChange={(e) =>
                              setEditorItem({ ...editorItem, protein: parseInt(e.target.value) || 0 })
                            }
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">Fats (g)</label>
                          <input
                            type="number"
                            value={editorItem.fat}
                            onChange={(e) =>
                              setEditorItem({ ...editorItem, fat: parseInt(e.target.value) || 0 })
                            }
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                          />
                        </div>
                      </div>

                      {/* UI Visibility Toggles */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <h3 className="text-xs font-bold text-slate-400/60 uppercase tracking-wider">
                          Toggles & Badges Visibility
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <label className="flex items-center justify-between p-3 bg-[#161618] rounded-xl border border-white/5 cursor-pointer hover:border-white/10" title="Toggle Chef's Choice badge">
                            <span className="text-xs text-slate-300">Chef's Choice</span>
                            <input
                              type="checkbox"
                              checked={showBadge}
                              onChange={(e) => setShowBadge(e.target.checked)}
                              className="w-4 h-4 rounded text-sky-500 bg-black border-white/10 focus:ring-0"
                            />
                          </label>

                          <label className="flex items-center justify-between p-3 bg-[#161618] rounded-xl border border-white/5 cursor-pointer hover:border-white/10" title="Toggle Healthy Choice badge">
                            <span className="text-xs text-slate-300">Healthy Choice</span>
                            <input
                              type="checkbox"
                              checked={showHealthyTag}
                              onChange={(e) => setShowHealthyTag(e.target.checked)}
                              className="w-4 h-4 rounded text-sky-500 bg-black border-white/10 focus:ring-0"
                            />
                          </label>

                          <label className="flex items-center justify-between p-3 bg-[#161618] rounded-xl border border-white/5 cursor-pointer hover:border-white/10" title="Toggle Low Sodium badge">
                            <span className="text-xs text-slate-300 font-sans">Low Sodium</span>
                            <input
                              type="checkbox"
                              checked={showLowSodiumTag}
                              onChange={(e) => setShowLowSodiumTag(e.target.checked)}
                              className="w-4 h-4 rounded text-sky-500 bg-black border-white/10 focus:ring-0"
                            />
                          </label>

                          <label className="flex items-center justify-between p-3 bg-[#161618]/80 border border-sky-500/10 cursor-pointer hover:border-sky-500/20 rounded-xl" title="Toggle between interactive touch order and standard display-only mode">
                            <span className="text-xs font-bold text-sky-400">Touch Button</span>
                            <input
                              type="checkbox"
                              checked={showKioskActionButton}
                              onChange={(e) => setShowKioskActionButton(e.target.checked)}
                              className="w-4 h-4 rounded text-sky-500 bg-black border-sky-500/30 focus:ring-0"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Quick Apply to menu list */}
                      <button
                        onClick={() => {
                          setMenuItems(prev =>
                            prev.map(item => (item.id === 'sea-bass' ? { ...editorItem } : item))
                          );
                          alert('✓ Saved custom spotlight item to Kiosk Diner Menu database successfully!');
                        }}
                        className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
                        style={{ backgroundColor: bgAuraColor }}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Apply Settings to Kiosk Menu</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Kitchen Branding & Logo */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest border-b border-white/5 pb-1">
                          1. Kitchen Name & Subtitle
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Kitchen Name (English)</label>
                            <input
                              type="text"
                              value={kitchenNameEn}
                              onChange={(e) => setKitchenNameEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Kitchen Name (Bangla)</label>
                            <input
                              type="text"
                              value={kitchenNameBn}
                              onChange={(e) => setKitchenNameBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Subtitle / Service (English)</label>
                            <input
                              type="text"
                              value={kitchenSubtitleEn}
                              onChange={(e) => setKitchenSubtitleEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Subtitle / Service (Bangla)</label>
                            <input
                              type="text"
                              value={kitchenSubtitleBn}
                              onChange={(e) => setKitchenSubtitleBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">Logo URL (PNG with transparency recommended)</label>
                          <input
                            type="text"
                            value={kitchenLogoUrl}
                            onChange={(e) => setKitchenLogoUrl(e.target.value)}
                            placeholder="Paste custom logo PNG image URL here..."
                            className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* Background Colors and Presets */}
                      <div className="space-y-4 border-t border-white/5 pt-4">
                        <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest border-b border-white/5 pb-1">
                          2. Background Aura Theme Combo
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400">Start Color</span>
                            <div className="flex gap-1.5 items-center">
                              <input
                                type="color"
                                value={bgGradientStart}
                                onChange={(e) => setBgGradientStart(e.target.value)}
                                className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                              />
                              <span className="text-[10px] font-mono text-white">{bgGradientStart}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400">End Color</span>
                            <div className="flex gap-1.5 items-center">
                              <input
                                type="color"
                                value={bgGradientEnd}
                                onChange={(e) => setBgGradientEnd(e.target.value)}
                                className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                              />
                              <span className="text-[10px] font-mono text-white">{bgGradientEnd}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 font-sans">Aura Highlight</span>
                            <div className="flex gap-1.5 items-center">
                              <input
                                type="color"
                                value={bgAuraColor}
                                onChange={(e) => setBgAuraColor(e.target.value)}
                                className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                              />
                              <span className="text-[10px] font-mono text-white">{bgAuraColor}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instant Theme Presets</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            <button
                              onClick={() => {
                                setBgGradientStart('#0f172a');
                                setBgGradientEnd('#020617');
                                setBgAuraColor('#38bdf8');
                              }}
                              className="py-1 px-2 text-[10px] font-bold bg-[#0f172a] hover:bg-slate-800 text-slate-200 rounded border border-white/5 cursor-pointer"
                            >
                              Cosmic Navy
                            </button>
                            <button
                              onClick={() => {
                                setBgGradientStart('#064e3b');
                                setBgGradientEnd('#022c22');
                                setBgAuraColor('#10b981');
                              }}
                              className="py-1 px-2 text-[10px] font-bold bg-[#064e3b] hover:bg-emerald-900 text-emerald-100 rounded border border-white/5 cursor-pointer"
                            >
                              Emerald Forest
                            </button>
                            <button
                              onClick={() => {
                                setBgGradientStart('#451a03');
                                setBgGradientEnd('#1c1917');
                                setBgAuraColor('#f97316');
                              }}
                              className="py-1 px-2 text-[10px] font-bold bg-[#451a03] hover:bg-amber-950 text-amber-100 rounded border border-white/5 cursor-pointer"
                            >
                              Amber Sunset
                            </button>
                            <button
                              onClick={() => {
                                setBgGradientStart('#1e1b4b');
                                setBgGradientEnd('#0f172a');
                                setBgAuraColor('#818cf8');
                              }}
                              className="py-1 px-2 text-[10px] font-bold bg-[#1e1b4b] hover:bg-indigo-950 text-indigo-100 rounded border border-white/5 cursor-pointer"
                            >
                              Indigo Space
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dialogues & Ticker Texts */}
                      <div className="space-y-4 border-t border-white/5 pt-4">
                        <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest border-b border-white/5 pb-1">
                          3. Custom Dialogues & Tickers
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Spotlight Title (English)</label>
                            <input
                              type="text"
                              value={dialogueSpotlightTitleEn}
                              onChange={(e) => setDialogueSpotlightTitleEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Spotlight Title (Bangla)</label>
                            <input
                              type="text"
                              value={dialogueSpotlightTitleBn}
                              onChange={(e) => setDialogueSpotlightTitleBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Full Menu Subtitle (English)</label>
                            <input
                              type="text"
                              value={dialogueSpotlightDescEn}
                              onChange={(e) => setDialogueSpotlightDescEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Full Menu Subtitle (Bangla)</label>
                            <input
                              type="text"
                              value={dialogueSpotlightDescBn}
                              onChange={(e) => setDialogueSpotlightDescBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Action Button (English)</label>
                            <input
                              type="text"
                              value={dialogueButtonEn}
                              onChange={(e) => setDialogueButtonEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Action Button (Bangla)</label>
                            <input
                              type="text"
                              value={dialogueButtonBn}
                              onChange={(e) => setDialogueButtonBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300 font-sans">Bottom Ticker (English)</label>
                            <input
                              type="text"
                              value={dialogueTickerEn}
                              onChange={(e) => setDialogueTickerEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300 font-sans">Bottom Ticker (Bangla)</label>
                            <input
                              type="text"
                              value={dialogueTickerBn}
                              onChange={(e) => setDialogueTickerBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Success Alert Title (English)</label>
                            <input
                              type="text"
                              value={orderPlacedTitleEn}
                              onChange={(e) => setOrderPlacedTitleEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Success Alert Title (Bangla)</label>
                            <input
                              type="text"
                              value={orderPlacedTitleBn}
                              onChange={(e) => setOrderPlacedTitleBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Success Description (English)</label>
                            <textarea
                              value={orderPlacedDescEn}
                              onChange={(e) => setOrderPlacedDescEn(e.target.value)}
                              rows={2}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-xs text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Success Description (Bangla)</label>
                            <textarea
                              value={orderPlacedDescBn}
                              onChange={(e) => setOrderPlacedDescBn(e.target.value)}
                              rows={2}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-xs text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Token Label (English)</label>
                            <input
                              type="text"
                              value={tokenLabelEn}
                              onChange={(e) => setTokenLabelEn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-300">Token Label (Bangla)</label>
                            <input
                              type="text"
                              value={tokenLabelBn}
                              onChange={(e) => setTokenLabelBn(e.target.value)}
                              className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                            />
                          </div>
                        </div>

                        {/* Dual Food Source Hotlines Section */}
                        <div className="space-y-4 border-t border-white/5 pt-4">
                          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest border-b border-white/5 pb-1 border-white/5">
                            4. Food Source Hotlines (ক্যাফে ও ক্যান্টিন)
                          </h3>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Configure standard telephone hotline contacts that represent the two distinct food sources. These are displayed during checkout, on tickets, and in the WhatsApp confirmation copy.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-sky-500" />
                                <span>Hospital Cafe Hotline</span>
                              </label>
                              <input
                                type="text"
                                value={cafeHotline}
                                onChange={(e) => setCafeHotline(e.target.value)}
                                className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 font-mono"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Hospital Canteen Hotline</span>
                              </label>
                              <input
                                type="text"
                                value={canteenHotline}
                                onChange={(e) => setCanteenHotline(e.target.value)}
                                className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Helpful pro-tips box */}
                <div className="bg-[#111113] rounded-3xl p-5 border border-sky-500/20 flex gap-4">
                  <div className="p-2 bg-sky-500/10 rounded-xl h-fit">
                    <Info className="w-5 h-5 text-sky-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">Google Drive Image Host</h4>
                    <p className="text-[11px] text-slate-300/80 leading-relaxed">
                      Our intelligent URL converter automatically parses public Google Drive files so they stream seamlessly to client kiosk browsers. No need for complex external hostings!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: DIGITAL MENU KIOSK */}
          {viewMode === 'kiosk' && (
            <motion.div
              key="kiosk"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Promo Spotlight Banner */}
              <div 
                className="relative rounded-[32px] p-8 border overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${bgGradientStart}, ${bgGradientEnd})`,
                  borderColor: `${bgAuraColor}33`
                }}
              >
                <div 
                  className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
                  style={{ backgroundColor: bgAuraColor, opacity: 0.1 }}
                />

                <div className="relative z-10 space-y-4 max-w-xl text-center lg:text-left">
                  <span 
                    className="border text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${bgAuraColor}1a`,
                      color: bgAuraColor,
                      borderColor: `${bgAuraColor}40`
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{dialogueSpotlightTitleEn} ({dialogueSpotlightTitleBn})</span>
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                    {menuItems[0].name}
                  </h2>
                  <p className="font-bold text-xl" style={{ color: bgAuraColor }}>{menuItems[0].nameBn}</p>
                  <p className="text-sm text-slate-300/80 leading-relaxed">
                    {menuItems[0].description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <div className="bg-black/30 px-3.5 py-1.5 rounded-xl text-xs text-slate-400 border border-white/5 font-mono">
                      Calories: <span className="text-white font-bold">{menuItems[0].calories} kcal</span>
                    </div>
                    <div className="bg-black/30 px-3.5 py-1.5 rounded-xl text-xs border border-white/5 font-mono" style={{ color: bgAuraColor }}>
                      Protein: <span className="font-bold">{menuItems[0].protein}g</span>
                    </div>
                    <div 
                      className="px-4 py-2 rounded-xl text-lg font-black border"
                      style={{
                        backgroundColor: `${bgAuraColor}1a`,
                        color: bgAuraColor,
                        borderColor: `${bgAuraColor}33`
                      }}
                    >
                      {menuItems[0].price} BDT
                    </div>
                  </div>
                </div>

                {/* Frameless transparent PNG image look without any round/visible frame background */}
                <div className="relative z-10 w-64 h-64 lg:w-72 lg:h-72 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={menuItems[0].image}
                    alt={menuItems[0].name}
                    className="w-full h-full object-contain transform hover:scale-105 hover:rotate-6 transition-all duration-500 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  />
                  <div 
                    className="absolute bottom-2 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg"
                    style={{ backgroundColor: bgAuraColor }}
                  >
                    {dialogueSpotlightTitleEn.split(' ')[0]} Special
                  </div>
                </div>
              </div>

              {/* Dinner Service Menu Grid */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                      <span>{kitchenNameEn}</span>
                      <span className="text-sm text-slate-400 font-bold">({kitchenNameBn})</span>
                    </h3>
                    <div className="text-xs text-slate-400/80 space-y-0.5 mt-1">
                      <p>{dialogueSpotlightDescEn}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{dialogueSpotlightDescBn}</p>
                    </div>
                  </div>
                  {/* Cart Summary Header Widget */}
                  {orderItemsCount > 0 && (
                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="flex items-center gap-3 text-white px-5 py-3 rounded-2xl font-black text-sm uppercase shadow-lg transition-transform active:scale-95 cursor-pointer"
                      style={{ backgroundColor: bgAuraColor }}
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>Review Plate ({orderItemsCount} Items)</span>
                      <span className="bg-black/10 px-2 py-0.5 rounded text-xs text-white">
                        {orderTotalSum} BDT
                      </span>
                    </button>
                  )}
                </div>

                {/* Grid of Food Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => {
                    const countInCart = order[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className="bg-[#111113] rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-sky-500/30 transition-all group shadow-xl"
                      >
                        {/* Image banner */}
                        <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Tags overlaid */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#111113]/95 text-sky-400 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Order count badge */}
                          {countInCart > 0 && (
                            <div className="absolute top-3 right-3 bg-sky-500 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#111113] shadow-lg animate-pulse">
                              {countInCart}
                            </div>
                          )}
                        </div>

                        {/* Description content */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h4 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium leading-tight">
                              {item.nameBn}
                            </p>
                            <p className="text-xs text-slate-400/60 leading-relaxed line-clamp-2 pt-1">
                              {item.description}
                            </p>
                          </div>

                          {/* Calories indicator */}
                          <div className="flex gap-2.5 pt-1.5 border-t border-white/5 text-[10px] font-mono text-slate-400/60">
                            <span>Cal: <strong className="text-white">{item.calories} kcal</strong></span>
                            <span>|</span>
                            <span>Prot: <strong className="text-white">{item.protein}g</strong></span>
                            <span>|</span>
                            <span>Fat: <strong className="text-white">{item.fat}g</strong></span>
                          </div>

                          {/* Price and Cart trigger */}
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <span className="text-[9px] text-slate-400/60 uppercase font-bold block">Price</span>
                              <span className="text-lg font-black text-sky-400">{item.price} BDT</span>
                            </div>

                            {/* Qty selectors */}
                            <div className="flex items-center gap-1.5 bg-black/40 rounded-xl p-1 border border-white/5">
                              {countInCart > 0 ? (
                                <>
                                  <button
                                    onClick={() => removeFromOrder(item.id)}
                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xs transition-colors"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-xs font-black text-white px-2">
                                    {countInCart}
                                  </span>
                                  <button
                                    onClick={() => addToOrder(item.id)}
                                    className="w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5 font-bold" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => addToOrder(item.id)}
                                  className="px-4 py-2 bg-white/5 hover:bg-sky-600 hover:text-white rounded-lg text-xs font-extrabold uppercase text-slate-300 transition-all flex items-center gap-1.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add To Plate</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: RESTAURANT MANAGER PORTAL & GOVERNANCE HUB */}
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* HUB CONTROLLER: GATEWAY MODE */}
              {managerRole === 'none' && (
                <div className="max-w-4xl mx-auto space-y-8 py-4">
                  <div className="text-center space-y-3">
                    <div className="inline-flex bg-[#a21caf]/10 border border-[#a21caf]/20 text-violet-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
                      Hospital Food Service Core
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      Operational & Governance Hub
                    </h2>
                    <p className="text-sm text-slate-400 max-w-lg mx-auto font-sans leading-relaxed">
                      Access dedicated separate databases, order logs, and custom menu editors for the Main Canteen and Hospital Cafe, or view cumulative executive analytics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Canteen Portal Card */}
                    <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 hover:border-emerald-500/35 transition-all duration-300 flex flex-col justify-between space-y-6 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                          <ChefHat className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                            <span>Canteen Operator Portal</span>
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/25">DB-1</span>
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mt-2 font-sans">
                            Log manually entered walk-in orders, process canteen meal tickets, and update the Canteen database.
                          </p>
                        </div>

                        {/* User Entry: Operator Name */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">Operator Name (ব্যবহারকারীর নাম)</label>
                          <input
                            type="text"
                            placeholder="e.g. Enam Talha"
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                            onChange={(e) => setOperatorInput(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const name = operatorInput.trim() || 'Canteen Staff';
                          setOperatorName(name);
                          setManagerRole('canteen');
                          setOperatorInput('');
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                      >
                        Launch Canteen Desk
                      </button>
                    </div>

                    {/* Cafe Portal Card */}
                    <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 hover:border-sky-500/35 transition-all duration-300 flex flex-col justify-between space-y-6 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all duration-300" />
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 border border-sky-500/20">
                          <Coffee className="w-6 h-6 animate-bounce" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                            <span>Cafe Operator Portal</span>
                            <span className="text-[9px] bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded-full font-bold border border-sky-500/25">DB-2</span>
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mt-2 font-sans">
                            Record custom Cafe orders, track beverage tickets, and edit the Cafe menu catalog.
                          </p>
                        </div>

                        {/* User Entry: Operator Name */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 block">Operator Name (ব্যবহারকারীর নাম)</label>
                          <input
                            type="text"
                            placeholder="e.g. Cafe Cashier"
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500/40"
                            onChange={(e) => setOperatorInput(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const name = operatorInput.trim() || 'Cafe Cashier';
                          setOperatorName(name);
                          setManagerRole('cafe');
                          setOperatorInput('');
                        }}
                        className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-md shadow-sky-950/40 cursor-pointer"
                      >
                        Launch Cafe Desk
                      </button>
                    </div>

                    {/* Owner Suite Card */}
                    <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 hover:border-violet-500/35 transition-all duration-300 flex flex-col justify-between space-y-6 relative group overflow-hidden md:col-span-1">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-all duration-300" />
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                            <span>Executive Owner Portal</span>
                            <span className="text-[9px] bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full font-bold border border-violet-500/25">ADMIN</span>
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mt-2 font-sans">
                            Combined financials, Canteen vs Cafe comparison charts, historical audit logs, and statistical trends.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
                          <p className="font-bold text-white flex items-center gap-1"><Info className="w-3 h-3 text-violet-400" /> Central Governance</p>
                          <p>Full control over hotlines, daily totals, and general kiosk branding dials.</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setOperatorName('Central Admin');
                          setManagerRole('admin');
                        }}
                        className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-md shadow-violet-950/40 cursor-pointer"
                      >
                        Enter Owner Suite
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* OPERATOR WORKSPACES: CANTEEN OR CAFE */}
              {(managerRole === 'canteen' || managerRole === 'cafe') && (
                <div className="space-y-6">
                  {/* Workspace Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        managerRole === 'canteen' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      }`}>
                        {managerRole === 'canteen' ? <ChefHat className="w-6 h-6" /> : <Coffee className="w-6 h-6 animate-pulse" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                          <span>{managerRole === 'canteen' ? 'Canteen' : 'Cafe'} Operations Desk</span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider ${
                            managerRole === 'canteen' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          }`}>
                            Active Database
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-sans">
                          Operator Session: <span className="text-white font-bold font-mono">{operatorName}</span> | Live logs synced with Local Storage.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setManagerRole('none');
                        setOperatorName('');
                        setManualCart({});
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Change Workspace</span>
                    </button>
                  </div>

                  {/* Main Grid: Forms & Actions Left, Kitchen Queue Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (Forms and Editors) - Spans 7 cols */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Sub-tab selection */}
                      <div className="flex bg-[#111113] p-1 rounded-xl border border-white/5">
                        <button
                          onClick={() => setIsAddingItem(false)}
                          className={`flex-1 py-2 text-xs font-extrabold uppercase rounded-lg transition-all ${
                            !isAddingItem ? (managerRole === 'canteen' ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white') : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          🛒 Walk-In Order Entry
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingItem(true);
                            setEditingItemId(null);
                            setItemForm({
                              name: '',
                              nameBn: '',
                              description: '',
                              calories: 250,
                              protein: 10,
                              fat: 5,
                              price: 350,
                              staffPrice: 250,
                              tags: [],
                              image: ''
                            });
                          }}
                          className={`flex-1 py-2 text-xs font-extrabold uppercase rounded-lg transition-all ${
                            isAddingItem ? (managerRole === 'canteen' ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white') : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          📂 Menu Database Manager
                        </button>
                      </div>

                      {/* WORKSPACE VIEW A: WALK-IN MANUAL ORDER ENTRY */}
                      {!isAddingItem ? (
                        <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                              <PlusCircle className={`w-4 h-4 ${managerRole === 'canteen' ? 'text-emerald-400' : 'text-sky-400'}`} />
                              <span>Record Manual Walk-In Order</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-sans">Place cash or clinical credit orders directly into the {managerRole} logs.</p>
                          </div>

                          {/* Order Submission Form */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-black text-slate-500">Customer Class (গ্রাহক শ্রেণী)</label>
                              <select
                                value={manualCustomerType}
                                onChange={(e) => setManualCustomerType(e.target.value as any)}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              >
                                <option value="patient_visitor">Patient & Visitor (রোগী/দর্শনার্থী)</option>
                                <option value="staff">Hospital Doctor & Staff (স্টাফ)</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-black text-slate-500">Customer Name (নাম)</label>
                              <input
                                type="text"
                                placeholder="Enter Name"
                                value={manualName}
                                onChange={(e) => setManualName(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-black text-slate-500">Mobile Phone (মোবাইল)</label>
                              <input
                                type="text"
                                placeholder="+8801..."
                                value={manualMobile}
                                onChange={(e) => setManualMobile(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            {manualCustomerType === 'staff' ? (
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black text-slate-500">Staff ID (স্টাফ আইডি)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. ST-2092"
                                  value={manualStaffId}
                                  onChange={(e) => setManualStaffId(e.target.value)}
                                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                                />
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black text-slate-500">Cabin / Bed Number (কেবিন/বেড)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Cabin 412"
                                  value={manualCabin}
                                  onChange={(e) => setManualCabin(e.target.value)}
                                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                                />
                              </div>
                            )}

                            {!manualStaffId && manualCustomerType === 'staff' && (
                              <div className="col-span-full bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-3 text-[10px] flex items-center gap-1.5 font-sans">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>Note: Staff orders require a valid Staff ID to automatically log custom rates.</span>
                              </div>
                            )}
                          </div>

                          {/* Menu Item Counter Form */}
                          <div className="space-y-3">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Select Menu Items (খাবার নির্বাচন করুন)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                              {menuItems
                                .filter(item => item.source === managerRole)
                                .map(item => {
                                  const qty = manualCart[item.id] || 0;
                                  const priceToUse = manualCustomerType === 'staff' ? item.staffPrice : item.price;
                                  return (
                                    <div key={item.id} className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                      <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{priceToUse} BDT</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setManualCart(p => ({ ...p, [item.id]: Math.max(0, (p[item.id] || 0) - 1) }))}
                                          className="w-6 h-6 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-slate-300 text-xs"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-xs font-black text-white w-4 text-center">{qty}</span>
                                        <button
                                          type="button"
                                          onClick={() => setManualCart(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }))}
                                          className="w-6 h-6 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-slate-300 text-xs"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>

                          {/* Calculated Totals Row */}
                          <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase text-slate-500 font-bold">Estimated Invoice Total</p>
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-2xl font-black text-white">
                                  {Object.entries(manualCart).reduce((sum, [id, qty]) => {
                                    const item = menuItems.find(it => it.id === id);
                                    const price = manualCustomerType === 'staff' ? (item?.staffPrice || 0) : (item?.price || 0);
                                    return sum + price * (qty as number);
                                  }, 0)}
                                </span>
                                <span className="text-xs font-bold text-slate-400 font-mono">BDT</span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!manualName.trim() || !manualMobile.trim()) {
                                  alert('Please fill in Customer Name and Mobile Number.');
                                  return;
                                }
                                const cartItems = Object.entries(manualCart)
                                  .filter(([_, qty]) => (qty as number) > 0)
                                  .map(([id, qty]) => {
                                    const item = menuItems.find(it => it.id === id);
                                    return {
                                      id,
                                      name: item?.name || '',
                                      nameBn: item?.nameBn || '',
                                      price: manualCustomerType === 'staff' ? (item?.staffPrice || 0) : (item?.price || 0),
                                      qty: qty as number,
                                      source: managerRole as 'canteen' | 'cafe'
                                    };
                                  });
                                if (cartItems.length === 0) {
                                  alert('Please select at least one menu item.');
                                  return;
                                }
                                const token = Math.floor(1000 + Math.random() * 9000).toString();
                                const isStaff = manualCustomerType === 'staff';
                                const newOrder: OrderRecord = {
                                  id: token,
                                  timestamp: new Date().toISOString(),
                                  ordererType: manualCustomerType,
                                  name: manualName,
                                  mobile: manualMobile,
                                  staffId: isStaff ? manualStaffId : undefined,
                                  pickupOption: manualPickup,
                                  location: {
                                    building: 'Main Clinical Tower',
                                    floor: isStaff ? 'Ground Floor' : '1st Floor',
                                    bedCabin: !isStaff ? manualCabin : undefined,
                                    patientRegId: !isStaff ? manualRegId : undefined,
                                    departmentRoom: isStaff ? `${manualDepartment} - Counter` : undefined
                                  },
                                  items: cartItems,
                                  totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
                                  status: 'preparing'
                                };
                                (newOrder as any).enteredBy = operatorName || 'Desk Operator';
                                registerNewOrders([newOrder]);
                                setManualCart({});
                                setManualName('');
                                setManualMobile('');
                                setManualStaffId('');
                                setManualCabin('');
                                setManualRegId('');
                                alert(`Manual order #${token} successfully recorded and logged under separate kitchen DB!`);
                              }}
                              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer text-white`}
                              style={{ backgroundColor: managerRole === 'canteen' ? '#10b981' : '#0ea5e9' }}
                            >
                              Log Cash/Staff Sale (অর্ডার জমা দিন)
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* WORKSPACE VIEW B: MENU DATABASE MANAGER (ADD/EDIT FOOD ITEMS) */
                        <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                {editingItemId ? 'Edit Food Record' : 'Add New Food Item'}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1 font-sans">Publish and persist custom items into the {managerRole} menu database.</p>
                            </div>
                            {editingItemId && (
                              <button
                                onClick={() => {
                                  setEditingItemId(null);
                                  setItemForm({
                                    name: '', nameBn: '', description: '', calories: 250, protein: 10, fat: 5, price: 350, staffPrice: 250, tags: [], image: ''
                                  });
                                }}
                                className="text-xs font-bold text-red-400 underline"
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>

                          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">English Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Diet Vegetable Khichuri"
                                value={itemForm.name}
                                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">Bengali Name</label>
                              <input
                                type="text"
                                placeholder="যেমন: ডায়েট সবজি খিচুড়ি"
                                value={itemForm.nameBn}
                                onChange={(e) => setItemForm({ ...itemForm, nameBn: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="col-span-full space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">English Description</label>
                              <textarea
                                rows={2}
                                placeholder="Enter healthy ingredients and dietary balance description..."
                                value={itemForm.description}
                                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">Standard Price (BDT)</label>
                              <input
                                type="number"
                                placeholder="350"
                                value={itemForm.price}
                                onChange={(e) => setItemForm({ ...itemForm, price: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">Staff Subsidy Price (BDT)</label>
                              <input
                                type="number"
                                placeholder="250"
                                value={itemForm.staffPrice}
                                onChange={(e) => setItemForm({ ...itemForm, staffPrice: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">Calories (kcal)</label>
                              <input
                                type="number"
                                placeholder="240"
                                value={itemForm.calories}
                                onChange={(e) => setItemForm({ ...itemForm, calories: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">Protein (grams)</label>
                              <input
                                type="number"
                                placeholder="12"
                                value={itemForm.protein}
                                onChange={(e) => setItemForm({ ...itemForm, protein: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                              />
                            </div>

                            <div className="col-span-full space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500">Image URL</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com..."
                                  value={itemForm.image}
                                  onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                                  className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/25"
                                />
                                <button
                                  type="button"
                                  onClick={() => setItemForm({ ...itemForm, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' })}
                                  className="px-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white"
                                >
                                  Load Sample
                                </button>
                              </div>
                            </div>

                            <div className="col-span-full space-y-1">
                              <label className="text-[10px] uppercase font-black text-slate-500 block">Dietary Health Tags</label>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {['Healthy Choice', 'Diabetic Friendly', 'Low Sodium'].map(tag => {
                                  const exists = itemForm.tags.includes(tag);
                                  return (
                                    <button
                                      type="button"
                                      key={tag}
                                      onClick={() => {
                                        if (exists) {
                                          setItemForm({ ...itemForm, tags: itemForm.tags.filter(t => t !== tag) });
                                        } else {
                                          setItemForm({ ...itemForm, tags: [...itemForm.tags, tag] });
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border ${
                                        exists ? 'bg-sky-500/15 border-sky-400 text-sky-400' : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      {tag}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="col-span-full pt-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!itemForm.name || !itemForm.nameBn) {
                                    alert('Please enter both English and Bengali names.');
                                    return;
                                  }
                                  if (editingItemId) {
                                    setMenuItems(prev => prev.map(item => {
                                      if (item.id === editingItemId) {
                                        const changes: any[] = [];
                                        if (item.name !== itemForm.name) changes.push({ field: 'Name', oldValue: item.name, newValue: itemForm.name });
                                        if (item.price !== itemForm.price) changes.push({ field: 'Price', oldValue: item.price, newValue: itemForm.price });
                                        if (item.staffPrice !== itemForm.staffPrice) changes.push({ field: 'Staff Price', oldValue: item.staffPrice, newValue: itemForm.staffPrice });
                                        if (changes.length > 0) {
                                          const auditRecord: CustomizationRecord = {
                                            id: Math.floor(1000 + Math.random() * 9000).toString(),
                                            timestamp: new Date().toISOString(),
                                            user: operatorName || 'Operator',
                                            role: managerRole as any,
                                            itemName: item.name,
                                            changes
                                          };
                                          setCustomizationHistory(hist => [auditRecord, ...hist]);
                                        }
                                        return {
                                          ...item,
                                          name: itemForm.name,
                                          nameBn: itemForm.nameBn,
                                          description: itemForm.description,
                                          calories: Number(itemForm.calories) || 0,
                                          protein: Number(itemForm.protein) || 0,
                                          fat: Number(itemForm.fat) || 0,
                                          price: Number(itemForm.price) || 0,
                                          staffPrice: Number(itemForm.staffPrice) || 0,
                                          image: itemForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                                          tags: itemForm.tags
                                        };
                                      }
                                      return item;
                                    }));
                                    setEditingItemId(null);
                                    alert('Menu item record successfully saved and updated in local database!');
                                  } else {
                                    const newItemId = itemForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || Date.now().toString();
                                    const newItem: MenuItem = {
                                      id: newItemId,
                                      name: itemForm.name,
                                      nameBn: itemForm.nameBn,
                                      description: itemForm.description,
                                      calories: Number(itemForm.calories) || 0,
                                      protein: Number(itemForm.protein) || 0,
                                      fat: Number(itemForm.fat) || 0,
                                      price: Number(itemForm.price) || 0,
                                      staffPrice: Number(itemForm.staffPrice) || 0,
                                      source: managerRole as 'canteen' | 'cafe',
                                      image: itemForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                                      tags: itemForm.tags
                                    };
                                    setMenuItems(prev => [newItem, ...prev]);
                                    alert('New food item successfully published to ' + managerRole + ' database!');
                                  }
                                  setItemForm({ name: '', nameBn: '', description: '', calories: 250, protein: 10, fat: 5, price: 350, staffPrice: 250, tags: [], image: '' });
                                }}
                                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer"
                              >
                                {editingItemId ? 'Commit Changes To Database' : 'Publish to Kitchen Menu'}
                              </button>
                            </div>
                          </form>

                          {/* Existing items summary log */}
                          <div className="space-y-3 border-t border-white/5 pt-4">
                            <h5 className="text-[10px] uppercase font-black text-slate-500 block">Existing Catalog Items</h5>
                            <div className="space-y-2 max-h-56 overflow-y-auto">
                              {menuItems
                                .filter(item => item.source === managerRole)
                                .map(item => (
                                  <div key={item.id} className="bg-black/30 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                                    <div>
                                      <p className="font-bold text-white">{item.name}</p>
                                      <p className="text-[10px] text-slate-400 font-mono">Price: {item.price} BDT | Staff: {item.staffPrice} BDT</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingItemId(item.id);
                                          setItemForm({
                                            name: item.name,
                                            nameBn: item.nameBn,
                                            description: item.description,
                                            calories: item.calories,
                                            protein: item.protein,
                                            fat: item.fat,
                                            price: item.price,
                                            staffPrice: item.staffPrice,
                                            tags: item.tags,
                                            image: item.image
                                          });
                                        }}
                                        className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded font-bold text-sky-400 text-[10px]"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${item.name} from the catalog database?`)) {
                                            setMenuItems(prev => prev.filter(p => p.id !== item.id));
                                          }
                                        }}
                                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded font-bold text-red-400 text-[10px]"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Kitchen Order Ticket Queue - Spans 5 cols */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <ClipboardList className={`w-4 h-4 ${managerRole === 'canteen' ? 'text-emerald-400' : 'text-sky-400'}`} />
                            <span>Kitchen Order Tickets</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                            {orders.filter(o => o.items.some(it => it.source === managerRole)).length} Total
                          </span>
                        </div>

                        {/* Order ticket cards */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                          {orders.filter(o => o.items.some(it => it.source === managerRole)).length === 0 ? (
                            <div className="py-16 text-center space-y-2 bg-black/20 rounded-2xl border border-dashed border-white/5">
                              <Check className="w-8 h-8 text-slate-500 mx-auto opacity-30 animate-pulse" />
                              <p className="text-xs text-slate-400 font-sans">All kitchen tickets cleared!</p>
                            </div>
                          ) : (
                            orders
                              .filter(o => o.items.some(it => it.source === managerRole))
                              .map((orderRecord) => {
                                const matchedItems = orderRecord.items.filter(it => it.source === managerRole);
                                const sourceSum = matchedItems.reduce((s, i) => s + (i.price * i.qty), 0);

                                return (
                                  <div key={orderRecord.id} className="bg-black/35 border border-white/5 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-xs font-black text-white">Token #{orderRecord.id}</p>
                                        <p className="text-[9px] font-mono text-slate-400">{new Date(orderRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                      </div>

                                      <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${
                                        orderRecord.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        orderRecord.status === 'ready' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                        orderRecord.status === 'preparing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                      }`}>
                                        {orderRecord.status}
                                      </span>
                                    </div>

                                    {/* Customer info */}
                                    <div className="bg-white/5 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-0.5 font-sans">
                                      <p className="font-bold text-white">{orderRecord.name} ({orderRecord.ordererType === 'staff' ? 'Hospital Staff' : 'Patient/Visitor'})</p>
                                      <p className="font-mono text-slate-400">{orderRecord.mobile}</p>
                                      {orderRecord.location?.bedCabin && (
                                        <p className="text-sky-400 font-medium">📍 Cabin/Bed: {orderRecord.location.bedCabin}</p>
                                      )}
                                      {orderRecord.location?.departmentRoom && (
                                        <p className="text-sky-400 font-medium">📍 Dept: {orderRecord.location.departmentRoom}</p>
                                      )}
                                      {(orderRecord as any).enteredBy && (
                                        <p className="text-[9px] text-slate-500 italic pt-0.5">Created manually by operator: {(orderRecord as any).enteredBy}</p>
                                      )}
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-1">
                                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Kitchen Items</span>
                                      {matchedItems.map(it => (
                                        <div key={it.id} className="flex justify-between items-center text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-lg">
                                          <span>{it.name} <strong className="text-white">x{it.qty}</strong></span>
                                          <span className="font-mono">{it.price * it.qty} BDT</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Total inside kitchen */}
                                    <div className="flex justify-between items-center text-xs pt-1 border-t border-white/5">
                                      <span className="text-slate-400 font-bold uppercase text-[9px]">Kitchen Invoice Total</span>
                                      <span className="font-black text-white">{sourceSum} BDT</span>
                                    </div>

                                    {/* Order State Advancer Actions */}
                                    <div className="flex gap-2 pt-2">
                                      {orderRecord.status === 'pending' && (
                                        <button
                                          onClick={() => {
                                            setOrders(prev => prev.map(o => o.id === orderRecord.id ? { ...o, status: 'preparing' } : o));
                                          }}
                                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-black rounded-lg transition-all"
                                        >
                                          Accept Ticket
                                        </button>
                                      )}
                                      {orderRecord.status === 'preparing' && (
                                        <button
                                          onClick={() => {
                                            setOrders(prev => prev.map(o => o.id === orderRecord.id ? { ...o, status: 'ready' } : o));
                                          }}
                                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-black rounded-lg transition-all"
                                        >
                                          Mark Ready
                                        </button>
                                      )}
                                      {orderRecord.status === 'ready' && (
                                        <button
                                          onClick={() => {
                                            setOrders(prev => prev.map(o => o.id === orderRecord.id ? { ...o, status: 'completed' } : o));
                                          }}
                                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-black rounded-lg transition-all"
                                        >
                                          Mark Completed
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          if (confirm('Cancel this kitchen order record?')) {
                                            setOrders(prev => prev.map(o => o.id === orderRecord.id ? { ...o, status: 'completed' as any } : o).filter(o => o.id !== orderRecord.id));
                                          }
                                        }}
                                        className="px-2 py-1.5 bg-white/5 hover:bg-red-500/15 hover:text-red-400 rounded-lg text-slate-400 text-[10px] uppercase font-bold"
                                        title="Cancel ticket"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CENTRAL ADMINISTRATIVE OWNER SUITE (managerRole === 'admin') */}
              {managerRole === 'admin' && (
                <div className="space-y-8">
                  {/* Title Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Shield className="w-6 h-6 text-violet-400" />
                        <span>Central Owner & Governance Dashboard</span>
                      </h2>
                      <p className="text-xs text-slate-400 font-mono mt-1">CUMULATIVE CANTEEN & CAFE METRICS, COMPARATIVE CHARTS, AND DIET DATABASE AUDITS</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const historicalOrders: OrderRecord[] = [];
                          const names = [
                            'Dr. Enam Talha', 'Prof. M. A. Karim', 'Sultana Razia', 'Monirul Islam',
                            'Farhana Yesmin', 'Nusrat Jahan', 'Dr. S. K. Roy', 'Kazi Shahed',
                            'Ayesha Khatun', 'Habibur Rahman', 'Nasrin Akhter', 'Kamrul Hasan',
                            'Ziaul Hoque', 'Asma Begum', 'Rezaul Karim', 'Tania Sultana'
                          ];
                          const mobiles = [
                            '+8801711234567', '+8801812345678', '+8801913456789', '+8801514567890',
                            '+8801615678901', '+8801316789012', '+8801417890123', '+8801718901234'
                          ];
                          const patientCabins = ['Cabin 204', 'Cabin 312', 'Ward 5B', 'Cabin 108', 'Cabin 415', 'Ward 3A', 'Cabin 502'];
                          const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'ICU Desk', 'Emergency Room', 'Outpatient Dept'];
                          const statuses: ('pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed')[] = ['completed', 'completed', 'completed', 'completed', 'ready', 'preparing'];

                          const itemsBySource = {
                            canteen: menuItems.filter(i => i.source === 'canteen'),
                            cafe: menuItems.filter(i => i.source === 'cafe')
                          };

                          for (let i = 0; i < 50; i++) {
                            const daysAgo = Math.floor(Math.random() * 7);
                            const hoursAgo = Math.floor(Math.random() * 12) + 8;
                            const date = new Date();
                            date.setDate(date.getDate() - daysAgo);
                            date.setHours(hoursAgo);
                            date.setMinutes(Math.floor(Math.random() * 60));

                            const isStaff = Math.random() > 0.5;
                            const source = Math.random() > 0.4 ? 'canteen' : 'cafe';
                            const sourceItems = itemsBySource[source];
                            if (!sourceItems || sourceItems.length === 0) continue;

                            const selectedItems: any[] = [];
                            const numItems = Math.random() > 0.7 ? 2 : 1;
                            const shuffled = [...sourceItems].sort(() => 0.5 - Math.random());
                            
                            for (let j = 0; j < Math.min(numItems, shuffled.length); j++) {
                              const item = shuffled[j];
                              const qty = Math.floor(Math.random() * 2) + 1;
                              selectedItems.push({
                                id: item.id,
                                name: item.name,
                                nameBn: item.nameBn,
                                price: isStaff ? item.staffPrice : item.price,
                                qty,
                                source: item.source
                              });
                            }

                            const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
                            const token = Math.floor(1000 + Math.random() * 9000).toString();

                            historicalOrders.push({
                              id: token,
                              timestamp: date.toISOString(),
                              ordererType: isStaff ? 'staff' : 'patient_visitor',
                              name: names[Math.floor(Math.random() * names.length)],
                              mobile: mobiles[Math.floor(Math.random() * mobiles.length)],
                              staffId: isStaff ? `ST-${Math.floor(1000 + Math.random() * 8999)}` : undefined,
                              pickupOption: Math.random() > 0.5 ? 'pickup' : 'delivery',
                              location: {
                                building: 'Main Clinical Tower',
                                floor: `${Math.floor(Math.random() * 8) + 1}th Floor`,
                                bedCabin: !isStaff ? patientCabins[Math.floor(Math.random() * patientCabins.length)] : undefined,
                                patientRegId: !isStaff ? `P-${Math.floor(10000 + Math.random() * 89999)}` : undefined,
                                departmentRoom: isStaff ? `${departments[Math.floor(Math.random() * departments.length)]} - Rm ${Math.floor(100 + Math.random() * 400)}` : undefined
                              },
                              items: selectedItems,
                              totalPrice,
                              status: statuses[Math.floor(Math.random() * statuses.length)]
                            });
                          }

                          historicalOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                          setOrders(historicalOrders);
                          alert('Successfully loaded 50 realistic historical orders into local DB! Scroll down to see updated dynamic charts.');
                        }}
                        className="bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Simulate 50 historical sales in DB"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Seed Demo Sales History</span>
                      </button>

                      <button
                        onClick={() => {
                          setManagerRole('none');
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Exit Admin Panel
                      </button>
                    </div>
                  </div>

                  {/* Financial Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1: Cumulative Revenue */}
                    <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5">
                        <TrendingUp className="w-24 h-24 text-sky-500" />
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Combined Total Revenue (মোট আয়)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">
                          {orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalPrice, 0)}
                        </span>
                        <span className="text-xs font-bold text-violet-400 font-mono">BDT</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 block font-mono">✦ Direct + Self-Checkout accounts</span>
                    </div>

                    {/* Stat 2: Separate Source Splits */}
                    <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Revenue Split (ক্যাফে বনাম ক্যান্টিন)</span>
                      <div className="flex items-baseline gap-3 font-sans">
                        <div>
                          <span className="text-base font-black text-sky-400">
                            {orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.items.filter(it => it.source === 'cafe').reduce((s, it) => s + it.price * it.qty, 0), 0)} BDT
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">🍰 Cafe</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                          <span className="text-base font-black text-emerald-400">
                            {orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.items.filter(it => it.source === 'canteen').reduce((s, it) => s + it.price * it.qty, 0), 0)} BDT
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">🍛 Canteen</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">Separated kitchen databases</span>
                    </div>

                    {/* Stat 3: Total Cumulative Orders */}
                    <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Total Combined Orders</span>
                      <div className="flex items-baseline gap-3">
                        <div>
                          <span className="text-2xl font-black text-white">{orders.length}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Total tickets</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="font-sans">
                          <span className="text-sm font-bold text-slate-300 block">Canteen: {orders.filter(o => o.items.some(i => i.source === 'canteen')).length}</span>
                          <span className="text-sm font-bold text-slate-300 block">Cafe: {orders.filter(o => o.items.some(i => i.source === 'cafe')).length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stat 4: Average Order Size (AOV) */}
                    <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Average Order Value (AOV)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">
                          {orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.totalPrice, 0) / orders.length) : 0}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">BDT/Order</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 block font-mono">✦ Consumer purchasing power index</span>
                    </div>
                  </div>

                  {/* INTRINSIC STATISTICAL ANALYSIS CHARTS (RECHARTS) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Sales Trend Analysis (Area Chart) */}
                    <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-violet-400" />
                          <span>Daily Revenue Distribution (Canteen vs Cafe)</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans">Statistical analysis of sales velocity over the past 7 days.</p>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={dailyStats}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorCanteen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorCafe" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#111113', borderColor: 'rgba(255,255,255,0.1)' }}
                              labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                              itemStyle={{ fontSize: '11px' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            <Area type="monotone" dataKey="Canteen" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCanteen)" />
                            <Area type="monotone" dataKey="Cafe" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCafe)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Chart 2: Customer Demographic Split (Pie Chart) */}
                    <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <LucidePieChart className="w-4 h-4 text-violet-400" />
                          <span>Revenue Share (বাজার অংশীদারিত্ব)</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans">Direct sales share percentage contribution by Canteen and Cafe databases.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={kitchenShareData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={75}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                <Cell key="cell-0" fill="#10b981" />
                                <Cell key="cell-1" fill="#0ea5e9" />
                              </Pie>
                              <Tooltip
                                contentStyle={{ backgroundColor: '#111113', borderColor: 'rgba(255,255,255,0.1)' }}
                                itemStyle={{ fontSize: '11px', color: '#fff' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="space-y-4 font-sans">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                              <span className="text-xs font-bold text-white">Main Canteen Database</span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono pl-5">
                              {kitchenShareData[0].value} BDT ({
                                kitchenShareData[0].value + kitchenShareData[1].value > 0
                                  ? Math.round((kitchenShareData[0].value / (kitchenShareData[0].value + kitchenShareData[1].value)) * 100)
                                  : 0
                              }%)
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-sky-500 rounded-full" />
                              <span className="text-xs font-bold text-white">Hospital Cafe Database</span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono pl-5">
                              {kitchenShareData[1].value} BDT ({
                                kitchenShareData[0].value + kitchenShareData[1].value > 0
                                  ? Math.round((kitchenShareData[1].value / (kitchenShareData[0].value + kitchenShareData[1].value)) * 100)
                                  : 0
                              }%)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MASTER ORDERS AUDIT LOG */}
                  <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 space-y-6 font-sans">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Database className="w-4 h-4 text-violet-400" />
                          <span>Unified Clinical & Retail Order Logs</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Audit, edit, or process master records of both databases from a central administrative suite.</p>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-wrap gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Search Customer..."
                            value={dbSearch}
                            onChange={(e) => setDbSearch(e.target.value)}
                            className="bg-black border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500/40 w-44 font-mono"
                          />
                        </div>

                        <select
                          value={dbStatusFilter}
                          onChange={(e) => setDbStatusFilter(e.target.value as any)}
                          className="bg-black border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                        </select>

                        <select
                          value={dbRoleFilter}
                          onChange={(e) => setDbRoleFilter(e.target.value as any)}
                          className="bg-black border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option value="all">All Customers</option>
                          <option value="staff">Hospital Staff Only</option>
                          <option value="patient_visitor">Patients Only</option>
                        </select>
                      </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-[#161618] text-[9px] uppercase font-black tracking-widest text-slate-400 border-b border-white/5">
                          <tr>
                            <th className="p-4">ID/Token</th>
                            <th className="p-4">Customer Details</th>
                            <th className="p-4">Provider DB</th>
                            <th className="p-4">Dietary Items</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders
                            .filter(o => {
                              const matchesSearch = o.name.toLowerCase().includes(dbSearch.toLowerCase()) || o.id.includes(dbSearch) || o.mobile.includes(dbSearch);
                              const matchesStatus = dbStatusFilter === 'all' || o.status === dbStatusFilter;
                              const matchesRole = dbRoleFilter === 'all' || o.ordererType === dbRoleFilter;
                              return matchesSearch && matchesStatus && matchesRole;
                            })
                            .map((record) => {
                              const sources = Array.from(new Set(record.items.map(it => it.source)));
                              return (
                                <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-black text-white font-mono">{record.id}</td>
                                  <td className="p-4 space-y-0.5">
                                    <p className="font-bold text-slate-100">{record.name}</p>
                                    <p className="text-[10px] font-mono text-slate-500">{record.mobile}</p>
                                    {record.staffId && (
                                      <p className="text-[9px] bg-sky-500/10 text-sky-400 px-1.5 py-0.2 rounded inline-block font-mono">Staff: {record.staffId}</p>
                                    )}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex gap-1.5">
                                      {sources.map(src => (
                                        <span key={src} className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                          src === 'canteen' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-sky-500/10 text-sky-400'
                                        }`}>
                                          {src}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-4 font-medium text-[11px] max-w-xs truncate">
                                    {record.items.map(it => `${it.name} (x${it.qty})`).join(', ')}
                                  </td>
                                  <td className="p-4 font-mono font-black text-white">{record.totalPrice} BDT</td>
                                  <td className="p-4 text-slate-400">
                                    {record.location?.bedCabin || record.location?.departmentRoom || 'Counter pickup'}
                                  </td>
                                  <td className="p-4">
                                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                                      record.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                      record.status === 'ready' ? 'bg-indigo-500/10 text-indigo-400' :
                                      record.status === 'preparing' ? 'bg-amber-500/10 text-amber-400' :
                                      'bg-red-500/10 text-red-400'
                                    }`}>
                                      {record.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1.5">
                                      {record.status !== 'completed' && (
                                        <button
                                          onClick={() => {
                                            setOrders(prev => prev.map(o => o.id === record.id ? { ...o, status: 'completed' } : o));
                                          }}
                                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold"
                                        >
                                          Serve
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete Order #${record.id} permanently?`)) {
                                            setOrders(prev => prev.filter(o => o.id !== record.id));
                                          }
                                        }}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded text-[10px] font-bold"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* MENU AMENDMENT AUDIT TRAIL */}
                  <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 space-y-4 font-sans">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <FolderSync className="w-4 h-4 text-violet-400" />
                        <span>Menu database custom modifications audit trail</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">A real-time track of all modifications, price updates, and tag edits committed by kitchen managers.</p>
                    </div>

                    <div className="space-y-3">
                      {customizationHistory.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-6 bg-black/15 rounded-xl border border-dashed border-white/5 leading-relaxed">
                          No database edits or customization entries registered in this session.
                        </p>
                      ) : (
                        customizationHistory.map(audit => (
                          <div key={audit.id} className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-2">
                            <div className="space-y-1">
                              <p className="font-bold text-white">Item: <span className="text-indigo-400">{audit.itemName}</span></p>
                              <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                                {audit.changes.map((c, i) => (
                                  <p key={i}>✦ Modified <span className="text-white font-bold">{c.field}</span> from <span className="text-red-400 font-bold">"{c.oldValue}"</span> to <span className="text-emerald-400 font-bold">"{c.newValue}"</span></p>
                                ))}
                              </div>
                            </div>
                            <div className="text-right text-[10px] text-slate-500 font-mono">
                              <p>By: <span className="text-slate-300 font-bold">{audit.user}</span> ({audit.role})</p>
                              <p>{new Date(audit.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW: WORKSPACE HUB */}
          {viewMode === 'guide' && (
            <motion.div
              key="workspace-hub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-5xl mx-auto pb-12"
            >
              {/* Central Title */}
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-[11px] font-black text-sky-400 uppercase tracking-wider">
                  <FolderSync className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Administrative Sync Station</span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">
                  Google Workspace Central Hub
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
                  Seamlessly bridge your offline culinary kiosk operations with the power of Google Cloud. Back up menu catalogs, stream live orders to Sheets, and schedule ward diet allotments.
                </p>
              </div>

              {/* FEEDBACK & STATUS TOASTS */}
              {wsSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-fadeIn text-left">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>{wsSuccess}</span>
                  </div>
                  <button onClick={() => setWsSuccess(null)} className="text-emerald-400 hover:text-white transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {wsError && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-300 animate-fadeIn text-left">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <span>{wsError}</span>
                  </div>
                  <button onClick={() => setWsError(null)} className="text-rose-400 hover:text-white transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* CORE CONNECTION CONTROL PANEL */}
              <div className="bg-[#111113] rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                  <div className="space-y-1 text-left">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Lock className="w-5 h-5 text-sky-400" />
                      <span>Google Account Connection</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Authorizes secure read/write scope tokens for Drive, Sheets, and Calendar.
                    </p>
                  </div>

                  {/* Auth Actions */}
                  {wsNeedsAuth ? (
                    <button
                      onClick={handleWorkspaceLogin}
                      disabled={wsLoading}
                      className="px-6 py-3 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase flex items-center gap-3 transition-all cursor-pointer shadow-lg hover:shadow-white/5 active:scale-95 duration-100"
                    >
                      {wsLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6a5.64 5.64 0 0 1-2.44 3.7l3.77 2.93c2.2-2.03 3.48-5.02 3.48-8.46z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.9l-3.77-2.93c-1.05.7-2.4 1.1-4.16 1.1a7.78 7.78 0 0 1-7.33-5.4l-3.9 3.01C4.7 21.1 8.1 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M4.67 13.87a7.78 7.78 0 0 1 0-4.9l-3.9-3.02a11.94 11.94 0 0 0 0 10.94l3.9-3.02z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.95 1.07 15.24 0 12 0 8.1 0 4.7 2.9 2.77 6.95l3.9 3.02a7.78 7.78 0 0 1 7.33-5.22z"
                          />
                        </svg>
                      )}
                      <span>Connect Google Account</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-3 rounded-2xl">
                      {wsUser?.photoURL ? (
                        <img referrerPolicy="no-referrer" src={wsUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-sky-500/20" />
                      ) : (
                        <div className="w-10 h-10 bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/20 flex items-center justify-center font-bold font-mono">
                          {wsUser?.displayName?.charAt(0) || wsUser?.email?.charAt(0) || 'G'}
                        </div>
                      )}
                      <div className="space-y-0.5 text-left">
                        <p className="text-xs font-bold text-white">{wsUser?.displayName || 'Google Operator'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{wsUser?.email}</p>
                      </div>
                      <button
                        onClick={handleWorkspaceLogout}
                        disabled={wsLoading}
                        className="ml-4 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-50 text-[10px] font-black rounded-lg uppercase tracking-wide transition-colors cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>

                {/* SUB-TABS NAVIGATION BAR */}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveWsSubTab('drive')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeWsSubTab === 'drive'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10'
                        : 'text-slate-400 bg-black/25 hover:text-white border border-white/5'
                    }`}
                  >
                    <FolderSync className="w-4 h-4 text-emerald-400" />
                    <span>Drive Backup Storage</span>
                  </button>

                  <button
                    onClick={() => setActiveWsSubTab('sheets')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeWsSubTab === 'sheets'
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/10'
                        : 'text-slate-400 bg-black/25 hover:text-white border border-white/5'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                    <span>Sheets Live Logging</span>
                  </button>

                  <button
                    onClick={() => setActiveWsSubTab('calendar')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeWsSubTab === 'calendar'
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/10'
                        : 'text-slate-400 bg-black/25 hover:text-white border border-white/5'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Calendar Timetable</span>
                  </button>

                  <button
                    onClick={() => setActiveWsSubTab('help')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeWsSubTab === 'help'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                        : 'text-slate-400 bg-black/25 hover:text-white border border-white/5'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Image Share Guide</span>
                  </button>
                </div>

                {/* GENERAL LOADING PANEL */}
                {wsLoading && (
                  <div className="py-1 flex items-center gap-2 text-sky-400 text-xs font-mono animate-pulse text-left">
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Querying Google Workspace cloud APIs...</span>
                  </div>
                )}

                {/* TAB CONTENT RENDERERS */}
                <div className="pt-2">
                  {/* AUTH WARNER */}
                  {wsNeedsAuth && activeWsSubTab !== 'help' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-yellow-300">Google Account Authentication Required</p>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                          Please connect your Google Account using the button above to authorize the application to write backups, update spreadsheets, or view calendar events.
                        </p>
                      </div>
                      <button
                        onClick={handleWorkspaceLogin}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black rounded-lg text-[10px] uppercase cursor-pointer"
                      >
                        Authenticate Now
                      </button>
                    </div>
                  )}

                  {!wsNeedsAuth && (
                    <>
                      {/* SUB-TAB A: DRIVE */}
                      {activeWsSubTab === 'drive' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black/30 border border-white/5 p-5 rounded-2xl space-y-3 text-left">
                              <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Backup Menu Catalog</h4>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                Export the current digital items, pricing configurations, and BDT tags to a secure, private JSON file inside your Google Drive.
                              </p>
                              <button
                                onClick={handleDriveBackupMenu}
                                disabled={wsLoading}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Backup Menu Catalog</span>
                              </button>
                            </div>

                            <div className="bg-black/30 border border-white/5 p-5 rounded-2xl space-y-3 text-left">
                              <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Backup Active Orders</h4>
                              <p className="text-[11px] text-slate-400 leading-normal">
                                Save the full historic register of all logged sales, catering tokens, and bed-cabin distributions directly into Google Drive storage.
                              </p>
                              <button
                                onClick={handleDriveBackupOrders}
                                disabled={wsLoading}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Backup Orders History</span>
                              </button>
                            </div>
                          </div>

                          {/* Drive Explorer backups list */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-400" />
                                <span>Wellness Backups on Google Drive</span>
                              </h4>
                              <button
                                onClick={() => fetchDriveBackups()}
                                className="text-[10px] font-bold text-sky-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Refresh List</span>
                              </button>
                            </div>

                            {driveBackups.length === 0 ? (
                              <p className="text-[11px] text-slate-500 italic text-center py-8 bg-black/15 rounded-xl border border-dashed border-white/5 leading-relaxed">
                                No cloud backups found matching "wellness-" naming format on your Google Drive root. Back up your first catalog!
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-[11px]">
                                  <thead>
                                    <tr className="border-b border-white/5 text-slate-500 font-bold uppercase text-[9px] tracking-widest font-sans">
                                      <th className="p-3">File Name</th>
                                      <th className="p-3">File ID</th>
                                      <th className="p-3">Size</th>
                                      <th className="p-3">Modified</th>
                                      <th className="p-3 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {driveBackups.map(file => (
                                      <tr key={file.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                                        <td className="p-3 font-semibold text-white max-w-xs truncate">{file.name}</td>
                                        <td className="p-3 font-mono text-slate-500 text-[10px] truncate max-w-xs">{file.id}</td>
                                        <td className="p-3 font-mono text-slate-400">{(file.size ? `${(parseInt(file.size)/1024).toFixed(1)} KB` : 'N/A')}</td>
                                        <td className="p-3 text-slate-400">{new Date(file.createdTime).toLocaleString()}</td>
                                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                          <button
                                            onClick={() => handleDriveRestore(file.id, file.name)}
                                            className="px-2.5 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[9px] font-black rounded uppercase cursor-pointer"
                                          >
                                            Restore
                                          </button>
                                          <button
                                            onClick={() => handleDriveDelete(file.id, file.name)}
                                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[9px] font-black rounded uppercase cursor-pointer"
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB B: SHEETS */}
                      {activeWsSubTab === 'sheets' && (
                        <div className="space-y-6 text-left">
                          <div className="bg-black/30 border border-white/5 p-6 rounded-2xl space-y-4">
                            <h4 className="text-xs font-black uppercase text-sky-400 tracking-wider">Live Spreadsheet Integration</h4>
                            
                            {!sheetsSpreadsheetId ? (
                              <div className="space-y-3">
                                <p className="text-xs text-slate-400 leading-normal">
                                  Bridge your checkout flow directly to Google Sheets! Click below to create a central spreadsheet titled "Wellness Kitchen Live Log" on your Google Drive account, formatted with dedicated sheets for Orders and Menu Items.
                                </p>
                                <button
                                  onClick={handleSheetsCreateSpreadsheet}
                                  disabled={wsLoading}
                                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer flex items-center gap-2"
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                  <span>Create Kiosk Spreadsheet</span>
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/45 p-4 rounded-xl border border-white/5">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-bold uppercase text-slate-500">Connected Spreadsheet ID:</span>
                                    <p className="text-[10px] font-mono text-slate-300 truncate max-w-sm">{sheetsSpreadsheetId}</p>
                                  </div>
                                  <div className="space-y-1 md:text-right">
                                    <span className="text-[9px] font-bold uppercase text-slate-500">Google Drive Location:</span>
                                    {sheetsSpreadsheetUrl && (
                                      <a
                                        href={sheetsSpreadsheetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-black text-sky-400 hover:underline flex items-center md:justify-end gap-1"
                                      >
                                        <span>View live Google Sheet</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sky-500/5 border border-sky-500/10 p-4 rounded-xl">
                                  <div className="space-y-1">
                                    <h5 className="text-xs font-bold text-sky-300">Auto-Sync Live Orders</h5>
                                    <p className="text-[10px] text-slate-400 leading-normal">
                                      When enabled, every time an order is placed on the kiosk, it is appended to the Google Sheet automatically!
                                    </p>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={sheetsAutoSync}
                                      onChange={(e) => setSheetsAutoSync(e.target.checked)}
                                      className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                                    <span className="ml-2 text-[10px] font-bold text-slate-300 uppercase">{sheetsAutoSync ? 'Enabled' : 'Disabled'}</span>
                                  </label>
                                </div>

                                <div className="border-t border-white/5 pt-4 space-y-3">
                                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Sync Operations</h5>
                                  <div className="flex flex-wrap gap-2.5">
                                    <button
                                      onClick={handleSheetsSyncMenu}
                                      disabled={wsLoading}
                                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white border border-white/5 font-bold text-[9px] uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                      <span>Export Active Menu to Sheets</span>
                                    </button>

                                    <button
                                      onClick={handleSheetsImportMenu}
                                      disabled={wsLoading}
                                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white border border-white/5 font-bold text-[9px] uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Import Menu from Sheets</span>
                                    </button>

                                    <button
                                      onClick={handleSheetsSyncAllOrders}
                                      disabled={wsLoading}
                                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white border border-white/5 font-bold text-[9px] uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Export Historical Orders to Sheets</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB C: CALENDAR */}
                      {activeWsSubTab === 'calendar' && (
                        <div className="space-y-6 text-left">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Schedule Event Form */}
                            <form onSubmit={handleCalendarCreateEvent} className="lg:col-span-1 bg-black/30 border border-white/5 p-5 rounded-2xl space-y-4">
                              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Schedule Diet Delivery Event</h4>
                              
                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-slate-400">Event Title (অর্ডারের বিষয়)</label>
                                <input
                                  type="text"
                                  value={newEventTitle}
                                  onChange={(e) => setNewEventTitle(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500/45"
                                  required
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-slate-400">Ward Location (স্থান)</label>
                                <input
                                  type="text"
                                  value={newEventLoc}
                                  onChange={(e) => setNewEventLoc(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500/45"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-slate-400">Description / Diet Specs (বর্ণনা)</label>
                                <textarea
                                  value={newEventDesc}
                                  onChange={(e) => setNewEventDesc(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white h-16 resize-none focus:outline-none focus:border-amber-500/45"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-bold text-slate-400 font-mono">Starts (শুরু)</label>
                                  <input
                                    type="datetime-local"
                                    value={newEventStart}
                                    onChange={(e) => setNewEventStart(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:outline-none focus:border-amber-500/45"
                                    required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] uppercase font-bold text-slate-400 font-mono">Ends (শেষ)</label>
                                  <input
                                    type="datetime-local"
                                    value={newEventEnd}
                                    onChange={(e) => setNewEventEnd(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:outline-none focus:border-amber-500/45"
                                    required
                                  />
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={wsLoading}
                                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-black text-[10px] uppercase rounded-xl tracking-wide transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                              >
                                Schedule Event inside Google Calendar
                              </button>
                            </form>

                            {/* Scheduled Timetable list */}
                            <div className="lg:col-span-2 space-y-3">
                              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-amber-400" />
                                  <span>Scheduled Slots on Google Calendar</span>
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => fetchCalendarEvents()}
                                  className="text-[10px] font-bold text-sky-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Refresh Calendar</span>
                                </button>
                              </div>

                              {calendarEvents.length === 0 ? (
                                <p className="text-[11px] text-slate-500 italic text-center py-12 bg-black/15 rounded-xl border border-dashed border-white/5 leading-relaxed">
                                  No upcoming delivery event blocks detected on your Google Calendar root. Schedule one on the left!
                                </p>
                              ) : (
                                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                                  {calendarEvents.map(event => {
                                    const start = new Date(event.start.dateTime || event.start.date || '');
                                    const end = new Date(event.end.dateTime || event.end.date || '');
                                    return (
                                      <div key={event.id} className="bg-black/35 border border-white/5 rounded-xl p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs hover:bg-white/5 transition-all">
                                        <div className="space-y-1 text-left">
                                          <p className="font-bold text-white text-[13px]">{event.summary}</p>
                                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono">
                                            {event.location && (
                                              <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[9px]">📍 {event.location}</span>
                                            )}
                                            {event.description && (
                                              <span className="flex items-center gap-1 text-[9px] text-slate-400">📝 {event.description}</span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="md:text-right font-mono text-[10px] text-amber-400 font-semibold bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10 shrink-0">
                                          <p>📅 {start.toLocaleDateString()}</p>
                                          <p>🕒 {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* SUB-TAB D: HELP (DRIVE IMAGE GUIDE & CONVERTER) */}
                  {activeWsSubTab === 'help' && (
                    <div className="space-y-8 text-left">
                      {/* Intro Hero Section */}
                      <div className="text-center space-y-4 max-w-2xl mx-auto pb-4">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-3xl border border-purple-500/20 flex items-center justify-center mx-auto mb-2">
                          <ExternalLink className="w-8 h-8 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight text-center">
                          Google Drive Kiosk Image Guide
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto text-center">
                          Learn how to prepare, publish, and link your custom culinary photos directly from your Google Drive dashboard. Our application automatically processes standard sharing URLs into direct high-speed streams.
                        </p>
                      </div>

                      {/* Step Stagger bento row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Step 1 */}
                        <div className="bg-black/35 p-6 rounded-3xl border border-white/5 flex gap-4">
                          <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                            01
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Upload to Google Drive</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Upload your food photographs to your Google Drive folder. For optimal visual integration in the card layouts, we recommend PNG files with transparent backgrounds.
                            </p>
                            <span className="text-[9px] text-slate-400/40 italic block pt-1 font-sans">
                              নথি আপলোড করুন: গুগল ড্রাইভে আপনার খাবারের স্বচ্ছ ব্যাকগ্রাউন্ড ছবি যোগ করুন।
                            </span>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-black/35 p-6 rounded-3xl border border-white/5 flex gap-4">
                          <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                            02
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Set Share Permissions</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Right-click the image file, choose <strong>Share</strong>, and look under 'General Access'. Change Restricted to <strong>"Anyone with the link"</strong> with <strong>Viewer</strong> privileges. This enables external kiosk browsers to render the resource.
                            </p>
                            <span className="text-[9px] text-slate-400/40 italic block pt-1">
                              পারমিশন সেট করুন: ফাইলটি "Anyone with the link" হিসেবে পরিবর্তন করে সেভ করুন।
                            </span>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-black/35 p-6 rounded-3xl border border-white/5 flex gap-4">
                          <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                            03
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Copy the Link</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Click the <strong>"Copy Link"</strong> button in the Drive dialogue box. The link will look similar to:
                              <code className="block bg-black/40 text-purple-400 p-2 rounded-lg text-[10px] font-mono mt-1.5 break-all">
                                https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing
                              </code>
                            </p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-black/35 p-6 rounded-3xl border border-purple-500/10 flex gap-4">
                          <div className="w-10 h-10 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 animate-pulse">
                            04
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Paste and Create!</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Return to our <strong>Card Editor</strong> page and paste the copied link directly into the "Hero Food Image" field. Our backend decodes the Drive token and streams the image directly into your kiosk layout!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Troubleshooting bento panel */}
                      <div className="bg-black/30 rounded-3xl p-6 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2">
                          <Info className="text-purple-400 w-5 h-5" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Understanding Live Link Auto-Conversion</h3>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Standard sharing links generated from your Google Drive dashboard are meant to load Google's HTML document viewer, which cannot be loaded inside an HTML <code className="text-purple-400">&lt;img&gt;</code> tag.
                          Our system converts these links in real-time behind the scenes:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="bg-[#161618] p-4 rounded-2xl border border-white/5 space-y-1">
                            <span className="text-[9px] font-bold uppercase text-slate-500/50">You Paste:</span>
                            <p className="text-[10px] text-rose-300 font-mono break-all leading-normal">
                              https://drive.google.com/file/d/<span className="text-purple-400 font-bold">1_FILE_ID_abc</span>/view?usp=sharing
                            </p>
                          </div>
                          <div className="bg-[#161618] p-4 rounded-2xl border border-white/5 space-y-1">
                            <span className="text-[9px] font-bold uppercase text-purple-400/80">App Converts to:</span>
                            <p className="text-[10px] text-emerald-300 font-mono break-all leading-normal">
                              https://lh3.googleusercontent.com/d/<span className="text-purple-400 font-bold">1_FILE_ID_abc</span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex gap-3 text-xs text-yellow-200/90 leading-relaxed">
                          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <p>
                            <strong>Important Security Check:</strong> If the image fails to render inside the portrait frame, it's 99% likely because the Google Drive permissions aren't set to "Anyone with the link". Double check your Drive Dashboard file share settings!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Checkout Button (FAB) for Kiosk view */}
      {viewMode === 'kiosk' && orderItemsCount > 0 && (
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-sky-600 text-white hover:bg-sky-500 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(14,165,233,0.4)] transition-all transform active:scale-90 duration-150 animate-pulse"
        >
          <ShoppingBag className="w-7 h-7 stroke-[2]" />
          <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0c0c0d]">
            {orderItemsCount}
          </span>
        </button>
      )}

      {/* Bottom Health Announcement Marquee Ticker with Dynamic Ticker dialogue and Aura highlight background */}
      <footer 
        className="fixed bottom-0 left-0 w-full z-40 h-14 text-white shadow-2xl flex items-center overflow-hidden font-bold text-xs select-none uppercase tracking-wider animate-[fadeIn_0.5s_ease_out]"
        style={{ backgroundColor: bgAuraColor }}
      >
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 items-center">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Volume2 className="w-4 h-4" />
            <span>{dialogueTickerEn} | {dialogueTickerBn}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Activity className="w-4 h-4" />
            <span>{kitchenNameEn} Announcements: {kitchenSubtitleEn}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Heart className="w-4 h-4" />
            <span>Stay healthy & fit: proteins improve clinical muscle recovery.</span>
          </div>
          {/* Duplicate for seamless infinite loop */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Volume2 className="w-4 h-4" />
            <span>{dialogueTickerEn} | {dialogueTickerBn}</span>
          </div>
        </div>
      </footer>

      {/* Checkout and Review Plate Dialogue Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111113] w-full max-w-lg rounded-[28px] border border-white/5 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 animate-pulse" style={{ color: bgAuraColor }} />
                  <h3 className="text-lg font-bold text-white">Your Healthy Plate (বিল ও অর্ডার)</h3>
                </div>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsOrderPlaced(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order List / Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!isOrderPlaced ? (
                  <>
                    {orderItemsCount === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <ShoppingBag className="w-12 h-12 text-white/20 mx-auto animate-bounce" />
                        <p className="text-sm text-slate-400/60">Your dinner plate is currently empty.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Selected Items Review */}
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            1. Review Plate Items (খাবারসমূহ রিভিউ)
                          </span>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {menuItems
                              .filter((item) => order[item.id] > 0)
                              .map((item) => {
                                const qty = order[item.id];
                                const originalPrice = item.price;
                                const staffPrice = item.staffPrice;
                                const finalPrice = ordererType === 'staff' ? staffPrice : originalPrice;
                                return (
                                  <div
                                    key={item.id}
                                    className="bg-black/40 rounded-xl p-3 flex items-center gap-3 justify-between border border-white/5"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                      />
                                      <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-white truncate">
                                          {item.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 truncate">
                                          {item.nameBn}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          {ordererType === 'staff' ? (
                                            <>
                                              <span className="text-xs font-bold" style={{ color: bgAuraColor }}>
                                                {staffPrice} BDT
                                              </span>
                                              <span className="text-[10px] text-slate-500 line-through">
                                                {originalPrice} BDT
                                              </span>
                                              <span className="text-[8px] bg-sky-500/10 text-sky-400 font-extrabold px-1 rounded">
                                                Staff Benefit
                                              </span>
                                            </>
                                          ) : (
                                            <span className="text-xs font-bold text-slate-300">
                                              {originalPrice} BDT
                                            </span>
                                          )}
                                          <span className="text-[10px] text-slate-400">× {qty}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 bg-black/50 rounded-lg p-0.5 border border-white/5">
                                      <button
                                        onClick={() => removeFromOrder(item.id)}
                                        className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xs cursor-pointer"
                                      >
                                        <Minus className="w-2.5 h-2.5" />
                                      </button>
                                      <span className="text-xs font-black text-white px-1">
                                        {qty}
                                      </span>
                                      <button
                                        onClick={() => addToOrder(item.id)}
                                        className="w-6 h-6 rounded text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                                        style={{ backgroundColor: bgAuraColor }}
                                      >
                                        <Plus className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        {/* Customer Type Categorization Segment */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            2. Who is Ordering? (কে অর্ডার করছেন?)
                          </label>
                          <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                            <button
                              type="button"
                              onClick={() => setOrdererType('patient_visitor')}
                              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                ordererType === 'patient_visitor'
                                  ? 'text-white bg-slate-800 shadow'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Patient / Attendant / Visitor
                            </button>
                            <button
                              type="button"
                              onClick={() => setOrdererType('staff')}
                              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                ordererType === 'staff'
                                  ? 'text-white bg-sky-600 shadow'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Hospital Staff (কর্মী)
                            </button>
                          </div>
                        </div>

                        {/* Orderer Information Form Fields */}
                        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            3. Contact Details (যোগাযোগের তথ্য)
                          </span>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                                Customer Full Name (পূর্ণ নাম) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={ordererName}
                                onChange={(e) => setOrdererName(e.target.value)}
                                className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
                                placeholder={ordererType === 'staff' ? "e.g. Dr. Enam Talha" : "e.g. Salim Mahmud"}
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                                  Mobile Number (মোবাইল নম্বর) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  value={ordererMobile}
                                  onChange={(e) => setOrdererMobile(e.target.value)}
                                  className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 font-mono"
                                  placeholder="e.g. +8801712345678"
                                  required
                                />
                                <span className="text-[9px] text-slate-400 block mt-0.5">WhatsApp support confirmation</span>
                              </div>

                              {ordererType === 'staff' ? (
                                <div>
                                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                                    Staff ID Code (কর্মী আইডি) <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={staffId}
                                    onChange={(e) => setStaffId(e.target.value)}
                                    className="w-full bg-[#161618] rounded-xl border border-sky-500/40 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                                    placeholder="e.g. ST-2241"
                                    required
                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                                    Patient Reg ID (রোগী রেজিস্টার্ড আইডি)
                                  </label>
                                  <input
                                    type="text"
                                    value={patientRegId}
                                    onChange={(e) => setPatientRegId(e.target.value)}
                                    className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 font-mono"
                                    placeholder="e.g. REG-88912"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Pickup vs Delivery Section */}
                        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              4. Service Option (সেবা ধরণ)
                            </span>
                            <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5">
                              <button
                                type="button"
                                onClick={() => setPickupOption('pickup')}
                                className={`px-2 py-1 text-[10px] font-black rounded cursor-pointer ${
                                  pickupOption === 'pickup' ? 'bg-slate-700 text-white' : 'text-slate-400'
                                }`}
                              >
                                Self-Pickup
                              </button>
                              <button
                                type="button"
                                onClick={() => setPickupOption('delivery')}
                                className={`px-2 py-1 text-[10px] font-black rounded cursor-pointer ${
                                  pickupOption === 'delivery' ? 'bg-sky-600 text-white' : 'text-slate-400'
                                }`}
                              >
                                Ward Delivery
                              </button>
                            </div>
                          </div>

                          {pickupOption === 'delivery' && (
                            <div className="space-y-3 pt-2 border-t border-white/5">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Building Name (ভবন)</label>
                                  <select
                                    value={building}
                                    onChange={(e) => setBuilding(e.target.value)}
                                    className="w-full bg-[#161618] rounded-xl border border-white/5 p-2 text-xs text-white focus:outline-none"
                                  >
                                    <option value="Main Ward Block">Main Ward Block</option>
                                    <option value="Emergency Tower">Emergency Tower</option>
                                    <option value="OPD Block">OPD Block</option>
                                    <option value="Cardiology Center">Cardiology Center</option>
                                    <option value="VIP Cabin Block">VIP Cabin Block</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Floor Number (তলা)</label>
                                  <select
                                    value={floor}
                                    onChange={(e) => setFloor(e.target.value)}
                                    className="w-full bg-[#161618] rounded-xl border border-white/5 p-2 text-xs text-white focus:outline-none"
                                  >
                                    <option value="Ground Floor">Ground Floor (নিচ তলা)</option>
                                    <option value="1st Floor">1st Floor (১ম তলা)</option>
                                    <option value="2nd Floor">2nd Floor (২য় তলা)</option>
                                    <option value="3rd Floor">3rd Floor (৩য় তলা)</option>
                                    <option value="4th Floor">4th Floor (৪র্থ তলা)</option>
                                    <option value="5th Floor">5th Floor (৫ম তলা)</option>
                                    <option value="6th Floor">6th Floor (৬ষ্ঠ তলা)</option>
                                  </select>
                                </div>
                              </div>

                              {ordererType === 'patient_visitor' ? (
                                <div>
                                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                                    Bed or Cabin Number (বেড / কেবিন নং) <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={bedCabin}
                                    onChange={(e) => setBedCabin(e.target.value)}
                                    className="w-full bg-[#161618] rounded-xl border border-white/5 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 font-semibold"
                                    placeholder="e.g. Bed 402-A or Cabin 305"
                                    required={pickupOption === 'delivery' && ordererType === 'patient_visitor'}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                                    Hospital Department / Room (বিভাগ / কক্ষ নং) <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={departmentRoom}
                                    onChange={(e) => setDepartmentRoom(e.target.value)}
                                    className="w-full bg-[#161618] rounded-xl border border-sky-500/40 p-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    placeholder="e.g. ICU Duty Room or Surgery Dept Room 12"
                                    required={pickupOption === 'delivery' && ordererType === 'staff'}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {pickupOption === 'pickup' && (
                            <div className="bg-sky-500/5 border border-sky-500/10 rounded-xl p-3 text-center text-xs text-sky-400">
                              🥗 You have chosen self-pickup. Your food will be prepared and held hot at the main cafeteria food service counter.
                            </div>
                          )}
                        </div>

                        {/* Summary statistics */}
                        <div className="bg-[#161618] rounded-2xl p-4 space-y-3 border border-white/5">
                          <div className="flex justify-between text-xs text-slate-300/80">
                            <span>Total Items Selected:</span>
                            <span className="font-bold text-white">{orderItemsCount} Dishes</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-300/80">
                            <span>Total Calories Count:</span>
                            <span className="font-bold text-white">
                              {menuItems.reduce(
                                (sum, item) => sum + (order[item.id] || 0) * item.calories,
                                0
                              )}{' '}
                              kcal
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-300/80">
                            <span>Total Protein Intake:</span>
                            <span className="font-bold text-sky-400">
                              {menuItems.reduce(
                                (sum, item) => sum + (order[item.id] || 0) * item.protein,
                                0
                              )}
                              g
                            </span>
                          </div>
                          
                          {ordererType === 'staff' && (
                            <div className="flex justify-between text-xs text-emerald-400 font-medium">
                              <span>Hospital Staff Benefit Applied:</span>
                              <span className="font-bold">
                                - {menuItems.reduce(
                                  (sum, item) => sum + (order[item.id] || 0) * (item.price - item.staffPrice),
                                  0
                                )}{' '}
                                BDT
                              </span>
                            </div>
                          )}

                          <div className="border-t border-white/5 pt-2 flex justify-between items-center">
                            <span className="text-sm font-bold text-white">Grand Total BDT:</span>
                            <span className="text-xl font-black" style={{ color: bgAuraColor }}>
                              {orderTotalSum} BDT
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 space-y-6">
                    <div 
                      className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto"
                      style={{
                        backgroundColor: `${bgAuraColor}1a`,
                        borderColor: `${bgAuraColor}33`,
                        color: bgAuraColor
                      }}
                    >
                      <Check className="w-8 h-8 stroke-[3.5] animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-extrabold text-white">{orderPlacedTitleEn}</h4>
                      <p className="text-sm font-medium" style={{ color: bgAuraColor }}>{orderPlacedTitleBn}</p>
                      <p className="text-xs text-slate-300/80 max-w-sm mx-auto leading-relaxed whitespace-pre-line">
                        {orderPlacedDescEn}
                      </p>
                      
                      <div className="bg-black/40 border border-white/5 rounded-3xl p-4 mt-4 max-w-xs mx-auto space-y-2">
                        <div>
                          <span className="text-[10px] uppercase font-black text-slate-500 block tracking-wider">
                            {tokenLabelEn} / {tokenLabelBn}
                          </span>
                          <span className="text-3xl font-black tracking-widest block mt-1" style={{ color: bgAuraColor }}>
                            #{generatedToken}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 border-t border-white/5 pt-2 font-mono">
                          Customer: {ordererName} <br />
                          Total Bill: {orderTotalSum} BDT
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp confirmation message block */}
                    <div className="bg-[#075e54]/10 border border-[#075e54]/30 rounded-2xl p-4 text-left space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#25d366]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#25d366] animate-pulse" />
                        <span>WhatsApp Free Ticket Confirmation</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        To receive your free medical meal ticket and instant progress updates, send this formatted receipt to the customer's phone via WhatsApp.
                      </p>

                      <div className="bg-black/50 border border-white/5 rounded-xl p-3 text-[11px] text-slate-400 font-mono whitespace-pre-line max-h-32 overflow-y-auto">
                        {decodeURIComponent(getWhatsAppMessage({
                          id: generatedToken,
                          timestamp: new Date().toISOString(),
                          ordererType,
                          name: ordererName,
                          mobile: ordererMobile,
                          staffId: ordererType === 'staff' ? staffId : undefined,
                          pickupOption,
                          location: {
                            building,
                            floor,
                            bedCabin,
                            patientRegId,
                            departmentRoom
                          },
                          items: menuItems
                            .filter((item) => order[item.id] > 0)
                            .map((item) => ({
                              id: item.id,
                              name: item.name,
                              nameBn: item.nameBn,
                              price: ordererType === 'staff' ? item.staffPrice : item.price,
                              qty: order[item.id],
                              source: item.source
                            })),
                          totalPrice: orderTotalSum,
                          status: 'pending'
                        }))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <a
                          href={`https://api.whatsapp.com/send?phone=${ordererMobile.replace(/[^0-9]/g, '')}&text=${getWhatsAppMessage({
                            id: generatedToken,
                            timestamp: new Date().toISOString(),
                            ordererType,
                            name: ordererName,
                            mobile: ordererMobile,
                            staffId: ordererType === 'staff' ? staffId : undefined,
                            pickupOption,
                            location: {
                              building,
                              floor,
                              bedCabin,
                              patientRegId,
                              departmentRoom
                            },
                            items: menuItems
                              .filter((item) => order[item.id] > 0)
                              .map((item) => ({
                                id: item.id,
                                name: item.name,
                                nameBn: item.nameBn,
                                price: ordererType === 'staff' ? item.staffPrice : item.price,
                                qty: order[item.id],
                                source: item.source
                              })),
                            totalPrice: orderTotalSum,
                            status: 'pending'
                          })}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-[#25d366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase py-2.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                        >
                          💬 Send WhatsApp Message
                        </a>
                        <button
                          onClick={() => {
                            const rawMsg = decodeURIComponent(getWhatsAppMessage({
                              id: generatedToken,
                              timestamp: new Date().toISOString(),
                              ordererType,
                              name: ordererName,
                              mobile: ordererMobile,
                              staffId: ordererType === 'staff' ? staffId : undefined,
                              pickupOption,
                              location: {
                                building,
                                floor,
                                bedCabin,
                                patientRegId,
                                departmentRoom
                              },
                              items: menuItems
                                .filter((item) => order[item.id] > 0)
                                .map((item) => ({
                                  id: item.id,
                                  name: item.name,
                                  nameBn: item.nameBn,
                                  price: ordererType === 'staff' ? item.staffPrice : item.price,
                                  qty: order[item.id],
                                  source: item.source
                                })),
                              totalPrice: orderTotalSum,
                              status: 'pending'
                            }));
                            navigator.clipboard.writeText(rawMsg);
                            alert('Receipt copied successfully!');
                          }}
                          className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          📋 Copy Receipt
                        </button>
                      </div>
                    </div>

                    {/* Dual Hotlines Support Box */}
                    <div className="border-t border-white/5 pt-4 text-left space-y-2">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 block">
                        Kitchen & Cafe Hotlines (সহায়তা ও যোগাযোগ)
                      </span>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#161618] border border-white/5 rounded-xl p-2.5">
                          <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🍰 HOSPITAL CAFE</span>
                          <span className="text-white font-bold font-mono">{cafeHotline}</span>
                        </div>
                        <div className="bg-[#161618] border border-white/5 rounded-xl p-2.5">
                          <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🍛 MAIN CANTEEN</span>
                          <span className="text-white font-bold font-mono">{canteenHotline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Trigger */}
              <div className="p-6 border-t border-white/5 bg-black/20 flex gap-3">
                {!isOrderPlaced ? (
                  <>
                    <button
                      onClick={() => {
                        setOrder({});
                        setIsCheckoutOpen(false);
                      }}
                      className="flex-1 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Clear Plate
                    </button>
                    <button
                      disabled={
                        orderItemsCount === 0 || 
                        !ordererName.trim() || 
                        !ordererMobile.trim() || 
                        (ordererType === 'staff' && !staffId.trim()) ||
                        (pickupOption === 'delivery' && ordererType === 'patient_visitor' && !bedCabin.trim()) ||
                        (pickupOption === 'delivery' && ordererType === 'staff' && !departmentRoom.trim())
                      }
                      onClick={() => {
                        // Place order
                        const token = Math.floor(1000 + Math.random() * 9000).toString();
                        setGeneratedToken(token);

                        const orderedItems = menuItems
                          .filter((item) => order[item.id] > 0)
                          .map((item) => ({
                            id: item.id,
                            name: item.name,
                            nameBn: item.nameBn,
                            price: ordererType === 'staff' ? item.staffPrice : item.price,
                            qty: order[item.id],
                            source: item.source
                          }));

                        const canteenItems = orderedItems.filter(item => item.source === 'canteen');
                        const cafeItems = orderedItems.filter(item => item.source === 'cafe');
                        const splitOrders: OrderRecord[] = [];

                        if (canteenItems.length > 0) {
                          const hasBoth = cafeItems.length > 0;
                          const cnToken = hasBoth ? `${token}-CN` : token;
                          splitOrders.push({
                            id: cnToken,
                            timestamp: new Date().toISOString(),
                            ordererType,
                            name: ordererName,
                            mobile: ordererMobile,
                            staffId: ordererType === 'staff' ? staffId : undefined,
                            pickupOption,
                            location: {
                              building,
                              floor,
                              bedCabin: ordererType === 'patient_visitor' ? bedCabin : undefined,
                              patientRegId: ordererType === 'patient_visitor' ? patientRegId : undefined,
                              departmentRoom: ordererType === 'staff' ? departmentRoom : undefined
                            },
                            items: canteenItems,
                            totalPrice: canteenItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
                            status: 'pending'
                          });
                        }

                        if (cafeItems.length > 0) {
                          const hasBoth = canteenItems.length > 0;
                          const cfToken = hasBoth ? `${token}-CF` : token;
                          splitOrders.push({
                            id: cfToken,
                            timestamp: new Date().toISOString(),
                            ordererType,
                            name: ordererName,
                            mobile: ordererMobile,
                            staffId: ordererType === 'staff' ? staffId : undefined,
                            pickupOption,
                            location: {
                              building,
                              floor,
                              bedCabin: ordererType === 'patient_visitor' ? bedCabin : undefined,
                              patientRegId: ordererType === 'patient_visitor' ? patientRegId : undefined,
                              departmentRoom: ordererType === 'staff' ? departmentRoom : undefined
                            },
                            items: cafeItems,
                            totalPrice: cafeItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
                            status: 'pending'
                          });
                        }

                        registerNewOrders(splitOrders);
                        setIsOrderPlaced(true);
                      }}
                      className="flex-1 py-3 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase rounded-xl shadow-lg transition-all cursor-pointer"
                      style={{ backgroundColor: bgAuraColor }}
                    >
                      Place Meal Order
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setOrder({});
                      setIsCheckoutOpen(false);
                      setIsOrderPlaced(false);
                      
                      // Clear form inputs
                      setOrdererName('');
                      setOrdererMobile('');
                      setStaffId('');
                      setBedCabin('');
                      setPatientRegId('');
                      setDepartmentRoom('');
                    }}
                    className="w-full py-3 text-white font-extrabold text-xs uppercase rounded-xl shadow-lg transition-all cursor-pointer"
                    style={{ backgroundColor: bgAuraColor }}
                  >
                    Close & Start New Meal
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
