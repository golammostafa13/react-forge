import { useEffect, useState } from "react";

interface TreeNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    isExpanded?: boolean;
    children?: TreeNode[];
    parent?: string;
    content?: string; // File content for editing
}


// Action types for the tree reducer
type TreeAction =
    | { type: 'TOGGLE_EXPAND'; payload: { nodeId: string } }
    | { type: 'ADD_NODE'; payload: { parentId: string; name: string; type: 'file' | 'folder' } }
    | { type: 'DELETE_NODE'; payload: { nodeId: string } }
    | { type: 'RENAME_NODE'; payload: { nodeId: string; newName: string } }
    | { type: 'OPEN_FILE'; payload: { nodeId: string } }
    | { type: 'UPDATE_FILE_CONTENT'; payload: { nodeId: string; content: string } };

interface TreeNodeProps {
    node: TreeNode;
    depth: number;
    dispatch: React.Dispatch<TreeAction>;
    onContextMenu?: (node: TreeNode) => void;
    onFileClick?: (node: TreeNode) => void;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, depth, dispatch, onContextMenu, onFileClick }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(node.name);
    const [clickTimeout, setClickTimeout] = useState<number | null>(null);

    const handleClick = () => {
        if (node.type === 'folder') {
            dispatch({ type: 'TOGGLE_EXPAND', payload: { nodeId: node.id } });
        } else if (node.type === 'file' && onFileClick) {
            // Add delay for single click to allow double-click to take precedence
            const timeout = setTimeout(() => {
                onFileClick(node);
            }, 200);
            setClickTimeout(timeout);
        }
    };

    const handleDoubleClick = () => {
        if (node.type === 'file') {
            // Clear the single click timeout to prevent file opening
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                setClickTimeout(null);
            }
            setIsEditing(true);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
        };
    }, [clickTimeout]);

    const handleRename = () => {
        if (editName.trim() && editName !== node.name) {
            dispatch({ type: 'RENAME_NODE', payload: { nodeId: node.id, newName: editName.trim() } });
        }
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRename();
        } else if (e.key === 'Escape') {
            setEditName(node.name);
            setIsEditing(false);
        }
    };

    const getIcon = () => {
        if (node.type === 'folder') {
            return node.isExpanded ? '📂' : '📁';
        }

        // File icons based on extension
        const extension = node.name.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'tsx':
            case 'ts':
                return '⚛️';
            case 'js':
            case 'jsx':
                return '📜';
            case 'json':
                return '📋';
            case 'md':
                return '📝';
            case 'css':
                return '🎨';
            case 'ico':
                return '🖼️';
            case 'sql':
                return '💾';
            default:
                return '📄';
        }
    };

    return (
        <div>
            <div
                className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer select-none ${depth > 0 ? 'ml-4' : ''
                    }`}
                style={{ paddingLeft: `${depth * 20 + 8}px` }}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onContextMenu?.(node);
                }}
            >
                <span className="mr-2 text-lg">
                    {node.type === 'folder' && (
                        <span className="inline-block w-4 text-center text-gray-400">
                            {node.isExpanded ? '▼' : '▶'}
                        </span>
                    )}
                </span>
                <span className="mr-2">{getIcon()}</span>
                {isEditing ? (
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={handleKeyPress}
                        className="flex-1 px-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="flex-1 text-sm text-gray-800">{node.name}</span>
                )}
            </div>

            {node.type === 'folder' && node.isExpanded && node.children && (
                <div>
                    {node.children.map((child) => (
                        <TreeNodeComponent
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            dispatch={dispatch}
                            onContextMenu={onContextMenu}
                            onFileClick={onFileClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNodeComponent;