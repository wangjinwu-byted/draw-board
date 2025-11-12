import { useState } from "react";
import { DrawingToolbar } from "../DrawingToolbar";
import type { Tool } from "../DrawingCanvas";

export default function DrawingToolbarExample() {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);

  return (
    <div className="relative w-full h-24 flex items-center justify-center">
      <DrawingToolbar
        tool={tool}
        onToolChange={setTool}
        color={color}
        onColorChange={setColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onUndo={() => console.log("Undo")}
        onRedo={() => console.log("Redo")}
        onClear={() => console.log("Clear")}
        canUndo={true}
        canRedo={false}
      />
    </div>
  );
}
