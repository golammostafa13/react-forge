
import { useReducer, useState } from "react";

interface FormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox';
    value: string | boolean;
    required: boolean;
    options?: string[]; // For select fields
    placeholder?: string;
}

interface FormState {
    fields: FormField[];
    formData: Record<string, string | boolean>;
}

type FormAction =
    | { type: 'ADD_FIELD'; payload: { field: FormField } }
    | { type: 'REMOVE_FIELD'; payload: { fieldId: string } }
    | { type: 'UPDATE_FIELD'; payload: { fieldId: string; updates: Partial<FormField> } }
    | { type: 'UPDATE_FIELD_VALUE'; payload: { fieldId: string; value: string | boolean } }
    | { type: 'CLEAR_FORM' };

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'ADD_FIELD':
            return {
                ...state,
                fields: [...state.fields, action.payload.field],
                formData: {
                    ...state.formData,
                    [action.payload.field.id]: action.payload.field.value
                }
            };

        case 'REMOVE_FIELD': {
            const newFormData = { ...state.formData };
            delete newFormData[action.payload.fieldId];
            return {
                ...state,
                fields: state.fields.filter(field => field.id !== action.payload.fieldId),
                formData: newFormData
            };
        }

        case 'UPDATE_FIELD':
            return {
                ...state,
                fields: state.fields.map(field =>
                    field.id === action.payload.fieldId
                        ? { ...field, ...action.payload.updates }
                        : field
                )
            };

        case 'UPDATE_FIELD_VALUE':
            return {
                ...state,
                fields: state.fields.map(field =>
                    field.id === action.payload.fieldId
                        ? { ...field, value: action.payload.value }
                        : field
                ),
                formData: {
                    ...state.formData,
                    [action.payload.fieldId]: action.payload.value
                }
            };

        case 'CLEAR_FORM':
            return {
                fields: [],
                formData: {}
            };

        default:
            return state;
    }
};

const initialFormState: FormState = {
    fields: [
        {
            id: 'name',
            label: 'Full Name',
            type: 'text',
            value: '',
            required: true,
            placeholder: 'Enter your full name'
        },
        {
            id: 'email',
            label: 'Email Address',
            type: 'email',
            value: '',
            required: true,
            placeholder: 'Enter your email'
        }
    ],
    formData: {
        name: '',
        email: ''
    }
};

const Challenge4 = () => {
    const [formState, dispatch] = useReducer(formReducer, initialFormState);
    const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');
    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldOptions, setNewFieldOptions] = useState('');
    const [showAddField, setShowAddField] = useState(false);

    const addNewField = () => {
        if (!newFieldLabel.trim()) return;

        // Generate clean ID from label
        const generateFieldId = (label: string) => {
            return label.toLowerCase()
                .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
                .replace(/_+/g, '_') // Replace multiple underscores with single
                .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
        };

        const baseId = generateFieldId(newFieldLabel.trim());
        let fieldId = baseId;

        // Check if ID already exists and add suffix if needed
        let counter = 1;
        while (formState.fields.some(field => field.id === fieldId)) {
            fieldId = `${baseId}_${counter}`;
            counter++;
        }

        const newField: FormField = {
            id: fieldId,
            label: newFieldLabel.trim(),
            type: newFieldType,
            value: newFieldType === 'checkbox' ? false : '',
            required: false,
            placeholder: `Enter ${newFieldLabel.toLowerCase()}`,
            ...(newFieldType === 'select' && newFieldOptions.trim() && {
                options: newFieldOptions.split(',').map(opt => opt.trim()).filter(Boolean)
            })
        };

        dispatch({ type: 'ADD_FIELD', payload: { field: newField } });

        // Reset form
        setNewFieldLabel('');
        setNewFieldOptions('');
        setNewFieldType('text');
        setShowAddField(false);
    };

    const removeField = (fieldId: string) => {
        dispatch({ type: 'REMOVE_FIELD', payload: { fieldId } });
    };

    const updateFieldValue = (fieldId: string, value: string | boolean) => {
        dispatch({ type: 'UPDATE_FIELD_VALUE', payload: { fieldId, value } });
    };

    const toggleFieldRequired = (fieldId: string, required: boolean) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { fieldId, updates: { required } } });
    };

    const clearForm = () => {
        dispatch({ type: 'CLEAR_FORM' });
    };

    const renderField = (field: FormField) => {
        const commonProps = {
            id: field.id,
            required: field.required,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        };

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        value={field.value as string}
                        onChange={(e) => updateFieldValue(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                    />
                );

            case 'select':
                return (
                    <select
                        {...commonProps}
                        value={field.value as string}
                        onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    >
                        <option value="">Select an option</option>
                        {field.options?.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={field.id}
                            checked={field.value as boolean}
                            onChange={(e) => updateFieldValue(field.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
                            {field.label}
                        </label>
                    </div>
                );

            default:
                return (
                    <input
                        {...commonProps}
                        type={field.type}
                        value={field.value as string}
                        onChange={(e) => updateFieldValue(field.id, e.target.value)}
                        placeholder={field.placeholder}
                    />
                );
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Dynamic Form Builder</h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Add/remove fields dynamically and see real-time JSON output
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {/* Form Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Form Fields</h3>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setShowAddField(!showAddField)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                                >
                                    {showAddField ? 'Cancel' : 'Add Field'}
                                </button>
                                <button
                                    onClick={clearForm}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>

                        {/* Add New Field Form */}
                        {showAddField && (
                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                <h4 className="font-medium text-gray-700 mb-3">Add New Field</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Field Label
                                        </label>
                                        <input
                                            type="text"
                                            value={newFieldLabel}
                                            onChange={(e) => setNewFieldLabel(e.target.value)}
                                            placeholder="Enter field label"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Field Type
                                        </label>
                                        <select
                                            value={newFieldType}
                                            onChange={(e) => setNewFieldType(e.target.value as FormField['type'])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="number">Number</option>
                                            <option value="textarea">Textarea</option>
                                            <option value="select">Select</option>
                                            <option value="checkbox">Checkbox</option>
                                        </select>
                                    </div>

                                    {newFieldType === 'select' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Options (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={newFieldOptions}
                                                onChange={(e) => setNewFieldOptions(e.target.value)}
                                                placeholder="Option 1, Option 2, Option 3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={addNewField}
                                        disabled={!newFieldLabel.trim()}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Add Field
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Dynamic Form */}
                        <div className="space-y-4">
                            {formState.fields.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No fields added yet. Click "Add Field" to get started!</p>
                                </div>
                            ) : (
                                formState.fields.map((field) => (
                                    <div key={field.id} className="relative group">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-1">
                                                {field.type !== 'checkbox' && (
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <label
                                                            htmlFor={field.id}
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            {field.label}
                                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                                        </label>
                                                        <label className="flex items-center text-xs text-gray-500">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => toggleFieldRequired(field.id, e.target.checked)}
                                                                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-1"
                                                            />
                                                            Required
                                                        </label>
                                                    </div>
                                                )}
                                                {renderField(field)}
                                            </div>
                                            <button
                                                onClick={() => removeField(field.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove field"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* JSON Output Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Real-time JSON Output</h3>

                        <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-auto">
                            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                                {JSON.stringify(
                                    formState.fields.reduce((acc, field) => {
                                        acc[field.id] = {
                                            value: formState.formData[field.id],
                                            isRequired: field.required
                                        };
                                        return acc;
                                    }, {} as Record<string, { value: string | boolean; isRequired: boolean }>),
                                    null,
                                    2
                                )}
                            </pre>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Form Statistics</h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>Total Fields: {formState.fields.length}</p>
                                <p>Required Fields: {formState.fields.filter(f => f.required).length}</p>
                                <p>Filled Fields: {Object.values(formState.formData).filter(v => v !== '' && v !== false).length}</p>
                                <p>Field Types: {Array.from(new Set(formState.fields.map(f => f.type))).join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t text-xs text-gray-500">
                    💡 Tip: Hover over fields to see remove button • Toggle required status • Watch JSON update in real-time
                </div>
            </div>
        </div>
    );
};

export default Challenge4;
