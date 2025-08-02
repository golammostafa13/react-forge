import { Link, useNavigate } from 'react-router-dom'

const Paths = () => {
    const navigate = useNavigate()
    const paths = [
        {
            name: 'Drag & Drop Reordering',
            path: '/challenge1'
        },
        {
            name: 'Nested Comment System',
            path: '/challenge2'
        },
        {
            name: 'File Explorer UI',
            path: '/challenge3'
        },
        {
            name: 'Dynamic Form Builder',
            path: '/challenge4'
        },
        {
            name: 'Sudoku or Puzzle Board',
            path: '/challenge5'
        }
    ]
    return (
        <div className='w-full h-16 text-black flex items-center justify-center gap-4 bg-gray-50'>
            {paths.map((path, index) => (
                <Link to={path.path} key={index} className={`text-black hover:text-gray-700 ${path.path === window.location.pathname ? 'text-blue-500 border-b-2 border-blue-500' : ''}`} onClick={() => navigate(path.path)}>{path.name}</Link>
            ))}
        </div>
    )
}

export default Paths
