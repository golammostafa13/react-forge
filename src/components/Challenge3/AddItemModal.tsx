import { useState } from "react";

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, type: 'file' | 'folder') => void;
    parentName: string;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd, parentName }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'file' | 'folder'>('file');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim(), type);
            setName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="text-lg font-semibold mb-4">
                    Add to "{parentName}"
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="file"
                                    checked={type === 'file'}
                                    onChange={(e) => setType(e.target.value as 'file')}
                                    className="mr-2"
                                />
                                📄 File
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="folder"
                                    checked={type === 'folder'}
                                    onChange={(e) => setType(e.target.value as 'folder')}
                                    className="mr-2"
                                />
                                📁 Folder
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={type === 'file' ? 'filename.ext' : 'folder-name'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Add {type}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;