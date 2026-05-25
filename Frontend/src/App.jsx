import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { Toaster } from 'react-hot-toast';
import Courses from './components/Courses';
import Purchases from './components/Purchases';
import Buy from './components/Buy';
import AdminSignup from './Admin/AdminSignup';
import AdminLogin from './Admin/AdminLogin';
import Dashboard from './Admin/Dashboard';
import CourseCreate from './Admin/CourseCreate';
import UpdateCourse from './Admin/UpdateCourse';
import OurCourses from './Admin/OurCourses';
import  { useEffect, useState } from 'react'




function App() {


  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));

    setUser(storedUser);
    setAdmin(storedAdmin);
  }, []);




  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:id" element={<Buy />} />
        <Route
  path="/purchases"
  element={
    localStorage.getItem("userInfo")
      ? <Purchases />
      : <Navigate to="/login" />
  }
/>
   

        {/* Admin routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={admin?.token ? <Dashboard /> : <Navigate to="/admin/login" />}/>
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
        
      </Routes>
    </div>
  )

}

export default App
