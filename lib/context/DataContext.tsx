'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Medication,
  MedicationHistory,
  Dependent,
  DailySchedule,
  MedicationReminder,
} from '../types';
import { useAuth } from './AuthContext';
import { api } from '../api';

interface DataContextType {
  medications: Medication[];
  history: MedicationHistory[];
  dependents: Dependent[];
  dailySchedule: DailySchedule | null;
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt'>) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  recordMedicationTaken: (medicationId: string, time: string, scheduleId?: string) => Promise<void>;
  recordMedicationMissed: (medicationId: string, scheduleId?: string) => Promise<void>;
  addDependent: (dependent: Omit<Dependent, 'id' | 'createdAt'>) => void;
  updateDependent: (id: string, updates: Partial<Dependent>) => void;
  deleteDependent: (id: string) => void;
  getAdherenceStats: () => any[];
  getDailySchedule: (date?: Date) => DailySchedule;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Map backend meds to frontend Medication
const mapMedication = (dbMed: any): Medication => ({
  id: dbMed.id,
  userId: dbMed.owner_user_id,
  name: dbMed.name,
  dosage: String(dbMed.dosage_value),
  unit: dbMed.unit as any,
  frequency: dbMed.frequency as any,
  prescribedDate: new Date(dbMed.prescribed_date || dbMed.created_at),
  endDate: dbMed.end_date ? new Date(dbMed.end_date) : undefined,
  reason: dbMed.reason,
  sideEffects: dbMed.side_effects || [],
  notes: dbMed.instructions || undefined,
  color: dbMed.color_hex,
  createdAt: new Date(dbMed.created_at),
});

// Map backend schedule to frontend format
const mapScheduleReminder = (dbSched: any): MedicationReminder => ({
  id: dbSched.id,
  medicationId: dbSched.medication_id,
  time: dbSched.scheduled_time.substring(0, 5), // "08:00:00" -> "08:00"
  completed: false, // will be matched against history later
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  const [medications, setMedications] = useState<Medication[]>([]);
  const [dbSchedules, setDbSchedules] = useState<any[]>([]); // Raw schedules from backend
  const [history, setHistory] = useState<MedicationHistory[]>([]);
  const [dependents, setDependents] = useState<Dependent[]>([]);

  const fetchInitialData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // Fetch Medications
      const medsRes = await api.get('/medications');
      const loadedMeds = (medsRes.medications || []).map(mapMedication);
      setMedications(loadedMeds);

      // Fetch Daily Schedules
      const schedRes = await api.get('/schedules/daily');
      setDbSchedules(schedRes.schedules || []);

      // Fetch History (Adherence Logs)
      const histRes = await api.get('/adherence');
      const loadedHistory: MedicationHistory[] = (histRes.logs || []).map((h: any) => ({
        id: h.id,
        medicationId: h.medication_id,
        date: new Date(h.scheduled_for || h.created_at),
        taken: h.status === 'taken',
        time: h.actual_time ? new Date(h.actual_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : undefined,
        notes: h.notes || undefined,
      }));
      setHistory(loadedHistory);

    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const addMedication = async (medication: Omit<Medication, 'id' | 'createdAt'>) => {
    try {
      const response = await api.post('/medications', {
        name: medication.name,
        dosage_value: parseFloat(medication.dosage) || 1, // Need parse since backend expects float
        unit: medication.unit,
        frequency: medication.frequency,
        reason: medication.reason,
        color_hex: medication.color,
        prescribed_date: medication.prescribedDate.toISOString().split('T')[0],
        instructions: medication.notes || '',
        side_effects: medication.sideEffects || [],
      });
      
      const newMed = mapMedication(response.medication);
      setMedications(prev => [newMed, ...prev]);

      // Automatically generate a default schedule if frequency dictates it
      // Simplified mapping for the demo
      if (medication.frequency.includes('daily')) {
        await api.post('/schedules', {
          medication_id: newMed.id,
          scheduled_time: '08:00',
        });
        await fetchInitialData(); // Refresh schedules
      }
    } catch (err) {
      console.error('Failed to add medication:', err);
      throw err;
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      const payload: any = {};
      if (updates.name) payload.name = updates.name;
      if (updates.dosage) payload.dosage_value = parseFloat(updates.dosage);
      if (updates.unit) payload.unit = updates.unit;
      if (updates.frequency) payload.frequency = updates.frequency;
      if (updates.color) payload.color_hex = updates.color;

      const response = await api.put(`/medications/${id}`, payload);
      setMedications(medications.map((med) => (med.id === id ? mapMedication(response.medication) : med)));
    } catch (err) {
      console.error('Failed to update medication:', err);
      throw err;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await api.delete(`/medications/${id}`);
      setMedications(medications.filter((med) => med.id !== id));
      setHistory(history.filter((h) => h.medicationId !== id));
    } catch (err) {
      console.error('Failed to delete medication:', err);
      throw err;
    }
  };

  const recordMedicationTaken = async (medicationId: string, time: string, scheduleId?: string) => {
    try {
      const response = await api.post('/adherence', {
        medication_id: medicationId,
        schedule_id: scheduleId || null,
        scheduled_for: new Date().toISOString(),
        status: 'taken',
        actual_time: new Date().toISOString(),
      });
      
      const newRecord: MedicationHistory = {
        id: response.log.id,
        medicationId,
        date: new Date(response.log.scheduled_for),
        taken: true,
        time,
      };
      setHistory(prev => [newRecord, ...prev]);
    } catch (err) {
      console.error('Failed to record adherence:', err);
    }
  };

  const recordMedicationMissed = async (medicationId: string, scheduleId?: string) => {
    try {
      const response = await api.post('/adherence', {
        medication_id: medicationId,
        schedule_id: scheduleId || null,
        scheduled_for: new Date().toISOString(),
        status: 'missed',
      });
      
      const newRecord: MedicationHistory = {
        id: response.log.id,
        medicationId,
        date: new Date(response.log.scheduled_for),
        taken: false,
      };
      setHistory(prev => [newRecord, ...prev]);
    } catch (err) {
      console.error('Failed to record missed adherence:', err);
    }
  };

  // Dependents functionality remains local/mocked for now as per minimal requirements
  const addDependent = (dependent: Omit<Dependent, 'id' | 'createdAt'>) => {
    setDependents([...dependents, { ...dependent, id: `dep_${Date.now()}`, createdAt: new Date() }]);
  };
  const updateDependent = (id: string, updates: Partial<Dependent>) => {
    setDependents(dependents.map((dep) => (dep.id === id ? { ...dep, ...updates } : dep)));
  };
  const deleteDependent = (id: string) => {
    setDependents(dependents.filter((dep) => dep.id !== id));
  };

  const getAdherenceStats = () => {
    return medications.map((med) => {
      const medHistory = history.filter((h) => h.medicationId === med.id);
      const taken = medHistory.filter((h) => h.taken).length;
      const total = medHistory.length || 1;
      const adherenceRate = Math.round((taken / total) * 100);

      return {
        medicationId: med.id,
        medicationName: med.name,
        totalDosesScheduled: total,
        totalDosesTaken: taken,
        adherenceRate,
        lastTaken: medHistory
          .filter((h) => h.taken)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date,
        trend: 'stable' as const,
      };
    });
  };

  const getDailySchedule = (date = new Date()): DailySchedule => {
    const dateStr = date.toDateString();
    
    // Map backend schedules to reminders
    const reminders: MedicationReminder[] = dbSchedules.length > 0 
      ? dbSchedules.map(mapScheduleReminder)
      // Fallback if no specific schedules are set, use basic mapping
      : medications.map((med, idx) => ({
          id: `rem_${med.id}_${dateStr}`,
          medicationId: med.id,
          time: `${8 + idx * 4}:00`,
          completed: false,
        }));

    const dailyHistory = history.filter(
      (h) => new Date(h.date).toDateString() === dateStr
    );

    const completedReminders = reminders.map((rem) => {
      const histRecord = dailyHistory.find((h) => h.medicationId === rem.medicationId);
      return histRecord
        ? { ...rem, completed: histRecord.taken, completedAt: histRecord.date }
        : rem;
    });

    const adherenceRate =
      completedReminders.length > 0
        ? Math.round(
            (completedReminders.filter((r) => r.completed).length /
              completedReminders.length) *
              100
          )
        : 0;

    return {
      date,
      reminders: completedReminders,
      adherenceRate,
    };
  };

  const value: DataContextType = {
    medications,
    history,
    dependents,
    dailySchedule: getDailySchedule(),
    addMedication,
    updateMedication,
    deleteMedication,
    recordMedicationTaken,
    recordMedicationMissed,
    addDependent,
    updateDependent,
    deleteDependent,
    getAdherenceStats,
    getDailySchedule,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
