import { WhiteboardCard } from "../WhiteboardCard";

export default function WhiteboardCardExample() {
  return (
    <div className="w-64">
      <WhiteboardCard
        id="1"
        name="Project Brainstorm"
        onClick={() => console.log("Card clicked")}
        onDelete={() => console.log("Delete clicked")}
        isActive={false}
      />
    </div>
  );
}
