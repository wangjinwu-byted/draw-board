import { useState } from "react";
import { NewWhiteboardDialog } from "../NewWhiteboardDialog";
import { Button } from "@/components/ui/button";

export default function NewWhiteboardDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <NewWhiteboardDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={(name) => console.log("Created:", name)}
      />
    </div>
  );
}
