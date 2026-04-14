// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'caregiver';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, role: 'user' | 'caregiver') => Promise<void>;
  logout: () => void;
}

// Medication
export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  unit: 'mg' | 'ml' | 'tablet' | 'capsule' | 'injection';
  frequency: 'daily' | 'twice-daily' | 'three-times-daily' | 'weekly' | 'as-needed';
  prescribedDate: Date;
  endDate?: Date;
  reason: string;
  sideEffects?: string[];
  notes?: string;
  color: string;
  createdAt: Date;
}

// Schedule
export interface MedicationReminder {
  id: string;
  medicationId: string;
  time: string; // HH:mm format
  completed: boolean;
  completedAt?: Date;
  missedAt?: Date;
}

export interface DailySchedule {
  date: Date;
  reminders: MedicationReminder[];
  adherenceRate: number;
}

// History
export interface MedicationHistory {
  id: string;
  medicationId: string;
  date: Date;
  taken: boolean;
  time?: string;
  notes?: string;
}

// Dependent (for caregivers)
export interface Dependent {
  id: string;
  caregiverId: string;
  name: string;
  relationshipType: 'parent' | 'child' | 'sibling' | 'spouse' | 'other';
  dateOfBirth: Date;
  conditions?: string[];
  notes?: string;
  createdAt: Date;
}

// Caregiver Assignment
export interface CaregiverAssignment {
  id: string;
  userId: string;
  caregiverId: string;
  status: 'pending' | 'active' | 'inactive';
  assignedDate: Date;
  permissions: string[];
}

// Statistics
export interface AdhereenceStats {
  medicationId: string;
  medicationName: string;
  totalDosesScheduled: number;
  totalDosesTaken: number;
  adherenceRate: number; // 0-100
  lastTaken?: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface MonthlyStats {
  month: string;
  adherenceRate: number;
  medicationsTaken: number;
  medicationsScheduled: number;
  daysWithPerfectAdherence: number;
}
