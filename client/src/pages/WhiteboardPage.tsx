import { useState, useCallback } from "react";
import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DrawingCanvas, type DrawingElement, type Tool } from "@/components/DrawingCanvas";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { WhiteboardCard } from "@/components/WhiteboardCard";
import { NewWhiteboardDialog } from "@/components/NewWhiteboardDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface Whiteboard {
  id: string;
  name: string;
  elements: DrawingElement[];
}

export default function WhiteboardPage() {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([
    { id: "1", name: "Welcome Board", elements: [] },
  ]);
  const [activeWhiteboardId, setActiveWhiteboardId] = useState("1");
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

  const activeWhiteboard = whiteboards.find((w) => w.id === activeWhiteboardId);

  const updateActiveWhiteboard = useCallback((elements: DrawingElement[]) => {
    setWhiteboards((prev) =>
      prev.map((w) => (w.id === activeWhiteboardId ? { ...w, elements } : w))
    );
    setHistory((prev) => ({
      past: [...prev.past, activeWhiteboard?.elements || []],
      future: [],
    }));
  }, [activeWhiteboardId, activeWhiteboard]);

  const handleUndo = () => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    setHistory({
      past: newPast,
      future: [activeWhiteboard?.elements || [], ...history.future],
    });
    setWhiteboards((prev) =>
      prev.map((w) => (w.id === activeWhiteboardId ? { ...w, elements: previous } : w))
    );
  };

  const handleRedo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({
      past: [...history.past, activeWhiteboard?.elements || []],
      future: newFuture,
    });
    setWhiteboards((prev) =>
      prev.map((w) => (w.id === activeWhiteboardId ? { ...w, elements: next } : w))
    );
  };

  const handleClear = () => {
    if (activeWhiteboard) {
      setHistory({
        past: [...history.past, activeWhiteboard.elements],
        future: [],
      });
      updateActiveWhiteboard([]);
    }
  };

  const handleCreateWhiteboard = (name: string) => {
    const newWhiteboard: Whiteboard = {
      id: Date.now().toString(),
      name,
      elements: [],
    };
    setWhiteboards((prev) => [...prev, newWhiteboard]);
    setActiveWhiteboardId(newWhiteboard.id);
    setHistory({ past: [], future: [] });
  };

  const handleDeleteWhiteboard = (id: string) => {
    setWhiteboards((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      if (activeWhiteboardId === id && filtered.length > 0) {
        setActiveWhiteboardId(filtered[0].id);
        setHistory({ past: [], future: [] });
      }
      return filtered;
    });
  };

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

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
              {whiteboards.map((whiteboard) => (
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
              ))}
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
