import { Outlet } from 'react-router-dom'
import Navbar from './navbar'

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6 px-4 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
