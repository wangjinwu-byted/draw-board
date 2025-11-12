import { type Whiteboard, type InsertWhiteboard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllWhiteboards(): Promise<Whiteboard[]>;
  getWhiteboard(id: string): Promise<Whiteboard | undefined>;
  createWhiteboard(whiteboard: InsertWhiteboard): Promise<Whiteboard>;
  updateWhiteboard(id: string, whiteboard: Partial<InsertWhiteboard>): Promise<Whiteboard | undefined>;
  deleteWhiteboard(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private whiteboards: Map<string, Whiteboard>;

  constructor() {
    this.whiteboards = new Map();
  }

  async getAllWhiteboards(): Promise<Whiteboard[]> {
    return Array.from(this.whiteboards.values());
  }

  async getWhiteboard(id: string): Promise<Whiteboard | undefined> {
    return this.whiteboards.get(id);
  }

  async createWhiteboard(insertWhiteboard: InsertWhiteboard): Promise<Whiteboard> {
    const id = randomUUID();
    const whiteboard: Whiteboard = { 
      id, 
      name: insertWhiteboard.name,
      data: insertWhiteboard.data || []
    };
    this.whiteboards.set(id, whiteboard);
    return whiteboard;
  }

  async updateWhiteboard(id: string, updates: Partial<InsertWhiteboard>): Promise<Whiteboard | undefined> {
    const whiteboard = this.whiteboards.get(id);
    if (!whiteboard) return undefined;
    
    const updated: Whiteboard = { ...whiteboard, ...updates };
    this.whiteboards.set(id, updated);
    return updated;
  }

  async deleteWhiteboard(id: string): Promise<boolean> {
    return this.whiteboards.delete(id);
  }
}

export const storage = new MemStorage();
