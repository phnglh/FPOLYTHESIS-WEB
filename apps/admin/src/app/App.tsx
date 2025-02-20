import { Navigate, Route, Routes } from 'react-router'
import Layout from '../layout/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<h1>Dashboard</h1>} />
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  )
}

export default App
