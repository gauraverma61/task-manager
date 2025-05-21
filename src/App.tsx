import { useState } from 'react'

import './App.css'
import { Button } from './components/ui/button'
import { ThemeToggle } from './components/theme-toggler'

function App() {
  return (
    <div className=" boder boder-2 border-red-400">
      <p className=" text-4xl">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores,
        deserunt aut vero impedit magni soluta iure accusamus reprehenderit
        temporibus numquam culpa beatae, aliquid quo minus repudiandae eligendi,
        itaque sit quas?
      </p>
      <Button variant={'secondary'}>Submit</Button>
      <ThemeToggle />
    </div>
  )
}

export default App
