import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WhiteboardCardProps {
  id: string;
  name: string;
  onClick: () => void;
  onDelete: () => void;
  isActive?: boolean;
}

export function WhiteboardCard({
  id,
  name,
  onClick,
  onDelete,
  isActive,
}: WhiteboardCardProps) {
  return (
    <Card
      className={`group cursor-pointer hover-elevate active-elevate-2 transition-colors ${
        isActive ? "border-primary" : ""
      }`}
      onClick={onClick}
      data-testid={`card-whiteboard-${id}`}
    >
      <div className="p-3 space-y-2">
        <div className="aspect-[4/3] bg-muted rounded-md border border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-mono">Canvas</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate" data-testid={`text-name-${id}`}>
              {name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-menu-${id}`}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-destructive focus:text-destructive"
                data-testid={`button-delete-${id}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
