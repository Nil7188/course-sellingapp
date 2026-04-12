import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { Toaster } from 'react-hot-toast';
import Courses from './components/Courses';
import Purchases from './components/Purchases';
import Buy from './components/Buy';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />


        /** Add more routes here for other components like Courses, Purchases, Buy, etc. */
        <Route path='/courses' element={<Courses />} />
        <Route path='/purchases' element={<Purchases />} />
        <Route path='/buy/:courseId' element={<Buy />} />
      </Routes>
            <Toaster />

    </div>
  )
}

export default App
