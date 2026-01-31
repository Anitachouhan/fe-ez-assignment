import { useState } from "react";
import toast from "react-hot-toast";

// Fake API lazy load
const fakeApiLoad = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: Date.now() + 1,
          name: "Level B",
          color: "bg-green-400",
          children: null,
        },
        {
          id: Date.now() + 2,
          name: "Level B",
          color: "bg-green-400",
          children: null,
        },
      ]);
    }, 700);
  });

const TreeNode = ({ node, onDelete, level = 1 }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(node.children);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");

  const toggle = async () => {
    if (!open && children === null) {
      const data = await fakeApiLoad(); // lazy load
      setChildren(data);
      toast.success("Children loaded!");
    }
    setOpen(!open);
  };

  // Add Node Popup Handlers
  const openAddPopup = () => setAddPopup(true);
  const cancelAdd = () => {
    setNewNodeName("");
    setAddPopup(false);
  };
  const confirmAdd = () => {
    if (!newNodeName.trim()) {
      toast.error("Node name cannot be empty!");
      return;
    }
    const newNode = {
      id: Date.now(),
      name: newNodeName.trim(),
      color: "bg-green-400",
      children: null,
    };
    setChildren([...(children || []), newNode]);
    setOpen(true);
    toast.success(`Node "${newNodeName}" added!`);
    setNewNodeName("");
    setAddPopup(false);
  };

  // Edit Name
  const saveName = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    setEditing(false);
    toast.success(`Node renamed to "${name}"`);
  };
  const handleEdit = () => setEditing(true);

  // Delete Node
  const handleDelete = () => {
    if (level === 1) {
      toast.error("Cannot delete the first level!");
      return;
    }
    setConfirmDelete(true);
  };
  const confirmDeleteNode = () => {
    setConfirmDelete(false);
    if (onDelete) onDelete(node.id);
    toast.success(`Node "${name}" deleted!`);
  };
  const cancelDelete = () => {
    setConfirmDelete(false);
    toast("Delete cancelled");
  };

  return (
    <div className="relative ml-10">
      <div className="absolute left-4 top-0 h-full border-l border-dashed border-gray-300" />

      <div className="flex items-center gap-3 bg-white shadow-md rounded-lg px-4 py-2 w-fit">
        <button
          onClick={toggle}
          className="w-6 h-6 border rounded flex items-center justify-center text-sm"
        >
          {open ? "-" : "+"}
        </button>

        <div
          className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold ${node.color}`}
        >
          {name[0]}
        </div>

        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            autoFocus
            className="border px-1 rounded"
          />
        ) : (
          <span className="font-medium">{name}</span>
        )}

        <button
          onClick={handleEdit}
          className="border px-2 rounded bg-blue-100 hover:bg-blue-200"
        >
          ✎
        </button>
        <button
          onClick={handleDelete}
          className="border px-2 rounded bg-red-100 hover:bg-red-200"
        >
          🗑
        </button>
        <button
          onClick={openAddPopup}
          className="border px-2 rounded bg-green-100 hover:bg-green-200"
        >
          +
        </button>
      </div>

      {/* Add Popup */}
      {addPopup && (
        <div className="mt-2 p-3 bg-green-100 border border-green-300 rounded w-60 flex flex-col gap-2">
          <span>Enter node name:</span>
          <input
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            className="border px-1 py-1 rounded w-full"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={confirmAdd}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
            <button
              onClick={cancelAdd}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* delete popup */}
      {confirmDelete && (
        <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded w-60 flex flex-col gap-2">
          <span>Are you sure you want to delete "{name}"?</span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={confirmDeleteNode}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      )}

      {open && children && (
        <div className="mt-3 space-y-3">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onDelete={(id) =>
                setChildren(children.filter((c) => c.id !== id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
