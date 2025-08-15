import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes"

function App() {

  return (
    <BrowserRouter>
      <div className="w-screen h-screen bg-gray-100">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
