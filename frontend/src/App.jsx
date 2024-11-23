import Signup from "./Components/Signup"
import Login from "./Components/Login"
import CreateCourse from "./Components/CreateCourse"
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import { Route, Routes, Navigate } from "react-router-dom";
import CoursePage from "./pages/CoursePage";
import Navbar from "./Components/Navbar";

function App() {
  const [user,setUser] = useState(null);

  const getUser = async()=>{
    const response = await fetch("http://localhost:5000/api/v1/auth/authCheck",{
      credentials:"include"
    })
    const data = await response.json();
    console.log(data);
    setUser(data.user);
  }

  useEffect(()=>{
    getUser();
  },[])

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/"/> : <LoginPage/>}/>
      <Route path="/signup" element={user ? <Navigate to="/"/> : <Signup/>}/>

      <Route path="/" element={user ? <CoursePage user={user}/> : <Navigate to="/login"/>}/>
    </Routes>

    </>
  )
}

export default App
