import { Pencil, Eraser, Square, Circle, Minus, Undo, Redo, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Tool } from "./DrawingCanvas";

interface DrawingToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  color: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PRESET_COLORS = [
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function DrawingToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}: DrawingToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 bg-card/95 backdrop-blur-md border border-card-border rounded-md p-2 shadow-lg">
        <div className="flex items-center gap-1">
          <Button
            variant={tool === "pen" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onToolChange("pen")}
            data-testid="button-tool-pen"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === "eraser" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onToolChange("eraser")}
            data-testid="button-tool-eraser"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant={tool === "rectangle" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onToolChange("rectangle")}
            data-testid="button-tool-rectangle"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === "circle" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onToolChange("circle")}
            data-testid="button-tool-circle"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === "line" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => onToolChange("line")}
            data-testid="button-tool-line"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-testid="button-color-picker"
            >
              <div
                className="h-5 w-5 rounded-sm border-2 border-background"
                style={{ backgroundColor: color }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="center">
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    className="h-8 w-8 rounded-md border-2 border-border hover-elevate active-elevate-2 transition-transform"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => onColorChange(presetColor)}
                    data-testid={`button-color-${presetColor}`}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Custom Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-full h-9 rounded-md border border-border cursor-pointer"
                  data-testid="input-color-custom"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-16" data-testid="button-brush-size">
              <span className="text-xs">{brushSize}px</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="center">
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground">Brush Size</label>
              <Slider
                value={[brushSize]}
                onValueChange={(value) => onBrushSizeChange(value[0])}
                min={1}
                max={20}
                step={1}
                data-testid="slider-brush-size"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            data-testid="button-undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            data-testid="button-redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          data-testid="button-clear"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
