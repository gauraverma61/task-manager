import { Link } from 'react-router-dom'
import { ThemeToggle } from '../theme-toggler'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-3">
        <div className="mr-4 flex ">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-foreground/80">
              Tasks
            </Link>
            <Link
              to="/users"
              className="transition-colors hover:text-foreground/80"
            >
              Users
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Navbar
