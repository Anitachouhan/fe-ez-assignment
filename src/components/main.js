import { useState } from "react";
import KanbanBoard from "./Kanban/KanbanBoard";
import TreeView from "./TreeView/TreeView";

function Main() {
  const [view, setView] = useState("tree");

  return (
    <div className="p-4">
      {/* Toggle Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setView("tree")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition
            ${
              view === "tree"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          `}
        >
          Tree View
        </button>

        <button
          onClick={() => setView("kanban")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition
            ${
              view === "kanban"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          `}
        >
          Kanban Board
        </button>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {view === "tree" && <TreeView />}
        {view === "kanban" && <KanbanBoard />}
      </div>
    </div>
  );
}

export default Main;
