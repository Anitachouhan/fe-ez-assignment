import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const initialData = {
  todo: [
    { id: 1, title: "Create initial project plan" },
    { id: 2, title: "Design landing page" },
    { id: 3, title: "Review codebase structure" },
  ],
  inProgress: [
    { id: 4, title: "Implement authentication" },
    { id: 5, title: "Set up database schema" },
    { id: 6, title: "Fix navbar bugs" },
  ],
  done: [
    { id: 7, title: "Organize project repository" },
    { id: 8, title: "Write API documentation" },
  ],
};

const columnConfig = {
  todo: {
    title: "Todo",
    header: "bg-blue-500",
    indicator: "bg-yellow-400",
  },
  inProgress: {
    title: "In Progress",
    header: "bg-orange-400",
    indicator: "bg-yellow-400",
  },
  done: {
    title: "Done",
    header: "bg-green-500",
    indicator: "bg-green-400",
  },
};

const KanbanBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [cardTitle, setCardTitle] = useState("");
  const [columns, setColumns] = useState(initialData);
  const [draggedCard, setDraggedCard] = useState(null);

  const addCard = () => {
    if (!cardTitle.trim()) return;

    setColumns({
      ...columns,
      [activeColumn]: [
        ...columns[activeColumn],
        { id: Date.now(), title: cardTitle },
      ],
    });

    toast.success("Card added");
    setCardTitle("");
    setShowModal(false);
  };

  const deleteCard = (column, id) => {
    setColumns({
      ...columns,
      [column]: columns[column].filter((c) => c.id !== id),
    });
    toast.success("Card deleted");
  };

  const editCard = (column, id, title) => {
    setColumns({
      ...columns,
      [column]: columns[column].map((c) => (c.id === id ? { ...c, title } : c)),
    });
  };

  const onDragStart = (card, from) => {
    setDraggedCard({ card, from });
  };

  const onDrop = (to) => {
    if (!draggedCard) return;
    const { card, from } = draggedCard;

    setColumns({
      ...columns,
      [from]: columns[from].filter((c) => c.id !== card.id),
      [to]: [...columns[to], card],
    });
    setDraggedCard(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster />
      <div className="flex gap-6 overflow-x-auto">
        {Object.keys(columns).map((col) => {
          const cfg = columnConfig[col];
          return (
            <div
              key={col}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(col)}
              className="w-80 bg-white rounded-xl shadow-sm flex-shrink-0"
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-t-xl text-white ${cfg.header}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{cfg.title}</span>
                  <span className="bg-white/30 px-2 py-0.5 rounded text-xs">
                    {columns[col].length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveColumn(col);
                    setShowModal(true);
                  }}
                  className="bg-white text-gray-700 w-6 h-6 rounded flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3">
                <button
                  onClick={() => {
                    setActiveColumn(col);
                    setShowModal(true);
                  }}
                  className="w-full border rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  + Add Card
                </button>

                {columns[col].map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => onDragStart(card, col)}
                    className="bg-white rounded-lg shadow-sm border flex items-start gap-2 p-3 cursor-grab"
                  >
                    {/* Indicator */}
                    <div
                      className={`w-1 rounded ${cfg.indicator} h-full`}
                    ></div>

                    <div className="flex-1">
                      <EditableCard
                        card={card}
                        column={col}
                        editCard={editCard}
                      />
                    </div>

                    <button
                      onClick={() => deleteCard(col, card.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Card</h2>

            <input
              type="text"
              placeholder="Enter card title"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              autoFocus
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCardTitle("");
                }}
                className="px-4 py-2 text-sm rounded border"
              >
                Cancel
              </button>

              <button
                onClick={addCard}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// editable card
const EditableCard = ({ card, column, editCard }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(card.title);

  const save = () => {
    if (!value.trim()) return;
    editCard(column, card.id, value);
    setEditing(false);
  };

  return editing ? (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && save()}
      autoFocus
      className="w-full border rounded px-2 py-1 text-sm"
    />
  ) : (
    <p onDoubleClick={() => setEditing(true)} className="text-sm text-gray-700">
      {card.title}
    </p>
  );
};

export default KanbanBoard;
