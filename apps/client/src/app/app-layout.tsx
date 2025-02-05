import Footer from '@/components/Footer'
import { Container } from '@mui/material'
import { ReactNode } from 'react'

import { Link } from 'react-router-dom'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Container className="flex items-center justify-between px-4 py-3">
        <div>
          <Link to="/">
            <img src="/assets/logo.png" height={24} alt="Logo" />
          </Link>
        </div>

        <div>
          <nav>
            <ul className="flex space-x-4">
              <Link to="/" className="text-black hover:text-blue-600">
                Home
              </Link>
              <Link
                to="/collections"
                className="text-black hover:text-blue-600"
              >
                Collections
              </Link>
              <Link to="/collection" className="text-black hover:text-blue-600">
                About
              </Link>
              <Link to="/contact" className="text-black hover:text-blue-600">
                Contact
              </Link>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600">
            <i className="fas fa-user"></i>
          </button>
          <button className="text-gray-600 hover:text-blue-600">
            <i className="fas fa-search"></i>
          </button>
          <button className="text-gray-600 hover:text-blue-600">
            <i className="fas fa-heart"></i>
          </button>
          <button className="text-gray-600 hover:text-blue-600">
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </Container>

      <div className="flex-grow flex justify-center">{children}</div>
      <Footer />
    </div>
  )
}
