import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWhiteboardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/whiteboards", async (req, res) => {
    try {
      const whiteboards = await storage.getAllWhiteboards();
      res.json(whiteboards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch whiteboards" });
    }
  });

  app.get("/api/whiteboards/:id", async (req, res) => {
    try {
      const whiteboard = await storage.getWhiteboard(req.params.id);
      if (!whiteboard) {
        return res.status(404).json({ error: "Whiteboard not found" });
      }
      res.json(whiteboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch whiteboard" });
    }
  });

  app.post("/api/whiteboards", async (req, res) => {
    try {
      const data = insertWhiteboardSchema.parse(req.body);
      const whiteboard = await storage.createWhiteboard(data);
      res.status(201).json(whiteboard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid whiteboard data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create whiteboard" });
    }
  });

  app.patch("/api/whiteboards/:id", async (req, res) => {
    try {
      const whiteboard = await storage.updateWhiteboard(req.params.id, req.body);
      if (!whiteboard) {
        return res.status(404).json({ error: "Whiteboard not found" });
      }
      res.json(whiteboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to update whiteboard" });
    }
  });

  app.delete("/api/whiteboards/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWhiteboard(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Whiteboard not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete whiteboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
