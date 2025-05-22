import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
}

interface TasksState {
  tasks: Task[]
}

const initialState: TasksState = {
  tasks: [],
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) task.completed = !task.completed
    },
    editTask: (
      state,
      action: PayloadAction<{ id: string; title?: string; description?: string }>
    ) => {
      const task = state.tasks.find(task => task.id === action.payload.id)
      if (task) {
        if (action.payload.title !== undefined) task.title = action.payload.title
        if (action.payload.description !== undefined) task.description = action.payload.description
      }
    },
  },
})

export const { addTask, deleteTask, toggleComplete, editTask } = tasksSlice.actions
export default tasksSlice.reducer
