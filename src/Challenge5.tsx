
import { useReducer } from "react";

interface Cell {
    value: number | null;
    isFixed: boolean; // For pre-filled cells
}

interface BoardState {
    cells: Cell[][];
    isComplete: boolean;
    filledCells: number;
}

type BoardAction =
    | { type: 'SET_CELL'; payload: { row: number; col: number; value: number | null } }
    | { type: 'CLEAR_BOARD' }
    | { type: 'LOAD_PUZZLE'; payload: { puzzle: (number | null)[][] } };

// Create empty 9x9 board
const createEmptyBoard = (): Cell[][] => {
    return Array(9).fill(null).map(() =>
        Array(9).fill(null).map(() => ({
            value: null,
            isFixed: false
        }))
    );
};

// Sample puzzle for demonstration
const samplePuzzle: (number | null)[][] = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9]
];

const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
    switch (action.type) {
        case 'SET_CELL': {
            const { row, col, value } = action.payload;
            if (state.cells[row][col].isFixed) return state;

            const newCells = state.cells.map((r, rIndex) =>
                r.map((cell, cIndex) => {
                    if (rIndex === row && cIndex === col) {
                        return { ...cell, value };
                    }
                    return cell;
                })
            );

            // Calculate filled cells
            const filledCells = newCells.flat().filter(cell => cell.value !== null).length;

            return {
                ...state,
                cells: newCells,
                filledCells,
                isComplete: filledCells === 81 && validateBoard(newCells)
            };
        }

        case 'CLEAR_BOARD':
            return {
                cells: state.cells.map(row =>
                    row.map(cell => ({
                        ...cell,
                        value: cell.isFixed ? cell.value : null
                    }))
                ),
                isComplete: false,
                filledCells: state.cells.flat().filter(cell => cell.isFixed).length
            };

        case 'LOAD_PUZZLE': {
            const newCells = createEmptyBoard();
            let filledCount = 0;

            action.payload.puzzle.forEach((row, rIndex) => {
                row.forEach((value, cIndex) => {
                    if (value !== null) {
                        newCells[rIndex][cIndex] = {
                            value,
                            isFixed: true
                        };
                        filledCount++;
                    }
                });
            });

            return {
                cells: newCells,
                isComplete: false,
                filledCells: filledCount
            };
        }

        default:
            return state;
    }
};

// Validation functions
const validateBoard = (cells: Cell[][]): boolean => {
    // Check if board has any conflicts
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (hasConflict(cells, row, col)) {
                return false;
            }
        }
    }
    return true;
};

const hasConflict = (cells: Cell[][], row: number, col: number): boolean => {
    const cellValue = cells[row][col].value;
    if (cellValue === null) return false;

    // Check row
    const rowValues = cells[row].map(cell => cell.value).filter(v => v !== null);
    if (rowValues.filter(v => v === cellValue).length > 1) return true;

    // Check column
    const colValues = cells.map(r => r[col].value).filter(v => v !== null);
    if (colValues.filter(v => v === cellValue).length > 1) return true;

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const boxValues: (number | null)[] = [];

    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (cells[r][c].value !== null) {
                boxValues.push(cells[r][c].value);
            }
        }
    }

    return boxValues.filter(v => v === cellValue).length > 1;
};

const initialState: BoardState = {
    cells: createEmptyBoard(),
    isComplete: false,
    filledCells: 0
};

const Challenge5 = () => {
    const [boardState, dispatch] = useReducer(boardReducer, initialState);

    // Handle cell value changes
    const handleCellChange = (row: number, col: number, value: string) => {
        const numValue = value === '' ? null : parseInt(value);
        if (numValue !== null && (numValue < 1 || numValue > 9)) return;

        dispatch({ type: 'SET_CELL', payload: { row, col, value: numValue } });
    };

    const clearBoard = () => {
        dispatch({ type: 'CLEAR_BOARD' });
    };

    const loadSamplePuzzle = () => {
        dispatch({ type: 'LOAD_PUZZLE', payload: { puzzle: samplePuzzle } });
    };

    const getCellClassName = (cell: Cell, row: number, col: number) => {
        let classes = "w-10 h-10 text-center border border-gray-400 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ";

        // Fixed cells (pre-filled)
        if (cell.isFixed) {
            classes += "bg-gray-100 text-gray-800 font-bold ";
        } else {
            classes += "bg-white ";
        }

        // Conflict highlighting (computed on-the-fly)
        if (hasConflict(boardState.cells, row, col)) {
            classes += "bg-red-100 text-red-700 border-red-500 ";
        }

        // 3x3 box borders
        if (row % 3 === 0) classes += "border-t-2 border-t-gray-800 ";
        if (col % 3 === 0) classes += "border-l-2 border-l-gray-800 ";
        if (row === 8) classes += "border-b-2 border-b-gray-800 ";
        if (col === 8) classes += "border-r-2 border-r-gray-800 ";

        return classes;
    };

    const getValidationStats = () => {
        let conflicts = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (hasConflict(boardState.cells, row, col)) {
                    conflicts++;
                }
            }
        }
        const progress = Math.round((boardState.filledCells / 81) * 100);
        return { conflicts, progress };
    };

    const stats = getValidationStats();

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Sudoku Puzzle Board</h2>
                    <p className="text-purple-100 text-sm mt-1">
                        Fill the 9×9 grid with numbers 1-9. No duplicates in rows, columns, or 3×3 boxes!
                    </p>
                </div>

                <div className="p-6">
                    {/* Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-x-3">
                            <button
                                onClick={loadSamplePuzzle}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Load Sample Puzzle
                            </button>
                            <button
                                onClick={clearBoard}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Clear Board
                            </button>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-gray-600">
                                Progress: {stats.progress}% ({boardState.filledCells}/81)
                            </div>
                            {stats.conflicts > 0 && (
                                <div className="text-sm text-red-600">
                                    ⚠️ {stats.conflicts} conflicts
                                </div>
                            )}
                            {boardState.isComplete && (
                                <div className="text-sm text-green-600 font-bold">
                                    🎉 Puzzle Complete!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Game Board */}
                    <div className="flex justify-center">
                        <div className="inline-block border-2 border-gray-800 bg-gray-800">
                            {boardState.cells.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex">
                                    {row.map((cell, colIndex) => (
                                        <input
                                            key={`${rowIndex}-${colIndex}`}
                                            type="text"
                                            value={cell.value || ''}
                                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                            disabled={cell.isFixed}
                                            maxLength={1}
                                            className={getCellClassName(cell, rowIndex, colIndex)}
                                            title={
                                                hasConflict(boardState.cells, rowIndex, colIndex)
                                                    ? "This number conflicts with another in the same row, column, or 3×3 box"
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">How to Play</h4>
                            <ul className="text-gray-600 space-y-1">
                                <li>• Fill empty cells with numbers 1-9</li>
                                <li>• Each row must contain 1-9</li>
                                <li>• Each column must contain 1-9</li>
                                <li>• Each 3×3 box must contain 1-9</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Visual Guide</h4>
                            <ul className="text-blue-700 space-y-1">
                                <li>• <span className="bg-gray-100 px-1 rounded">Gray cells</span> are fixed</li>
                                <li>• <span className="bg-red-100 px-1 rounded">Red cells</span> have conflicts</li>
                                <li>• <span className="border-2 border-gray-800 px-1">Thick borders</span> show 3×3 boxes</li>
                                <li>• Hover conflicts for details</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">Current Status</h4>
                            <div className="text-green-700 space-y-1">
                                <div>Filled: {boardState.filledCells}/81 cells</div>
                                <div>Empty: {81 - boardState.filledCells} cells</div>
                                <div>Conflicts: {stats.conflicts}</div>
                                <div>Valid: {stats.conflicts === 0 ? '✅' : '❌'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t text-xs text-gray-500">
                    💡 Tip: Load sample puzzle to get started • Red highlighting shows conflicts • Complete all 81 cells to win!
                </div>
            </div>
        </div>
    );
};

export default Challenge5;
