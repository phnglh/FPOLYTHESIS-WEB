import { Route, Router, Routes } from 'react-router'
import Layout from '../layout/Layout'
import Home from './home'
import Login from './login/Login'
import Register from './login/Register'
import Introduce from './home/introduce'
import Contact from './home/contact'
import NewsPage from './home/news'
import NotFound from '../layout/components/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="introduce" element={<Introduce />} />
        <Route path="contact" element={<Contact />} />
        <Route path="newspage" element={<NewsPage />} />
      </Route>
      {/* <Route path="/login" element={<Login/>}/> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
