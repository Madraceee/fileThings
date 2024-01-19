import { useSelector } from 'react-redux';
import './App.css'
import { CreateUser } from './pages/auth/CreateUser';
import { Login } from './pages/auth/Login';
import Workspace from './pages/workspace/Main'
import { Toaster } from "@/components/ui/toaster"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { RootState } from './redux/store';
import Home from './pages/home/Home';

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/workspace" element={
            isLoggedIn ? (<Workspace />) : (<Navigate replace to={"/"} />)
          } />
        </Routes>
      </Router>
      <Toaster />
    </div>

  )
}

export default App
