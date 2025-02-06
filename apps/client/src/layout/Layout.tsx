import { Container } from '@mui/material'
import { Outlet } from 'react-router'
import Navbar from './AppBar'

export default function Layout() {
  return (
    <Container>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>alalal</footer>
    </Container>
  )
}
