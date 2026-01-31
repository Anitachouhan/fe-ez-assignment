import { treeData } from "../../data/treedata";
import TreeNode from "./TreeNode";

const TreeView = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-2xl font-bold mb-8">Tree View</h1>

      {treeData.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default TreeView;
