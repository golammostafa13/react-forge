import { useCallback, useEffect, useRef, useState } from 'react'

interface PillPiece {
    id: string
    x: number
    y: number
    width: number
    height: number
    color: string
    borderRadius: string
    zIndex: number
}

function getBorderRadius(corner: string, parrentRadius: string) {
    const radiuses = parrentRadius.split(' ');
    const topLeft = radiuses[0]
    const topRight = radiuses[1] || topLeft
    const bottomRight = radiuses[2] || topLeft
    const bottomLeft = radiuses[3] || topRight || topLeft

    console.log(corner, parrentRadius, 'parsed:', { topLeft, topRight, bottomRight, bottomLeft })

    switch (corner) {
        case 'top-left':
            return `${topLeft} 0 0 0`
        case 'top-right':
            return `0 ${topRight} 0 0`
        case 'bottom-right':
            return `0 0 ${bottomRight} 0`
        case 'bottom-left':
            return `0 0 0 ${bottomLeft}`
        case 'top':
            return `${topLeft} ${topRight} 0 0`
        case 'bottom':
            return `0 0 ${bottomRight} ${bottomLeft}`
        case 'left':
            return `${topLeft} 0 0 ${bottomLeft}`
        case 'right':
            return `0 ${topRight} ${bottomRight} 0`
        default:
            return parrentRadius
    }
}

function PillSpliter() {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
    const [pillPieces, setPillPieces] = useState<PillPiece[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [drawStart, setDrawStart] = useState({ x: 0, y: 0 })
    const [drawEnd, setDrawEnd] = useState({ x: 0, y: 0 })
    const [mouseDownStart, setMouseDownStart] = useState({ x: 0, y: 0, time: 0 })
    const [draggedPill, setDraggedPill] = useState<PillPiece | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isDraggingPill, setIsDraggingPill] = useState(false)
    const [dragStartTime, setDragStartTime] = useState(0)
    const [hasPillMoved, setHasPillMoved] = useState(false)
    const [maxZIndex, setMaxZIndex] = useState(10)
    const containerRef = useRef<HTMLDivElement>(null)

    const splitPillAtPosition = useCallback((piece: PillPiece, splitPosition: { x: number, y: number }) => {
        const newPieces: PillPiece[] = []

        const pillLeft = piece.x
        const pillRight = piece.x + piece.width
        const pillTop = piece.y
        const pillBottom = piece.y + piece.height

        const horizontalSplit = splitPosition.y >= pillTop && splitPosition.y <= pillBottom
        const verticalSplit = splitPosition.x >= pillLeft && splitPosition.x <= pillRight

        if (horizontalSplit && verticalSplit) {
            if (piece.width < 40 || piece.height < 40) {
                console.log('Piece too small for 4-way split:', piece.width, 'x', piece.height)
                return []
            }

            let splitX = splitPosition.x - piece.x
            let splitY = splitPosition.y - piece.y

            splitX = Math.max(20, Math.min(piece.width - 20, splitX))

            splitY = Math.max(20, Math.min(piece.height - 20, splitY))

            console.log('4-way split adjusted:', { originalX: splitPosition.x - piece.x, originalY: splitPosition.y - piece.y, adjustedX: splitX, adjustedY: splitY })
            console.log('Split dimensions:', { splitX, splitY, remainingX: piece.width - splitX, remainingY: piece.height - splitY })

            newPieces.push(
                {
                    ...piece,
                    id: `${piece.id}-top-left`,
                    width: splitX,
                    height: splitY,
                    color: piece.color,
                    borderRadius: getBorderRadius('top-left', piece.borderRadius)
                },
                {
                    ...piece,
                    id: `${piece.id}-top-right`,
                    x: piece.x + splitX,
                    width: piece.width - splitX,
                    height: splitY,
                    color: piece.color,
                    borderRadius: getBorderRadius('top-right', piece.borderRadius)
                },
                {
                    ...piece,
                    id: `${piece.id}-bottom-left`,
                    y: piece.y + splitY,
                    width: splitX,
                    height: piece.height - splitY,
                    color: piece.color,
                    borderRadius: getBorderRadius('bottom-left', piece.borderRadius)
                },
                {
                    ...piece,
                    id: `${piece.id}-bottom-right`,
                    x: piece.x + splitX,
                    y: piece.y + splitY,
                    width: piece.width - splitX,
                    height: piece.height - splitY,
                    color: piece.color,
                    borderRadius: getBorderRadius('bottom-right', piece.borderRadius)
                }
            )
        } else if (horizontalSplit) {
            if (piece.height < 40) {
                console.log('Piece too short for horizontal split:', piece.height)
                return []
            }

            let splitY = splitPosition.y - piece.y

            splitY = Math.max(20, Math.min(piece.height - 20, splitY))

            console.log('Horizontal split adjusted:', { originalY: splitPosition.y - piece.y, adjustedY: splitY, remainingY: piece.height - splitY })

            newPieces.push(
                {
                    ...piece,
                    id: `${piece.id}-top`,
                    height: splitY,
                    color: piece.color,
                    borderRadius: getBorderRadius('top', piece.borderRadius)
                },
                {
                    ...piece,
                    id: `${piece.id}-bottom`,
                    y: piece.y + splitY,
                    height: piece.height - splitY,
                    color: piece.color,
                    borderRadius: getBorderRadius('bottom', piece.borderRadius)
                }
            )
        } else if (verticalSplit) {
            if (piece.width < 40) {
                console.log('Piece too narrow for vertical split:', piece.width)
                return []
            }

            let splitX = splitPosition.x - piece.x

            splitX = Math.max(20, Math.min(piece.width - 20, splitX))

            console.log('Vertical split adjusted:', { originalX: splitPosition.x - piece.x, adjustedX: splitX, remainingX: piece.width - splitX })

            newPieces.push(
                {
                    ...piece,
                    id: `${piece.id}-left`,
                    width: splitX,
                    color: piece.color,
                    borderRadius: getBorderRadius('left', piece.borderRadius)
                },
                {
                    ...piece,
                    id: `${piece.id}-right`,
                    x: piece.x + splitX,
                    width: piece.width - splitX,
                    color: piece.color,
                    borderRadius: getBorderRadius('right', piece.borderRadius)
                }
            )
        } else {
            if (piece.height >= 40) {
                const halfHeight = piece.height / 2
                newPieces.push(
                    {
                        ...piece,
                        id: `${piece.id}-top`,
                        height: halfHeight,
                        color: piece.color,
                        borderRadius: getBorderRadius('top', piece.borderRadius)
                    },
                    {
                        ...piece,
                        id: `${piece.id}-bottom`,
                        y: piece.y + halfHeight,
                        height: halfHeight,
                        color: piece.color,
                        borderRadius: getBorderRadius('bottom', piece.borderRadius)
                    }
                )
            } else if (piece.width >= 40) {
                const halfWidth = piece.width / 2
                newPieces.push(
                    {
                        ...piece,
                        id: `${piece.id}-left`,
                        width: halfWidth,
                        color: piece.color,
                        borderRadius: getBorderRadius('left', piece.borderRadius)
                    },
                    {
                        ...piece,
                        id: `${piece.id}-right`,
                        x: piece.x + halfWidth,
                        width: halfWidth,
                        color: piece.color,
                        borderRadius: getBorderRadius('right', piece.borderRadius)
                    }
                )
            }
        }

        return newPieces
    }, [])

    const handleGlobalClick = useCallback((e: React.MouseEvent) => {
        if (isDrawing) return

        if (hasPillMoved) return

        const timeDiff = Date.now() - dragStartTime
        if (hasPillMoved && timeDiff < 700) return

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const clickY = e.clientY - rect.top

            console.log('Global click at:', { clickX, clickY })

            const allNewPieces: PillPiece[] = []
            const pillsToRemove: string[] = []

            pillPieces.forEach(piece => {
                const pillLeft = piece.x
                const pillRight = piece.x + piece.width
                const pillTop = piece.y
                const pillBottom = piece.y + piece.height

                const horizontalLineIntersects = clickY >= pillTop && clickY <= pillBottom
                const verticalLineIntersects = clickX >= pillLeft && clickX <= pillRight

                if (horizontalLineIntersects || verticalLineIntersects) {
                    console.log('Splitting pill:', piece.id, 'at position:', { clickX, clickY })
                    const newPieces = splitPillAtPosition(piece, { x: clickX, y: clickY })

                    if (newPieces.length > 0) {
                        allNewPieces.push(...newPieces)
                        pillsToRemove.push(piece.id)
                    }
                }
            })

            if (allNewPieces.length > 0) {
                console.log('Splitting', pillsToRemove.length, 'pills into', allNewPieces.length, 'pieces')
                setPillPieces(prev => {
                    const remaining = prev.filter(p => !pillsToRemove.includes(p.id))
                    return [...remaining, ...allNewPieces]
                })
            }
        }
    }, [isDrawing, dragStartTime, pillPieces, hasPillMoved, splitPillAtPosition])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                setCursorPosition({ x, y })

                if (mouseDownStart.time > 0 && !isDrawing && !isDraggingPill) {
                    const distance = Math.sqrt(
                        Math.pow(x - mouseDownStart.x, 2) + Math.pow(y - mouseDownStart.y, 2)
                    )
                    if (distance > 5) { // Start drawing if moved more than 5px
                        console.log('Starting to draw new pill at:', mouseDownStart.x, mouseDownStart.y)
                        setDrawStart({ x: mouseDownStart.x, y: mouseDownStart.y })
                        setDrawEnd({ x, y })
                        setIsDrawing(true)
                        setMouseDownStart({ x: 0, y: 0, time: 0 })
                    }
                }

                if (isDrawing) {
                    setDrawEnd({ x, y })
                }

                if (draggedPill) {
                    const newX = x - dragOffset.x
                    const newY = y - dragOffset.y

                    // Check if pill has actually moved
                    if (Math.abs(newX - draggedPill.x) > 2 || Math.abs(newY - draggedPill.y) > 2) {
                        setHasPillMoved(true)
                    }

                    setPillPieces(prev => prev.map(pill =>
                        pill.id === draggedPill.id
                            ? { ...pill, x: newX, y: newY }
                            : pill
                    ))

                    setDraggedPill(prev => prev ? { ...prev, x: newX, y: newY } : null)
                }
            }
        }

        const handleMouseDown = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const clickedElement = e.target as HTMLElement
                const pillElement = clickedElement.closest('.pill-piece')

                if (!pillElement) {
                    setMouseDownStart({ x, y, time: Date.now() })
                }
            }
        }

        const handleMouseUp = (e: MouseEvent) => {
            if (isDraggingPill) {
                setIsDraggingPill(false)

                // Check if dragged pill overlaps with any other pill
                if (hasPillMoved && draggedPill) {
                    const draggedRect = {
                        left: draggedPill.x,
                        right: draggedPill.x + draggedPill.width,
                        top: draggedPill.y,
                        bottom: draggedPill.y + draggedPill.height
                    }

                    let hasOverlap = false
                    pillPieces.forEach(piece => {
                        if (piece.id !== draggedPill.id) {
                            const pieceRect = {
                                left: piece.x,
                                right: piece.x + piece.width,
                                top: piece.y,
                                bottom: piece.y + piece.height
                            }

                            const overlapping = !(draggedRect.right <= pieceRect.left ||
                                draggedRect.left >= pieceRect.right ||
                                draggedRect.bottom <= pieceRect.top ||
                                draggedRect.top >= pieceRect.bottom)

                            if (overlapping) {
                                hasOverlap = true
                            }
                        }
                    })

                    if (hasOverlap) {
                        const newZIndex = maxZIndex + 1
                        setMaxZIndex(newZIndex)
                        setPillPieces(prev => prev.map(pill =>
                            pill.id === draggedPill.id
                                ? { ...pill, zIndex: newZIndex }
                                : pill
                        ))
                    }
                }

                setDraggedPill(null)

                if (hasPillMoved) {
                    setTimeout(() => {
                        setDragStartTime(0)
                        setHasPillMoved(false)
                    }, 300)
                } else {
                    setDragStartTime(0)
                    setHasPillMoved(false)
                }
                return
            }

            setDraggedPill(null)

            if (mouseDownStart.time > 0 && !isDrawing && !isDraggingPill) {
                const timeDiff = Date.now() - mouseDownStart.time
                if (timeDiff < 500) {
                    console.log('Single click detected at:', mouseDownStart.x, mouseDownStart.y)
                    if (containerRef.current) {
                        const clickEvent = {
                            clientX: mouseDownStart.x + containerRef.current.getBoundingClientRect().left,
                            clientY: mouseDownStart.y + containerRef.current.getBoundingClientRect().top
                        } as React.MouseEvent
                        handleGlobalClick(clickEvent)
                    }
                }
                setMouseDownStart({ x: 0, y: 0, time: 0 })
                return
            }



            if (isDrawing) {
                let finalX = drawEnd.x
                let finalY = drawEnd.y

                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top

                    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                        finalX = x
                        finalY = y
                    }
                }

                const width = Math.abs(finalX - drawStart.x)
                const height = Math.abs(finalY - drawStart.y)

                if (width >= 40 && height >= 40) {
                    const colors = ['#DBEAFE', '#FED7D7', '#D1FAE5', '#FEF3C7', '#E7D3FF', '#FCE7F3', '#CFFAFE', '#ECFCCB', '#FEE2E2', '#FEF3C7', '#E0F2FE', '#F0FDF4', '#FFFBEB', '#FEF7FF', '#FAF5FF', '#F0F9FF', '#FDF4FF', '#F7FEE7']
                    const randomColor = colors[Math.floor(Math.random() * colors.length)]

                    const newPill: PillPiece = {
                        id: `pill-${Date.now()}-${Math.random()}`,
                        x: Math.min(finalX, drawStart.x),
                        y: Math.min(finalY, drawStart.y),
                        width: width,
                        height: height,
                        color: randomColor,
                        borderRadius: '20px 20px 20px 20px',
                        zIndex: 10
                    }

                    console.log('Storing new drawn pill:', newPill)
                    setPillPieces(prev => {
                        const updatedPieces = [...prev, newPill]
                        console.log('Updated pill pieces array:', updatedPieces)
                        return updatedPieces
                    })
                }
                setIsDrawing(false)
                setMouseDownStart({ x: 0, y: 0, time: 0 })
            }
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDrawing, drawStart, drawEnd, draggedPill, dragOffset, pillPieces, isDraggingPill, dragStartTime, mouseDownStart, hasPillMoved, maxZIndex, handleGlobalClick])

    return (
        <div className="min-h-screen min-w-screen bg-white">
            <div
                ref={containerRef}
                onClick={handleGlobalClick}
            >
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-500 pointer-events-none z-30 transition-opacity duration-200"
                    style={{
                        left: cursorPosition.x,
                        opacity: 0.6
                    }}
                />

                <div
                    className="absolute left-0 right-0 h-0.5 bg-gray-500 pointer-events-none z-30 transition-opacity duration-200"
                    style={{
                        top: cursorPosition.y,
                        opacity: 0.6
                    }}
                />

                {isDrawing && (
                    <div
                        className="absolute border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none z-20"
                        style={{
                            left: Math.min(drawStart.x, drawEnd.x),
                            top: Math.min(drawStart.y, drawEnd.y),
                            width: Math.abs(drawEnd.x - drawStart.x),
                            height: Math.abs(drawEnd.y - drawStart.y),
                            borderRadius: '20px',
                            borderStyle: 'dashed',
                            borderWidth: '2px'
                        }}
                    />
                )}


                {pillPieces.map((piece) => (
                    <div
                        key={piece.id}
                        data-pill-id={piece.id}
                        className="absolute cursor-pointer transition-all duration-200 pill-piece"
                        style={{
                            left: piece.x,
                            top: piece.y,
                            width: piece.width,
                            height: piece.height,
                            backgroundColor: piece.color,
                            borderRadius: piece.borderRadius || '20px',
                            border: '1px solid rgba(5, 5, 5, 0.1)',
                            zIndex: draggedPill?.id === piece.id ? 1000 : piece.zIndex
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault()

                            if (containerRef.current) {
                                const rect = containerRef.current.getBoundingClientRect()
                                const x = e.clientX - rect.left
                                const y = e.clientY - rect.top

                                setDraggedPill(piece)
                                setDragOffset({ x: x - piece.x, y: y - piece.y })
                                setIsDraggingPill(true)
                                setDragStartTime(Date.now())
                                setHasPillMoved(false)
                            }
                        }}


                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-white font-bold text-sm">
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PillSpliter
