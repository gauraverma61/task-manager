import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useTheme } from './providers/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  console.log('theme', theme)

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => {
        theme == 'dark' ? setTheme('light') : setTheme('dark');
      }}
    >
      {theme == 'dark' ? (
        <Sun className="h-5 w-5 transition-all" />
      ) : (
        <Moon className="h-5 w-5 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
