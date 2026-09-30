// src/store/index.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppData, Room, Asset, Booking } from '@/types';
import { initDB, saveData, loadData } from '@/utils/db';
const initialData: AppData = {
  rooms: [
    { id: 'r-101', name: 'Аудитория 101', capacity: 30, features: ['projector', 'whiteboard'] },
    { id: 'r-203', name: 'Аудитория 203', capacity: 20, features: [] },
  ],
  assets: [
    { id: 'a-proj-1', name: 'Проектор Epson', inventoryCode: 'PRJ-001', status: 'available' },
  ],
  bookings: [
    {
      id: 'b-1',
      resourceType: 'room',
      resourceId: 'r-101',
      title: 'Семинар',
      start: '2025-09-05T08:00:00Z',
      end: '2025-09-05T09:30:00Z',
      notes: 'Нужен HDMI',
    },
  ],
};

interface AppContextType {
  data: AppData;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  setData: (data: AppData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initDB().then(() => {
      loadData().then(loadedData => {
        if (loadedData) setData(loadedData);
        setIsLoaded(true);
      }).catch(err => {
        console.error('Failed to load data:', err);
        setIsLoaded(true);
      });
    }).catch(err => {
      console.error('Failed to init DB:', err);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData(data).catch(err => console.error('Failed to save data:', err));
    }
  }, [data, isLoaded]);

  const addRoom = (room: Room) => setData(prev => ({ ...prev, rooms: [...prev.rooms, room] }));
  const updateRoom = (id: string, updates: Partial<Room>) =>
    setData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === id ? { ...r, ...updates } : r),
    }));
  const deleteRoom = (id: string) =>
    setData(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== id) }));

  const addAsset = (asset: Asset) => setData(prev => ({ ...prev, assets: [...prev.assets, asset] }));
  const updateAsset = (id: string, updates: Partial<Asset>) =>
    setData(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  const deleteAsset = (id: string) =>
    setData(prev => ({ ...prev, assets: prev.assets.filter(a => a.id !== id) }));

  const addBooking = (booking: Booking) => {
    // Проверка на пересечения
    const hasConflict = data.bookings.some(b =>
      b.resourceId === booking.resourceId &&
      b.resourceType === booking.resourceType &&
      ((new Date(booking.start) < new Date(b.end) && new Date(booking.end) > new Date(b.start)))
    );
    if (hasConflict) {
      throw new Error('Пересечение с существующей бронью!');
    }
    setData(prev => ({ ...prev, bookings: [...prev.bookings, booking] }));
  };
  const updateBooking = (id: string, updates: Partial<Booking>) =>
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === id ? { ...b, ...updates } : b),
    }));
  const deleteBooking = (id: string) =>
    setData(prev => ({ ...prev, bookings: prev.bookings.filter(b => b.id !== id) }));

  return (
    <AppContext.Provider value={{
      data,
      addRoom,
      updateRoom,
      deleteRoom,
      addAsset,
      updateAsset,
      deleteAsset,
      addBooking,
      updateBooking,
      deleteBooking,
      setData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}