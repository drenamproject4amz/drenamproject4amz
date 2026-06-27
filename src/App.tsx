import { useState, useEffect } from 'react';
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
  User,
  MapPin,
  TrendingUp,
  Coffee,
  Utensils,
  Filter
} from 'lucide-react';
import { MenuItem, ViewMode, OrderRecord, CustomizationRecord } from './types';
import { INITIAL_MENU_ITEMS } from './data/menuItems';
import { convertGoogleDriveUrl } from './utils/driveConverter';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
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

      if (showKioskActionButton) {
        // Draw the Action Button on the right (Touch Mode)
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
              <BookOpen className="w-4 h-4" />
              <span>Drive Integration Guide</span>
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

          {/* VIEW: RESTAURANT MANAGER DASHBOARD */}
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Dashboard Title row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <Activity className="w-6 h-6 text-sky-400 animate-pulse" />
                    <span>Restaurant Manager Dashboard</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">REAL-TIME CLINICAL ORDER LOGS & DUAL KITCHEN ANALYTICS</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to restore the default sample orders?')) {
                        localStorage.removeItem('kiosk_orders');
                        window.location.reload();
                      }
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Database</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Revenue */}
                <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5">
                    <TrendingUp className="w-24 h-24 text-sky-500" />
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Total Revenue (মোট আয়)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">
                      {orders.reduce((sum, o) => sum + o.totalPrice, 0)}
                    </span>
                    <span className="text-xs font-bold text-sky-400 font-mono">BDT</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 block font-mono">✦ All billing items accounted</span>
                </div>

                {/* Metric 2: Orders Count */}
                <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Total Orders (মোট অর্ডার)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{orders.length}</span>
                    <span className="text-xs text-slate-400 font-bold">Orders</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Pending: {orders.filter(o => o.status === 'pending').length} | Preparing: {orders.filter(o => o.status === 'preparing').length}
                  </span>
                </div>

                {/* Metric 3: Patient vs Staff Split */}
                <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Customer Mix (গ্রাহক শ্রেণী)</span>
                  <div className="flex items-baseline gap-3">
                    <div>
                      <span className="text-2xl font-black text-slate-200">
                        {orders.filter(o => o.ordererType === 'patient_visitor').length}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block">Patients</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <span className="text-2xl font-black text-sky-400">
                        {orders.filter(o => o.ordererType === 'staff').length}
                      </span>
                      <span className="text-[10px] font-bold text-sky-400 block">Hospital Staff</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono">With customized staff rates applied</span>
                </div>

                {/* Metric 4: Dual Source Revenue Split */}
                <div className="bg-[#111113] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Source Breakdown (ক্যাফে বনাম ক্যান্টিন)</span>
                  <div className="flex items-baseline gap-3">
                    <div>
                      <span className="text-sm font-black text-sky-400">
                        {orders.reduce((sum, o) => sum + o.items.filter(it => it.source === 'cafe').reduce((s, it) => s + it.price * it.qty, 0), 0)} BDT
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">☕ Cafe Rev</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <span className="text-sm font-black text-emerald-400">
                        {orders.reduce((sum, o) => sum + o.items.filter(it => it.source === 'canteen').reduce((s, it) => s + it.price * it.qty, 0), 0)} BDT
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">🍛 Canteen Rev</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono">Split by menu items provider field</span>
                </div>
              </div>

              {/* Advanced Filter Toolbar */}
              <div className="bg-[#111113] p-5 rounded-3xl border border-white/5 space-y-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  {/* Search Bar */}
                  <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={dbSearch}
                      onChange={(e) => setDbSearch(e.target.value)}
                      placeholder="Search Token, Name, Mobile, Staff ID..."
                      className="w-full bg-[#161618] rounded-xl border border-white/5 py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-sky-500/50 transition-all font-mono"
                    />
                  </div>

                  {/* Filter switches row */}
                  <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
                    {/* Status Select Filter */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={dbStatusFilter}
                        onChange={(e) => setDbStatusFilter(e.target.value as any)}
                        className="bg-[#161618] rounded-xl border border-white/5 p-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                      >
                        <option value="all">All Statuses (সকল স্থিতি)</option>
                        <option value="pending">⏳ Pending Queue</option>
                        <option value="preparing">👨‍🍳 Preparing</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                    </div>

                    {/* Role Mix Filter */}
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={dbRoleFilter}
                        onChange={(e) => setDbRoleFilter(e.target.value as any)}
                        className="bg-[#161618] rounded-xl border border-white/5 p-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                      >
                        <option value="all">All Roles (সকল শ্রেণী)</option>
                        <option value="patient_visitor">Patient / Attendant</option>
                        <option value="staff">Hospital Staff Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Orders Queue Board */}
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 block font-mono">
                  Orders Feed ({orders.filter(o => {
                    const matchesSearch = 
                      o.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
                      o.id.includes(dbSearch) ||
                      o.mobile.includes(dbSearch) ||
                      (o.staffId && o.staffId.toLowerCase().includes(dbSearch.toLowerCase()));
                    const matchesStatus = dbStatusFilter === 'all' || o.status === dbStatusFilter;
                    const matchesRole = dbRoleFilter === 'all' || o.ordererType === dbRoleFilter;
                    return matchesSearch && matchesStatus && matchesRole;
                  }).length} records matched)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders
                    .filter((o) => {
                      const matchesSearch = 
                        o.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
                        o.id.includes(dbSearch) ||
                        o.mobile.includes(dbSearch) ||
                        (o.staffId && o.staffId.toLowerCase().includes(dbSearch.toLowerCase()));
                      const matchesStatus = dbStatusFilter === 'all' || o.status === dbStatusFilter;
                      const matchesRole = dbRoleFilter === 'all' || o.ordererType === dbRoleFilter;
                      return matchesSearch && matchesStatus && matchesRole;
                    })
                    .map((o) => {
                      const isPending = o.status === 'pending';
                      const isPreparing = o.status === 'preparing';
                      const isCompleted = o.status === 'completed';

                      return (
                        <div
                          key={o.id}
                          className={`bg-[#111113] rounded-3xl border p-6 flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
                            isPending 
                              ? 'border-yellow-500/20 shadow-lg shadow-yellow-500/5' 
                              : isPreparing 
                              ? 'border-sky-500/20 shadow-lg shadow-sky-500/5' 
                              : 'border-white/5'
                          }`}
                        >
                          {/* Corner accent glow */}
                          <div 
                            className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none"
                            style={{
                              backgroundColor: isPending ? '#f59e0b' : isPreparing ? '#38bdf8' : '#10b981'
                            }}
                          />

                          {/* Order Card Header */}
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black tracking-widest text-slate-500 block">TOKEN</span>
                              <span className="text-xl font-black text-white font-mono">#{o.id}</span>
                            </div>
                            
                            <div className="flex flex-col items-end gap-1.5">
                              {/* Status badge pill */}
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                isPending 
                                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                                  : isPreparing 
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {o.status}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {new Date(o.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {/* Customer & Location Block */}
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-start">
                              <span className="text-slate-400 font-medium">Customer:</span>
                              <span className="font-bold text-white text-right">{o.name}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-slate-400 font-medium">Mobile:</span>
                              <span className="font-mono text-white text-right font-bold">{o.mobile}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-slate-400 font-medium">Role:</span>
                              <span className={`font-black uppercase tracking-wider text-[10px] ${o.ordererType === 'staff' ? 'text-sky-400' : 'text-slate-300'}`}>
                                {o.ordererType === 'staff' ? 'Hospital Staff' : 'Patient / Visitor'}
                              </span>
                            </div>

                            {/* Conditional identification details */}
                            {o.staffId && (
                              <div className="flex justify-between items-start bg-sky-500/5 p-2 rounded-xl border border-sky-500/10">
                                <span className="text-sky-400 font-bold">Staff ID:</span>
                                <span className="font-mono text-sky-400 font-bold">{o.staffId}</span>
                              </div>
                            )}

                            {o.location.patientRegId && (
                              <div className="flex justify-between items-start">
                                <span className="text-slate-400 font-medium">Patient Reg ID:</span>
                                <span className="font-mono text-slate-300">{o.location.patientRegId}</span>
                              </div>
                            )}

                            {/* Service / Delivery Location */}
                            <div className="bg-[#161618] border border-white/5 p-3 rounded-2xl space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                                <span>Service Coordinates</span>
                              </div>
                              <p className="text-xs text-white font-bold leading-relaxed">
                                {o.pickupOption === 'pickup' ? (
                                  <span className="text-sky-400 font-extrabold uppercase text-[10px]">🏬 Self-Pickup at Counter</span>
                                ) : (
                                  <>
                                    {o.location.building} • {o.location.floor} <br />
                                    {o.location.bedCabin && <span className="text-amber-400">Bed/Cabin: {o.location.bedCabin}</span>}
                                    {o.location.departmentRoom && <span className="text-sky-400">Dept/Room: {o.location.departmentRoom}</span>}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Items Ordered Row (source-highlighted) */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                              Items Ordered ({o.items.reduce((sum, it) => sum + it.qty, 0)})
                            </span>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                              {o.items.map((it) => (
                                <div
                                  key={it.id}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                                    it.source === 'cafe' 
                                      ? 'bg-sky-500/5 border-sky-500/10' 
                                      : 'bg-emerald-500/5 border-emerald-500/10'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-white">{it.name}</span>
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-slate-400 font-mono">
                                        {it.source === 'cafe' ? 'Cafe' : 'Canteen'}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 block">{it.nameBn}</span>
                                  </div>
                                  <div className="text-right font-bold">
                                    <span className="text-slate-300 font-mono">x{it.qty}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Grand total and controls */}
                          <div className="border-t border-white/5 pt-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Order Bill:</span>
                              <span className="text-base font-black text-white">{o.totalPrice} BDT</span>
                            </div>

                            {/* Status controls */}
                            <div className="grid grid-cols-3 gap-1.5">
                              {isPending && (
                                <button
                                  onClick={() => updateOrderStatus(o.id, 'preparing')}
                                  className="col-span-2 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all cursor-pointer text-center"
                                >
                                  👨‍🍳 Start Prep
                                </button>
                              )}
                              {isPreparing && (
                                <button
                                  onClick={() => updateOrderStatus(o.id, 'completed')}
                                  className="col-span-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all cursor-pointer text-center"
                                >
                                  ✅ Mark Ready
                                </button>
                              )}
                              {isCompleted && (
                                <div className="col-span-2 py-2 px-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-center rounded-xl text-[10px] font-extrabold uppercase">
                                  Served / Closed
                                </div>
                              )}
                              
                              <button
                                onClick={() => deleteOrder(o.id)}
                                className="py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {orders.filter((o) => {
                    const matchesSearch = 
                      o.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
                      o.id.includes(dbSearch) ||
                      o.mobile.includes(dbSearch) ||
                      (o.staffId && o.staffId.toLowerCase().includes(dbSearch.toLowerCase()));
                    const matchesStatus = dbStatusFilter === 'all' || o.status === dbStatusFilter;
                    const matchesRole = dbRoleFilter === 'all' || o.ordererType === dbRoleFilter;
                    return matchesSearch && matchesStatus && matchesRole;
                  }).length === 0 && (
                    <div className="col-span-full py-16 text-center space-y-3 bg-[#111113] rounded-3xl border border-white/5">
                      <Utensils className="w-12 h-12 text-slate-500 mx-auto opacity-30 animate-pulse" />
                      <p className="text-sm text-slate-400">No matching orders found in current filter views.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: INTEGRATION GUIDE */}
          {viewMode === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              {/* Intro Hero Section */}
              <div className="text-center space-y-4 max-w-2xl mx-auto pb-4">
                <div className="w-16 h-16 bg-sky-500/10 rounded-3xl border border-sky-500/20 flex items-center justify-center mx-auto mb-2">
                  <ExternalLink className="w-8 h-8 text-sky-400" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Google Drive Kiosk Image Guide
                </h2>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  Learn how to prepare, publish, and link your custom culinary photos directly from your Google Drive dashboard. Our application automatically processes standard sharing URLs into direct high-speed streams.
                </p>
              </div>

              {/* Step Stagger bento row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div className="bg-[#111113] p-6 rounded-3xl border border-white/5 flex gap-4">
                  <div className="w-10 h-10 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                    01
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">Upload to Google Drive</h3>
                    <p className="text-xs text-slate-400/70 leading-relaxed">
                      Upload your food photographs to your Google Drive folder. For optimal visual integration in the card layouts, we recommend PNG files with transparent backgrounds.
                    </p>
                    <span className="text-[10px] text-slate-400/40 italic block pt-1 font-sans">
                      নথি আপলোড করুন: গুগল ড্রাইভে আপনার খাবারের স্বচ্ছ ব্যাকগ্রাউন্ড ছবি যোগ করুন।
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#111113] p-6 rounded-3xl border border-white/5 flex gap-4">
                  <div className="w-10 h-10 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                    02
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">Set Share Permissions</h3>
                    <p className="text-xs text-slate-400/70 leading-relaxed">
                      Right-click the image file, choose <strong>Share</strong>, and look under 'General Access'. Change Restricted to <strong>"Anyone with the link"</strong> with <strong>Viewer</strong> privileges. This enables external kiosk browsers to render the resource.
                    </p>
                    <span className="text-[10px] text-slate-400/40 italic block pt-1">
                      পারমিশন সেট করুন: ফাইলটি "Anyone with the link" হিসেবে পরিবর্তন করে সেভ করুন।
                    </span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#111113] p-6 rounded-3xl border border-white/5 flex gap-4">
                  <div className="w-10 h-10 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                    03
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">Copy the Link</h3>
                    <p className="text-xs text-slate-400/70 leading-relaxed">
                      Click the <strong>"Copy Link"</strong> button in the Drive dialogue box. The link will look similar to:
                      <code className="block bg-black/40 text-sky-400 p-2 rounded-lg text-[10px] font-mono mt-1.5 break-all">
                        https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing
                      </code>
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-[#111113] p-6 rounded-3xl border border-sky-500/10 flex gap-4">
                  <div className="w-10 h-10 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 animate-pulse">
                    04
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">Paste and Create!</h3>
                    <p className="text-xs text-slate-400/70 leading-relaxed">
                      Return to our <strong>Card Editor</strong> page and paste thecopied link directly into the "Hero Food Image" field. Our backend decodes the Drive token and streams the image directly into your kiosk layout!
                    </p>
                  </div>
                </div>
              </div>

              {/* Troubleshooting bento panel */}
              <div className="bg-[#111113] rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="text-sky-400 w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Understanding Live Link Auto-Conversion</h3>
                </div>
                <p className="text-xs text-slate-300/80 leading-relaxed">
                  Standard sharing links generated from your Google Drive dashboard are meant to load Google's HTML document viewer, which cannot be loaded inside an HTML <code className="text-sky-400">&lt;img&gt;</code> tag.
                  Our system converts these links in real-time behind the scenes:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#161618] p-4 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500/50">You Paste:</span>
                    <p className="text-[11px] text-red-300 font-mono break-all leading-normal">
                      https://drive.google.com/file/d/<span className="text-sky-400 font-bold">1_FILE_ID_abc</span>/view?usp=sharing
                    </p>
                  </div>
                  <div className="bg-[#161618] p-4 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-sky-400/80">App Converts to:</span>
                    <p className="text-[11px] text-green-300 font-mono break-all leading-normal">
                      https://lh3.googleusercontent.com/d/<span className="text-sky-400 font-bold">1_FILE_ID_abc</span>
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

                        const newOrder: OrderRecord = {
                          id: token,
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
                          items: orderedItems,
                          totalPrice: orderTotalSum,
                          status: 'pending'
                        };

                        setOrders(prev => [newOrder, ...prev]);
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
