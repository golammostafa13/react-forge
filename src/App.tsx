import { BrowserRouter } from "react-router-dom"
import Paths from "./components/Paths"
import AppRoutes from "./routes"

function App() {

  return (
    <BrowserRouter>
      <div className="w-screen h-screen bg-gray-100">
        <Paths />
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
