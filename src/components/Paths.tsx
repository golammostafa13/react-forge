import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Paths = () => {
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const paths = [
        {
            name: 'Home',
            shortName: 'Home',
            icon: '🏠',
            path: '/'
        },
        {
            name: 'Drag & Drop Reordering',
            shortName: 'Todo Manager',
            icon: '📋',
            path: '/challenge1'
        },
        {
            name: 'Nested Comment System',
            shortName: 'Comments',
            icon: '💬',
            path: '/challenge2'
        },
        {
            name: 'File Explorer UI',
            shortName: 'File Explorer',
            icon: '📁',
            path: '/challenge3'
        },
        {
            name: 'Dynamic Form Builder',
            shortName: 'Form Builder',
            icon: '📝',
            path: '/challenge4'
        },
        {
            name: 'Sudoku or Puzzle Board',
            shortName: 'Sudoku',
            icon: '🧩',
            path: '/challenge5'
        }
    ]

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleNavigation = (path: string) => {
        navigate(path)
        setIsMobileMenuOpen(false) // Close mobile menu after navigation
    }

    const isActivePath = (path: string) => {
        return path === window.location.pathname
    }

    return (
        <nav className='w-full bg-gray-50 border-b border-gray-200'>
            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center justify-start h-16 px-6 lg:px-10'>
                <div className='flex items-center space-x-6 lg:space-x-8'>
                    {paths.map((path, index) => (
                        <Link
                            to={path.path}
                            key={index}
                            className={`
                                relative px-3 py-2 text-sm lg:text-base font-medium transition-colors duration-200
                                ${isActivePath(path.path)
                                    ? 'text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600'
                                }
                            `}
                            onClick={() => navigate(path.path)}
                        >
                            <span className='mr-2'>{path.icon}</span>
                            {path.name}
                            {isActivePath(path.path) && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600'></div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className='md:hidden relative'>
                {/* Mobile Header */}
                <div className='flex items-center justify-between h-16 px-4 bg-gray-50'>
                    <div className='flex items-center'>
                        <Link to="/" className='text-lg font-semibold text-gray-800 hover:text-blue-600'>
                            React Challenges
                        </Link>
                    </div>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className='p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50 relative'
                        aria-label='Toggle navigation menu'
                    >
                        <svg
                            className={`h-6 w-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            ) : (
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className='absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50'>
                        <div className='px-4 py-2 space-y-1 max-h-80 overflow-y-auto'>
                            {paths.map((path, index) => (
                                <Link
                                    to={path.path}
                                    key={index}
                                    className={`
                                        flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200
                                        ${isActivePath(path.path)
                                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                        }
                                    `}
                                    onClick={() => handleNavigation(path.path)}
                                >
                                    <span className='text-xl mr-3'>{path.icon}</span>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{path.shortName}</span>
                                        <span className='text-xs text-gray-500 mt-0.5'>{path.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile backdrop overlay - only shows behind the dropdown */}
            {isMobileMenuOpen && (
                <div
                    className='fixed inset-0 bg-transparent z-40 md:hidden'
                    onClick={toggleMobileMenu}
                    style={{ top: '64px' }} // Start below the navigation bar
                ></div>
            )}
        </nav>
    )
}

export default Paths
