import { useState } from 'react'

import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout'
import TasksPage from './pages/TaskPage'
import UsersPage from './pages/Users'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TasksPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
