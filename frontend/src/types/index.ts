// src/types/index.ts

export interface Room {
  id: string;
  name: string;
  capacity: number;
  features: string[];
}

export interface Asset {
  id: string;
  name: string;
  inventoryCode: string;
  status: "available" | "unavailable";
}

export interface Booking {
  id: string;
  resourceType: "room" | "asset";
  resourceId: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  notes: string;
}

export interface AppData {
  rooms: Room[];
  assets: Asset[];
  bookings: Booking[];
}