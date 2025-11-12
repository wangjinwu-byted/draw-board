import { useState } from "react";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Whiteboard
      </Button>
      <DeleteConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          console.log("Deleted");
          setOpen(false);
        }}
        whiteboardName="My Whiteboard"
      />
    </div>
  );
}
