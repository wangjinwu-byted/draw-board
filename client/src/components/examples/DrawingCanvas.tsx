import { useState } from "react";
import { DrawingCanvas, type DrawingElement } from "../DrawingCanvas";

export default function DrawingCanvasExample() {
  const [elements, setElements] = useState<DrawingElement[]>([]);

  return (
    <div className="w-full h-96 relative bg-background border border-border rounded-md">
      <DrawingCanvas
        tool="pen"
        color="#000000"
        brushSize={2}
        elements={elements}
        onElementsChange={setElements}
      />
    </div>
  );
}
