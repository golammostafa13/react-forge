import { useState } from "react";

type Rectangle = {
    id: number;
    height: number;
    width: number;
    color: { color: string; border: string };
    number: number;
    column: number;
    order: number;
};

function ShuffleBoard() {
    const generateInitialRectangles = (): Rectangle[] => {
        const lightColors = [
            { color: "#fef2f2", border: "#f8d7da" },
            { color: "#f0f9ff", border: "#d4d4f4" },
            { color: "#f0fdf4", border: "#d1f2d9" },
            { color: "#fefce8", border: "#f7e6a3" },
            { color: "#faf5ff", border: "#e8d5f3" },
            { color: "#fff7ed", border: "#f5deb3" },
            { color: "#f0fdfa", border: "#c7f2e8" },
            { color: "#fdf4ff", border: "#f0d9f7" },
        ];

        const rectangles = [];

        for (let i = 0; i < 4; i++) {
            const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];
            rectangles.push({
                id: i + 1,
                number: i + 1,
                height: Math.floor(Math.random() * 120) + 40,
                width: 250,
                color: randomColor,
                column: 1,
                order: i
            });
        }

        for (let i = 0; i < 4; i++) {
            const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];
            rectangles.push({
                id: i + 5,
                number: i + 5,
                height: Math.floor(Math.random() * 120) + 20,
                width: 250,
                color: randomColor,
                column: 2,
                order: i
            });
        }

        return rectangles;
    };

    const [rectangles, setRectangles] = useState<Rectangle[]>(generateInitialRectangles());
    const [draggedRectangle, setDraggedRectangle] = useState<Rectangle | null>(null);
    const [dragOverPosition, setDragOverPosition] = useState<{ column: number, position: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const getColumnRectangles = (columnNumber: number): Rectangle[] => {
        return rectangles
            .filter(rect => rect.column === columnNumber)
            .sort((a, b) => a.order - b.order);
    };

    const column1Rectangles = getColumnRectangles(1);
    const column2Rectangles = getColumnRectangles(2);

    const handleMouseMove = (e: React.MouseEvent) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, rectangle: Rectangle) => {
        setDraggedRectangle(rectangle);
        setIsDragging(true);
        setCursorPosition({ x: e.clientX, y: e.clientY });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');

        document.body.style.cursor = 'none';
    };

    const handleDragEnd = () => {
        setDraggedRectangle(null);
        setDragOverPosition(null);
        setIsDragging(false);

        document.body.style.cursor = 'auto';
    };

    const handleColumnDragOver = (e: React.DragEvent<HTMLDivElement>, column: number) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';

        if (isDragging) {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        }

        if (!draggedRectangle) return;

        if (draggedRectangle.column === column) {
            if (dragOverPosition !== null) {
                setDragOverPosition(null);
            }
            return;
        }

        const columnElement = e.currentTarget;
        const rect = columnElement.getBoundingClientRect();
        const y = e.clientY - rect.top;

        let targetPosition = 0;

        const rectangleElements = columnElement.querySelectorAll('[data-rectangle-id]');

        for (let i = 0; i < rectangleElements.length; i++) {
            const rectElement = rectangleElements[i];
            const rectBounds = rectElement.getBoundingClientRect();
            const rectY = rectBounds.top - rect.top;
            const rectHeight = rectBounds.height;
            const rectCenter = rectY + (rectHeight / 2);

            if (y < rectCenter) {
                targetPosition = i;
                break;
            } else {
                targetPosition = i + 1;
            }
        }

        if (dragOverPosition?.column !== column || dragOverPosition?.position !== targetPosition) {
            setDragOverPosition({ column, position: targetPosition });
        }
    };

    const handleColumnDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setDragOverPosition(null);
        }
    };

    const handleDropZoneOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';

        if (isDragging) {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleDropAtPosition = (e: React.DragEvent<HTMLDivElement>, targetColumn: number, position: number) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(false);
        setDragOverPosition(null);
        document.body.style.cursor = 'auto';

        if (!draggedRectangle) {
            setDraggedRectangle(null);
            return;
        }

        if (draggedRectangle.column === targetColumn) {
            setDraggedRectangle(null);
            return;
        }

        const sourceColumn = draggedRectangle.column;

        if (sourceColumn === targetColumn) {
            const columnRects = getColumnRectangles(targetColumn);
            const currentIndex = columnRects.findIndex(r => r.id === draggedRectangle.id);

            if (currentIndex === position || currentIndex === position - 1) {
                setDraggedRectangle(null);
                setDragOverPosition(null);
                return;
            }

            setRectangles(prevRectangles => {
                const newRectangles = [...prevRectangles];
                const insertPosition = currentIndex < position ? position - 1 : position;

                newRectangles.forEach(rect => {
                    if (rect.column === targetColumn) {
                        if (rect.id === draggedRectangle.id) {
                            rect.order = insertPosition;
                        } else if (currentIndex < insertPosition) {
                            if (rect.order > currentIndex && rect.order <= insertPosition) {
                                rect.order--;
                            }
                        } else {
                            if (rect.order >= insertPosition && rect.order < currentIndex) {
                                rect.order++;
                            }
                        }
                    }
                });

                return newRectangles;
            });
        } else {
            setRectangles(prevRectangles => {
                const newRectangles = [...prevRectangles];

                const draggedRect = newRectangles.find(r => r.id === draggedRectangle.id);
                if (draggedRect) {
                    draggedRect.column = targetColumn;
                    draggedRect.order = position;
                }

                newRectangles.forEach(rect => {
                    if (rect.id !== draggedRectangle.id) {
                        if (rect.column === sourceColumn && rect.order > draggedRectangle.order) {
                            rect.order--;
                        }

                        if (rect.column === targetColumn && rect.order >= position) {
                            rect.order++;
                        }
                    }
                });

                return newRectangles;
            });
        }

        setDraggedRectangle(null);
    };

    const renderColumn = (rectangles: Rectangle[], columnNumber: number) => {
        const items = [];

        const isActiveDropZone = dragOverPosition?.column === columnNumber && dragOverPosition?.position === 0;

        items.push(
            <div
                key={`dropzone-${columnNumber}-0`}
                className={`w-full transition-all ${isActiveDropZone ? 'rounded-md flex justify-center items-center shadow-xl opacity-50 bg-blue-400' : 'shandow-none opacity-0'}`}
                style={isActiveDropZone && draggedRectangle ? {
                    height: `${draggedRectangle.height}px`,
                    width: `${draggedRectangle.width}px`,
                    borderColor: draggedRectangle.color.border
                } : {
                    height: '3px'
                }}
                onDragOver={handleDropZoneOver}
                onDrop={(e) => handleDropAtPosition(e, columnNumber, 0)}
            />
        );

        rectangles.forEach((rectangle, index) => {
            items.push(
                <div
                    key={rectangle.id}
                    data-rectangle-id={rectangle.id}
                    className="rounded-md flex justify-center items-center cursor-move"
                    style={{
                        height: `${rectangle.height}px`,
                        width: `${rectangle.width}px`,
                        backgroundColor: rectangle.color.color,
                        border: `2px solid ${rectangle.color.border}`,
                        opacity: draggedRectangle?.id === rectangle.id ? 0.001 : 1,
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, rectangle)}
                    onDragEnd={handleDragEnd}
                >{rectangle.number}</div>
            );

            const isActiveDropZoneAfter = dragOverPosition?.column === columnNumber && dragOverPosition?.position === index + 1;
            const dropZoneHeightAfter = isActiveDropZoneAfter && draggedRectangle ? draggedRectangle.height : 3;

            items.push(
                <div
                    key={`dropzone-${columnNumber}-${index + 1}`}
                    className={`w-full transition-all ${isActiveDropZoneAfter && 'rounded-md flex justify-center items-center shadow-xl opacity-50 bg-blue-400'}`}
                    style={isActiveDropZoneAfter && draggedRectangle ? {
                        height: `${draggedRectangle.height}px`,
                        width: `${draggedRectangle.width}px`,
                        borderColor: draggedRectangle.color.border
                    } : {
                        height: `${dropZoneHeightAfter}px`
                    }}
                    onDragOver={handleDropZoneOver}
                    onDrop={(e) => handleDropAtPosition(e, columnNumber, index + 1)}
                >
                </div>
            );
        });

        return items;
    };
    return (
        <div
            className="min-h-screen flex justify-center items-center bg-gray-200 overflow-hidden"
            onMouseMove={handleMouseMove}
            onDragOver={(e) => {
                if (isDragging) {
                    setCursorPosition({ x: e.clientX, y: e.clientY });
                }
            }}
        >
            {isDragging && (
                <div className="luminous-trail pointer-events-none h-[320px] w-[320px] rounded-full"
                    style={{
                        left: cursorPosition.x,
                        top: cursorPosition.y,
                        transform: "translate(-50%, -50%)",
                    }}
                ></div>
            )}

            {isDragging && (
                <div className="fixed inset-0 bg-black/65 z-[500] pointer-events-none">
                </div>
            )}

            <div className="flex gap-8 relative z-20">
                <div
                    className="w-[305px] h-[800px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 overflow-y-auto"
                    onDragOver={(e) => handleColumnDragOver(e, 1)}
                    onDragLeave={handleColumnDragLeave}
                    onDrop={(e) => {
                        const position = dragOverPosition?.position ?? getColumnRectangles(1).length;
                        handleDropAtPosition(e, 1, position);
                    }}
                >
                    <div className="flex flex-col gap-4">{renderColumn(column1Rectangles, 1)}</div>
                </div>
                <div
                    className="w-[305px] h-[800px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 overflow-y-auto"
                    onDragOver={(e) => handleColumnDragOver(e, 2)}
                    onDragLeave={handleColumnDragLeave}
                    onDrop={(e) => {
                        const position = dragOverPosition?.position ?? getColumnRectangles(2).length;
                        handleDropAtPosition(e, 2, position);
                    }}
                >
                    <div className="flex flex-col gap-4">{renderColumn(column2Rectangles, 2)}</div>
                </div>
            </div>
        </div>
    )
}

export default ShuffleBoard