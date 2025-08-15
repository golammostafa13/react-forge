
import { Link } from "react-router-dom";

interface Challenge {
    id: number;
    title: string;
    description: string;
    icon: string;
    path: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    features: string[];
    color: string;
}

const challenges: Challenge[] = [
    {
        id: 1,
        title: "Drag & Drop Todo Manager",
        description: "Build an interactive todo manager with drag and drop functionality. Learn modern React patterns while creating a practical productivity app.",
        icon: "📋",
        path: "/challenge1",
        difficulty: "Beginner",
        features: ["Drag & Drop API", "Todo Management", "List Reordering", "Visual Feedback"],
        color: "from-emerald-500 to-teal-500"
    },
    {
        id: 2,
        title: "Comment System",
        description: "A nested comment system with replies, likes, and real-time interactions. Learn component composition and complex state.",
        icon: "💬",
        path: "/challenge2",
        difficulty: "Intermediate",
        features: ["Nested Components", "Complex State", "User Interactions"],
        color: "from-green-500 to-emerald-500"
    },
    {
        id: 3,
        title: "File Explorer",
        description: "Interactive file tree with folder expansion, file editing, and real-time content management. Advanced component patterns.",
        icon: "📁",
        path: "/challenge3",
        difficulty: "Advanced",
        features: ["Tree Structure", "File Editing", "Modal Management"],
        color: "from-purple-500 to-violet-500"
    },
    {
        id: 4,
        title: "Dynamic Form Builder",
        description: "Build forms dynamically with various field types and see real-time JSON output. Master form handling and validation.",
        icon: "📝",
        path: "/challenge4",
        difficulty: "Intermediate",
        features: ["Dynamic Forms", "JSON Output", "Field Validation"],
        color: "from-orange-500 to-red-500"
    },
    {
        id: 5,
        title: "Sudoku Puzzle",
        description: "Interactive 9x9 Sudoku board with real-time validation and conflict detection. Complex game logic implementation.",
        icon: "🧩",
        path: "/challenge5",
        difficulty: "Advanced",
        features: ["Game Logic", "Validation", "Grid Management"],
        color: "from-pink-500 to-rose-500"
    }, {
        id: 6,
        title: "Pill Splitter",
        description: "Create an interactive pill splitting interface with precise measurements, visual feedback, and practical medication management features.",
        icon: "💊",
        path: "/challenge6",
        difficulty: "Intermediate",
        features: ["Interactive UI", "Precision Controls", "Visual Feedback", "Practical Application"],
        color: "from-emerald-500 to-teal-500"
    }, {
        id: 7,
        title: "Window Slider",
        description: "Create a window slider with smooth transitions, real-time resizing, and interactive controls. Master component composition and state management.",
        icon: "🪟",
        path: "/challenge7",
        difficulty: "Advanced",
        features: ["Component Composition", "State Management", "Real-time Updates"],
        color: "from-purple-500 to-violet-500"
    }, {
        id: 8,
        title: "Shuffle Board",
        description: "Create a shuffle board with interactive tiles, real-time shuffling, and practical game logic. Master complex state management and game development.",
        icon: "🎲",
        path: "/challenge8",
        difficulty: "Expert",
        features: ["Complex State", "Game Logic", "Real-time Updates"],
        color: "from-red-500 to-pink-500"
    }
];

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Beginner': return 'bg-green-100 text-green-800';
        case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
        case 'Advanced': return 'bg-red-100 text-red-800';
        case 'Expert': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                            React Challenges
                        </h1>
                        <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
                            Master React development through hands-on challenges. Build interactive components,
                            manage complex state, and create real-world applications.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/challenge1"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Start Your Journey 🚀
                            </Link>
                            <button
                                onClick={() => document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
                            >
                                View Challenges
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">8</div>
                        <div className="text-gray-600">Interactive Challenges</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-4xl font-bold text-purple-600 mb-2">25+</div>
                        <div className="text-gray-600">React Concepts Covered</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-4xl font-bold text-pink-600 mb-2">∞</div>
                        <div className="text-gray-600">Learning Possibilities</div>
                    </div>
                </div>
            </div>

            {/* Challenges Section */}
            <div id="challenges" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Challenge</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Each challenge is designed to teach specific React concepts while building something practical and fun.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {challenges.map((challenge) => (
                        challenge.id >= 6 ? (
                            <a
                                key={challenge.id}
                                href={challenge.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block cursor-pointer"
                            >
                                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                    {/* Header */}
                                    <div className={`bg-gradient-to-r ${challenge.color} p-6`}>
                                        <div className="flex items-center justify-between">
                                            <div className="text-4xl">{challenge.icon}</div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                                                {challenge.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mt-4 mb-2">
                                            {challenge.title}
                                        </h3>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {challenge.description}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-2 mb-6">
                                            <div className="text-sm font-semibold text-gray-700 mb-2">What you'll learn:</div>
                                            {challenge.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600">
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Call to Action */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-gray-800">
                                                Challenge {challenge.id}
                                            </span>
                                            <div className="flex items-center text-indigo-600 group-hover:text-indigo-800 transition-colors">
                                                <span className="mr-2 font-medium">Start Challenge</span>
                                                <span className="mr-1 text-xs">↗</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ) : (
                            <Link
                                key={challenge.id}
                                to={challenge.path}
                                className="group block"
                            >
                                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                    {/* Header */}
                                    <div className={`bg-gradient-to-r ${challenge.color} p-6`}>
                                        <div className="flex items-center justify-between">
                                            <div className="text-4xl">{challenge.icon}</div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                                                {challenge.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mt-4 mb-2">
                                            {challenge.title}
                                        </h3>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {challenge.description}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-2 mb-6">
                                            <div className="text-sm font-semibold text-gray-700 mb-2">What you'll learn:</div>
                                            {challenge.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-sm text-gray-600">
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Call to Action */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-gray-800">
                                                Challenge {challenge.id}
                                            </span>
                                            <div className="flex items-center text-indigo-600 group-hover:text-indigo-800 transition-colors">
                                                <span className="mr-2 font-medium">Start Challenge</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why These Challenges?</h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Learn by doing with practical, real-world examples that you can use in your own projects.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold mb-2">Focused Learning</h3>
                            <p className="text-gray-300">Each challenge targets specific React concepts and patterns.</p>
                        </div>

                        <div className="text-center">
                            <div className="text-4xl mb-4">🔧</div>
                            <h3 className="text-xl font-semibold mb-2">Practical Examples</h3>
                            <p className="text-gray-300">Build real components you can use in production applications.</p>
                        </div>

                        <div className="text-center">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-semibold mb-2">Progressive Difficulty</h3>
                            <p className="text-gray-300">Start simple and work your way up to complex patterns.</p>
                        </div>

                        <div className="text-center">
                            <div className="text-4xl mb-4">✨</div>
                            <h3 className="text-xl font-semibold mb-2">Modern React</h3>
                            <p className="text-gray-300">Learn hooks, context, and latest React patterns.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Level Up Your React Skills?</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Start with any challenge that interests you. There's no specific order - jump in wherever you feel comfortable!
                    </p>
                    <Link
                        to="/challenge1"
                        className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <span className="mr-2">Begin Challenge 1</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
