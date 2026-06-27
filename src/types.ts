export interface MenuItem {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  price: number;
  staffPrice: number; // Customized pricing for healthcare & kitchen staff
  source: 'cafe' | 'canteen'; // Cafe or Canteen food sources
  image: string;
  tags: string[]; // e.g. "Healthy Choice", "Diabetic Friendly", "Low Sodium"
  featured?: boolean;
}

export type ViewMode = 'kiosk' | 'editor' | 'guide' | 'dashboard';

export interface OrderRecord {
  id: string; // Token Number (e.g. "9041")
  timestamp: string;
  ordererType: 'staff' | 'patient_visitor';
  name: string;
  mobile: string;
  staffId?: string;
  pickupOption: 'pickup' | 'delivery';
  location: {
    building?: string;
    floor?: string;
    bedCabin?: string;
    patientRegId?: string;
    departmentRoom?: string;
  };
  items: {
    id: string;
    name: string;
    nameBn: string;
    price: number;
    qty: number;
    source: 'cafe' | 'canteen';
  }[];
  totalPrice: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed';
}

export interface CustomizationRecord {
  id: string;
  timestamp: string;
  user: string;
  role: 'canteen' | 'cafe' | 'open';
  itemName: string;
  changes: {
    field: string;
    oldValue: string | number | boolean;
    newValue: string | number | boolean;
  }[];
}


