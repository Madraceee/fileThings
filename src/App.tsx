import './App.css'
import Workspace from './pages/workspace/Main'
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <div>
      <Workspace />
      <Toaster />
    </div>
  )
}

export default App
