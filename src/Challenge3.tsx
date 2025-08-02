
import { useCallback, useEffect, useReducer, useState } from "react";
import AddItemModal from "./components/Challenge3/AddItemModal";
import TreeNodeComponent from "./components/Challenge3/TreeNodeComponent";

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

// Reducer function to manage tree state
const treeReducer = (state: TreeNode[], action: TreeAction): TreeNode[] => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
            switch (action.type) {
                case 'TOGGLE_EXPAND':
                    if (node.id === action.payload.nodeId && node.type === 'folder') {
                        return { ...node, isExpanded: !node.isExpanded };
                    }
                    break;

                case 'ADD_NODE':
                    if (node.id === action.payload.parentId && node.type === 'folder') {
                        const newNode: TreeNode = {
                            id: `${Date.now()}-${Math.random()}`,
                            name: action.payload.name,
                            type: action.payload.type,
                            isExpanded: false,
                            children: action.payload.type === 'folder' ? [] : undefined,
                            parent: node.id
                        };
                        return {
                            ...node,
                            children: [...(node.children || []), newNode],
                            isExpanded: true // Auto-expand when adding children
                        };
                    }
                    break;

                case 'DELETE_NODE':
                    if (node.id === action.payload.nodeId) {
                        return null; // Mark for deletion
                    }
                    break;

                case 'RENAME_NODE':
                    if (node.id === action.payload.nodeId) {
                        return { ...node, name: action.payload.newName };
                    }
                    break;

                case 'OPEN_FILE':
                    if (node.id === action.payload.nodeId && node.type === 'file') {
                        // Initialize content if it doesn't exist
                        return {
                            ...node,
                            content: node.content ?? '// Edit this file content here...'
                        };
                    }
                    break;

                case 'UPDATE_FILE_CONTENT':
                    if (node.id === action.payload.nodeId && node.type === 'file') {
                        return { ...node, content: action.payload.content };
                    }
                    break;
            }

            // Recursively update children
            if (node.children) {
                const updatedChildren = updateNode(node.children).filter(child => child !== null);
                return { ...node, children: updatedChildren };
            }

            return node;
        }).filter(node => node !== null);
    };

    return updateNode(state);
};

// Initial tree data
const initialTree: TreeNode[] = [
    {
        id: 'root',
        name: 'My Project',
        type: 'folder',
        isExpanded: true,
        children: [
            {
                id: 'src',
                name: 'src',
                type: 'folder',
                isExpanded: false,
                parent: 'root',
                children: [
                    { id: 'app', name: 'App.tsx', type: 'file', parent: 'src' },
                    { id: 'index', name: 'index.tsx', type: 'file', parent: 'src' },
                    {
                        id: 'components',
                        name: 'components',
                        type: 'folder',
                        isExpanded: false,
                        parent: 'src',
                        children: [
                            { id: 'header', name: 'Header.tsx', type: 'file', parent: 'components' },
                            { id: 'sidebar', name: 'Sidebar.tsx', type: 'file', parent: 'components' }
                        ]
                    }
                ]
            },
            {
                id: 'public',
                name: 'public',
                type: 'folder',
                isExpanded: false,
                parent: 'root',
                children: [
                    { id: 'favicon', name: 'favicon.ico', type: 'file', parent: 'public' },
                    { id: 'manifest', name: 'manifest.json', type: 'file', parent: 'public' }
                ]
            },
            { id: 'package', name: 'package.json', type: 'file', parent: 'root' },
            { id: 'readme', name: 'README.md', type: 'file', parent: 'root' }
        ]
    }
];


const Challenge3 = () => {
    const [tree, dispatch] = useReducer(treeReducer, initialTree);
    const [contextNode, setContextNode] = useState<TreeNode | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [openedFile, setOpenedFile] = useState<TreeNode | null>(null);
    const [fileContent, setFileContent] = useState<string>('');

    const handleContextMenu = (node: TreeNode) => {
        if (node.type === 'folder') {
            setContextNode(node);
            setShowAddModal(true);
        }
    };

    const handleAddItem = (name: string, type: 'file' | 'folder') => {
        if (contextNode) {
            dispatch({
                type: 'ADD_NODE',
                payload: { parentId: contextNode.id, name, type }
            });
        }
        setContextNode(null);
    };

    const handleFileClick = (node: TreeNode) => {
        if (node.type === 'file') {
            // Open the file and initialize content if needed
            dispatch({ type: 'OPEN_FILE', payload: { nodeId: node.id } });

            // Find the updated node to get its content
            const findNode = (nodes: TreeNode[]): TreeNode | null => {
                for (const n of nodes) {
                    if (n.id === node.id) return n;
                    if (n.children) {
                        const found = findNode(n.children);
                        if (found) return found;
                    }
                }
                return null;
            };

            const updatedNode = findNode(tree) || node;
            setOpenedFile(updatedNode);
            setFileContent(updatedNode.content || '// Edit this file content here...');
        }
    };

    const handleSaveFile = useCallback(() => {
        if (openedFile) {
            dispatch({
                type: 'UPDATE_FILE_CONTENT',
                payload: { nodeId: openedFile.id, content: fileContent }
            });
            setOpenedFile(null);
            setFileContent('');
        }
    }, [openedFile, fileContent, dispatch]);

    const handleCloseFile = useCallback(() => {
        setOpenedFile(null);
        setFileContent('');
    }, []);

    // Keyboard shortcuts for file editor
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (openedFile) {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    handleSaveFile();
                } else if (e.key === 'Escape') {
                    handleCloseFile();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [openedFile, handleSaveFile, handleCloseFile]);

    const expandAll = () => {
        const expandFolder = (nodes: TreeNode[]) => {
            nodes.forEach(node => {
                if (node.type === 'folder' && !node.isExpanded) {
                    dispatch({ type: 'TOGGLE_EXPAND', payload: { nodeId: node.id } });
                }
                if (node.children) {
                    expandFolder(node.children);
                }
            });
        };

        expandFolder(tree);
    };

    const getTotalItems = (nodes: TreeNode[]): { files: number; folders: number } => {
        let files = 0;
        let folders = 0;

        const count = (nodeList: TreeNode[]) => {
            nodeList.forEach(node => {
                if (node.type === 'file') {
                    files++;
                } else {
                    folders++;
                    if (node.children) {
                        count(node.children);
                    }
                }
            });
        };

        count(nodes);
        return { files, folders };
    };

    const stats = getTotalItems(tree);

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">File Explorer</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Click folders to expand/collapse • Click files to edit • Double-click files to rename • Right-click folders to add items
                            </p>
                        </div>
                        <div className="text-right">
                            <button
                                onClick={expandAll}
                                className="mb-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Expand All
                            </button>
                            <div className="text-sm text-gray-500">
                                {stats.folders} folders • {stats.files} files
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="border rounded-lg bg-gray-50 min-h-96">
                        {tree.map((node) => (
                            <TreeNodeComponent
                                key={node.id}
                                node={node}
                                depth={0}
                                dispatch={dispatch}
                                onContextMenu={handleContextMenu}
                                onFileClick={handleFileClick}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t text-xs text-gray-500">
                    💡 Tip: Click files to edit • Double-click files to rename • Right-click folders to add items
                </div>
            </div>

            {/* File Editor Modal */}
            {openedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold flex items-center">
                                <span className="mr-2">✏️</span>
                                Editing: {openedFile.name}
                            </h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSaveFile}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                                >
                                    <span className="mr-1">💾</span>
                                    Save
                                </button>
                                <button
                                    onClick={handleCloseFile}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-4">
                            <textarea
                                value={fileContent}
                                onChange={(e) => setFileContent(e.target.value)}
                                className="w-full h-full border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Start typing your file content here..."
                            />
                        </div>
                        <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
                            <kbd>Ctrl+S</kbd> to save • <kbd>Esc</kbd> to close without saving
                        </div>
                    </div>
                </div>
            )}

            <AddItemModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setContextNode(null);
                }}
                onAdd={handleAddItem}
                parentName={contextNode?.name || ''}
            />
        </div>
    );
};

export default Challenge3;
