import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DrawingCanvas, type DrawingElement, type Tool } from "@/components/DrawingCanvas";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { WhiteboardCard } from "@/components/WhiteboardCard";
import { NewWhiteboardDialog } from "@/components/NewWhiteboardDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Whiteboard } from "@shared/schema";

interface LocalWhiteboard extends Whiteboard {
  elements: DrawingElement[];
}

export default function WhiteboardPage() {
  const { toast } = useToast();
  const [activeWhiteboardId, setActiveWhiteboardId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });
  const [history, setHistory] = useState<{ past: DrawingElement[][]; future: DrawingElement[][] }>({
    past: [],
    future: [],
  });
  
  const [localElements, setLocalElements] = useState<Record<string, DrawingElement[]>>({});
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { data: whiteboards = [], isLoading } = useQuery<Whiteboard[]>({
    queryKey: ["/api/whiteboards"],
  });

  const localWhiteboards: LocalWhiteboard[] = whiteboards.map((wb) => ({
    ...wb,
    elements: localElements[wb.id] !== undefined 
      ? localElements[wb.id]
      : (Array.isArray(wb.data) ? wb.data : []) as DrawingElement[],
  }));

  const activeWhiteboard = localWhiteboards.find((w) => w.id === activeWhiteboardId);

  useEffect(() => {
    if (!activeWhiteboardId && localWhiteboards.length > 0) {
      setActiveWhiteboardId(localWhiteboards[0].id);
    }
  }, [localWhiteboards, activeWhiteboardId]);

  useEffect(() => {
    whiteboards.forEach((wb) => {
      if (localElements[wb.id] === undefined) {
        setLocalElements((prev) => ({
          ...prev,
          [wb.id]: (Array.isArray(wb.data) ? wb.data : []) as DrawingElement[],
        }));
      }
    });
  }, [whiteboards]);

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/whiteboards", { name, data: [] });
      return await res.json() as Whiteboard;
    },
    onSuccess: (newWhiteboard) => {
      queryClient.invalidateQueries({ queryKey: ["/api/whiteboards"] });
      setActiveWhiteboardId(newWhiteboard.id);
      setHistory({ past: [], future: [] });
      setLocalElements((prev) => ({ ...prev, [newWhiteboard.id]: [] }));
      toast({
        title: "Whiteboard created",
        description: `Created "${newWhiteboard.name}"`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create whiteboard",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, elements }: { id: string; elements: DrawingElement[] }) => {
      const res = await apiRequest("PATCH", `/api/whiteboards/${id}`, { data: elements });
      return await res.json() as Whiteboard;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/whiteboards/${id}`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/whiteboards"] });
      setLocalElements((prev) => {
        const newElements = { ...prev };
        delete newElements[deletedId];
        return newElements;
      });
      if (activeWhiteboardId === deletedId) {
        const remaining = localWhiteboards.filter((w) => w.id !== deletedId);
        setActiveWhiteboardId(remaining.length > 0 ? remaining[0].id : null);
        setHistory({ past: [], future: [] });
      }
      toast({
        title: "Whiteboard deleted",
        description: "Whiteboard has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete whiteboard",
        variant: "destructive",
      });
    },
  });

  const saveToServer = useCallback((id: string, elements: DrawingElement[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      updateMutation.mutate({ id, elements });
    }, 500);
  }, []);

  const updateActiveWhiteboard = useCallback((elements: DrawingElement[]) => {
    if (!activeWhiteboardId) return;
    
    const currentElements = localElements[activeWhiteboardId] || [];
    
    setHistory((prev) => ({
      past: [...prev.past, [...currentElements]],
      future: [],
    }));

    setLocalElements((prev) => ({
      ...prev,
      [activeWhiteboardId]: elements,
    }));

    saveToServer(activeWhiteboardId, elements);
  }, [activeWhiteboardId, localElements, saveToServer]);

  const handleUndo = () => {
    if (history.past.length === 0 || !activeWhiteboardId) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    const currentElements = localElements[activeWhiteboardId] || [];
    
    setHistory({
      past: newPast,
      future: [[...currentElements], ...history.future],
    });
    
    setLocalElements((prev) => ({
      ...prev,
      [activeWhiteboardId]: previous,
    }));

    saveToServer(activeWhiteboardId, previous);
  };

  const handleRedo = () => {
    if (history.future.length === 0 || !activeWhiteboardId) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    const currentElements = localElements[activeWhiteboardId] || [];
    
    setHistory({
      past: [...history.past, [...currentElements]],
      future: newFuture,
    });
    
    setLocalElements((prev) => ({
      ...prev,
      [activeWhiteboardId]: next,
    }));

    saveToServer(activeWhiteboardId, next);
  };

  const handleClear = () => {
    if (!activeWhiteboardId) return;
    const currentElements = localElements[activeWhiteboardId] || [];
    
    setHistory({
      past: [...history.past, [...currentElements]],
      future: [],
    });
    
    setLocalElements((prev) => ({
      ...prev,
      [activeWhiteboardId]: [],
    }));

    saveToServer(activeWhiteboardId, []);
  };

  const handleCreateWhiteboard = (name: string) => {
    createMutation.mutate(name);
  };

  const handleDeleteWhiteboard = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading whiteboards...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 border-r border-border bg-sidebar overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold">Whiteboards</h1>
              <ThemeToggle />
            </div>
            <Button
              onClick={() => setNewDialogOpen(true)}
              className="w-full"
              data-testid="button-new-whiteboard"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Whiteboard
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {localWhiteboards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No whiteboards yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create one to get started</p>
                </div>
              ) : (
                localWhiteboards.map((whiteboard) => (
                  <WhiteboardCard
                    key={whiteboard.id}
                    id={whiteboard.id}
                    name={whiteboard.name}
                    onClick={() => {
                      setActiveWhiteboardId(whiteboard.id);
                      setHistory({ past: [], future: [] });
                    }}
                    onDelete={() => openDeleteDialog(whiteboard.id, whiteboard.name)}
                    isActive={whiteboard.id === activeWhiteboardId}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {activeWhiteboard && (
              <h2 className="font-medium" data-testid="text-active-whiteboard">
                {activeWhiteboard.name}
              </h2>
            )}
          </div>
          {!sidebarOpen && <ThemeToggle />}
        </div>

        <div className="flex-1 relative bg-background">
          {activeWhiteboard ? (
            <>
              <DrawingToolbar
                tool={tool}
                onToolChange={setTool}
                color={color}
                onColorChange={setColor}
                brushSize={brushSize}
                onBrushSizeChange={setBrushSize}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClear={handleClear}
                canUndo={history.past.length > 0}
                canRedo={history.future.length > 0}
              />
              <DrawingCanvas
                tool={tool}
                color={color}
                brushSize={brushSize}
                elements={activeWhiteboard.elements}
                onElementsChange={updateActiveWhiteboard}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No whiteboard selected</p>
            </div>
          )}
        </div>
      </div>

      <NewWhiteboardDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onCreate={handleCreateWhiteboard}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={() => {
          handleDeleteWhiteboard(deleteDialog.id);
          setDeleteDialog({ open: false, id: "", name: "" });
        }}
        whiteboardName={deleteDialog.name}
      />
    </div>
  );
}
