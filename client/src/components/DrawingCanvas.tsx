import { useEffect, useRef, useState } from "react";

export type DrawingElement = {
  type: "path" | "rectangle" | "circle" | "line";
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  color: string;
  size: number;
};

export type Tool = "pen" | "eraser" | "rectangle" | "circle" | "line";

interface DrawingCanvasProps {
  tool: Tool;
  color: string;
  brushSize: number;
  elements: DrawingElement[];
  onElementsChange: (elements: DrawingElement[]) => void;
  onClear?: () => void;
}

export function DrawingCanvas({
  tool,
  color,
  brushSize,
  elements,
  onElementsChange,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redraw();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    redraw();
  }, [elements, currentElement]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    [...elements, currentElement].filter(Boolean).forEach((element) => {
      if (!element) return;

      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (element.type === "path") {
        if (element.points && element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      } else if (element.type === "rectangle" && element.x !== undefined) {
        ctx.strokeRect(element.x, element.y!, element.width!, element.height!);
      } else if (element.type === "circle" && element.x !== undefined) {
        const radius = Math.sqrt(
          Math.pow(element.width!, 2) + Math.pow(element.height!, 2)
        ) / 2;
        const centerX = element.x + element.width! / 2;
        const centerY = element.y! + element.height! / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.abs(radius), 0, 2 * Math.PI);
        ctx.stroke();
      } else if (element.type === "line" && element.x1 !== undefined) {
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1!);
        ctx.lineTo(element.x2!, element.y2!);
        ctx.stroke();
      }
    });
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    if (tool === "pen" || tool === "eraser") {
      setCurrentElement({
        type: "path",
        points: [{ x, y }],
        color: tool === "eraser" ? "#ffffff" : color,
        size: brushSize,
      });
    } else if (tool === "rectangle") {
      setCurrentElement({
        type: "rectangle",
        x,
        y,
        width: 0,
        height: 0,
        color,
        size: brushSize,
      });
    } else if (tool === "circle") {
      setCurrentElement({
        type: "circle",
        x,
        y,
        width: 0,
        height: 0,
        color,
        size: brushSize,
      });
    } else if (tool === "line") {
      setCurrentElement({
        type: "line",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        color,
        size: brushSize,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;
    const { x, y } = getCoordinates(e);

    if (tool === "pen" || tool === "eraser") {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), { x, y }],
      });
    } else if (tool === "rectangle") {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x!,
        height: y - currentElement.y!,
      });
    } else if (tool === "circle") {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x!,
        height: y - currentElement.y!,
      });
    } else if (tool === "line") {
      setCurrentElement({
        ...currentElement,
        x2: x,
        y2: y,
      });
    }
  };

  const handleMouseUp = () => {
    if (currentElement) {
      onElementsChange([...elements, currentElement]);
      setCurrentElement(null);
    }
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="absolute inset-0 cursor-crosshair"
      data-testid="canvas-drawing"
    />
  );
}
