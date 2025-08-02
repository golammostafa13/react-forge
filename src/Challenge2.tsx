
import { useReducer, useState } from "react";

interface Comment {
    id: number;
    author: string;
    avatar: string;
    content: string;
    timestamp: Date;
    votes: number;
    replies: Comment[];
    isCollapsed?: boolean;
}

// Action types for the reducer
type CommentAction =
    | { type: 'ADD_COMMENT'; payload: { content: string } }
    | { type: 'ADD_REPLY'; payload: { parentId: number; content: string } }
    | { type: 'UPDATE_VOTE'; payload: { commentId: number; delta: number } }
    | { type: 'TOGGLE_COLLAPSE'; payload: { commentId: number } };

// Reducer function to manage comment state
const commentsReducer = (state: Comment[], action: CommentAction): Comment[] => {
    switch (action.type) {
        case 'ADD_COMMENT': {
            const newComment: Comment = {
                id: Date.now(),
                author: "You",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
                content: action.payload.content,
                timestamp: new Date(),
                votes: 0,
                replies: []
            };
            return [...state, newComment];
        }

        case 'ADD_REPLY': {
            const { parentId, content } = action.payload;
            const newReply: Comment = {
                id: Date.now() + Math.random(),
                author: "You",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
                content,
                timestamp: new Date(),
                votes: 0,
                replies: []
            };

            const updateComment = (comments: Comment[]): Comment[] => {
                return comments.map((comment: Comment) => {
                    if (comment.id === parentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies, newReply]
                        }
                    }
                    return {
                        ...comment,
                        replies: updateComment(comment.replies)
                    }
                })
            }

            return updateComment(state);
        }

        case 'UPDATE_VOTE': {
            const { commentId, delta } = action.payload;

            const updateComment = (comments: Comment[]): Comment[] => {
                return comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            votes: comment.votes + delta
                        };
                    }
                    return {
                        ...comment,
                        replies: updateComment(comment.replies)
                    };
                });
            };

            return updateComment(state);
        }

        case 'TOGGLE_COLLAPSE': {
            const { commentId } = action.payload;

            const updateComment = (comments: Comment[]): Comment[] => {
                return comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            isCollapsed: !comment.isCollapsed
                        };
                    }
                    return {
                        ...comment,
                        replies: updateComment(comment.replies)
                    };
                });
            };

            return updateComment(state);
        }

        default:
            return state;
    }
};

interface CommentFormProps {
    onSubmit: (content: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    isReply?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
    onSubmit,
    onCancel,
    placeholder = "Write a comment...",
    isReply = false
}) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`${isReply ? 'ml-12 mt-2' : 'mb-6'}`}>
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                    You
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isReply ? 'Reply' : 'Comment'}
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

interface CommentItemProps {
    comment: Comment;
    depth: number;
    onReply: (commentId: number, content: string) => void;
    dispatch: React.Dispatch<CommentAction>;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    depth,
    onReply,
    dispatch
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [userVote, setUserVote] = useState<number>(0); // -1, 0, 1

    const handleVote = (delta: number) => {
        const newVote = userVote === delta ? 0 : delta;
        dispatch({ type: 'UPDATE_VOTE', payload: { commentId: comment.id, delta: newVote - userVote } });
        setUserVote(newVote);
    };

    const handleToggleCollapse = () => {
        dispatch({ type: 'TOGGLE_COLLAPSE', payload: { commentId: comment.id } });
        // Close reply form when collapsing
        if (!comment.isCollapsed) {
            setShowReplyForm(false);
        }
    };

    const handleReply = (content: string) => {
        onReply(comment.id, content);
        setShowReplyForm(false);
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
            <div className="flex gap-3">
                <div className="flex flex-col items-center">
                    <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-8 h-8 rounded-full"
                    />
                    {comment.replies.length > 0 && !comment.isCollapsed && (
                        <div className="w-0.5 bg-gray-200 flex-1 mt-2"></div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={handleToggleCollapse}
                                className="text-gray-500 hover:text-gray-700 text-xs mr-1 font-mono"
                                title={comment.isCollapsed ? "Expand comment" : "Collapse comment"}
                            >
                                {comment.isCollapsed ? "[+]" : "[-]"}
                            </button>
                            <span className="font-semibold text-gray-800">{comment.author}</span>
                            <span className="text-gray-500 text-sm">{formatTime(comment.timestamp)}</span>
                            {comment.isCollapsed && (
                                <span className="text-gray-400 text-sm ml-2">
                                    {comment.votes !== 0 && (
                                        <span className={`${comment.votes > 0 ? 'text-green-600' : 'text-red-600'} mr-2`}>
                                            {comment.votes > 0 ? '+' : ''}{comment.votes}
                                        </span>
                                    )}
                                    {comment.replies.length > 0 && `(${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'})`}
                                </span>
                            )}
                        </div>

                        {!comment.isCollapsed && (
                            <>
                                <p className="text-gray-800 mb-3">{comment.content}</p>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleVote(1)}
                                            className={`p-1 rounded hover:bg-gray-200 ${userVote === 1 ? 'text-green-600' : 'text-gray-500'
                                                }`}
                                        >
                                            ▲
                                        </button>
                                        <span className={`min-w-[2rem] text-center ${comment.votes > 0 ? 'text-green-600' :
                                            comment.votes < 0 ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {comment.votes}
                                        </span>
                                        <button
                                            onClick={() => handleVote(-1)}
                                            className={`p-1 rounded hover:bg-gray-200 ${userVote === -1 ? 'text-red-600' : 'text-gray-500'
                                                }`}
                                        >
                                            ▼
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setShowReplyForm(!showReplyForm)}
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        Reply
                                    </button>

                                    {comment.replies.length > 0 && (
                                        <span className="text-gray-500 text-sm">
                                            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {showReplyForm && !comment.isCollapsed && (
                        <CommentForm
                            onSubmit={handleReply}
                            onCancel={() => setShowReplyForm(false)}
                            placeholder={`Reply to ${comment.author}...`}
                            isReply={true}
                        />
                    )}

                    {comment.replies.length > 0 && !comment.isCollapsed && (
                        <div className="mt-4">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    depth={depth + 1}
                                    onReply={onReply}
                                    dispatch={dispatch}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Initial comment data
const initialComments: Comment[] = [
    {
        id: 1,
        author: "Alice Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        content: "This is such a well-designed comment system! I love how clean and intuitive the threading is.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        votes: 12,
        replies: [
            {
                id: 2,
                author: "Bob Smith",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
                content: "I totally agree! The nested structure makes conversations so much easier to follow.",
                timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
                votes: 7,
                replies: [
                    {
                        id: 3,
                        author: "Carol Davis",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
                        content: "Yes! And the voting system helps surface the best responses.",
                        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                        votes: 4,
                        replies: []
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        author: "David Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        content: "The collapse/expand feature is brilliant for managing long discussion threads. Great UX thinking!",
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        votes: 8,
        replies: []
    }
];

const Challenge2 = () => {
    const [comments, dispatch] = useReducer(commentsReducer, initialComments);

    // Action creators - functions that dispatch actions
    const addComment = (content: string) => {
        dispatch({ type: 'ADD_COMMENT', payload: { content } });
    };

    const addReply = (parentId: number, content: string) => {
        dispatch({ type: 'ADD_REPLY', payload: { parentId, content } });
    };



    const totalComments = (comments: Comment[]): number => {
        return comments.reduce((total, comment) => {
            return total + 1 + totalComments(comment.replies);
        }, 0);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Discussion Thread</h2>
                    <p className="text-gray-600 mb-4">
                        Join the conversation! Comments are threaded for easy discussion flow.
                        Click [-] to collapse any comment or [+] to expand it.
                    </p>
                    <div className="text-sm text-gray-500">
                        {totalComments(comments)} comments
                    </div>
                </div>

                <CommentForm onSubmit={addComment} />

                <div className="space-y-0">
                    {comments.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-4xl mb-4">💬</div>
                            <p>No comments yet. Be the first to start the discussion!</p>
                        </div>
                    ) : (
                        comments.map((comment: Comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                depth={0}
                                onReply={addReply}
                                dispatch={dispatch}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Challenge2;
