import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  PlusCircle,
  ClipboardList,
  Edit,
  Trash,
  CheckCircle,
} from 'lucide-react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import {
  addTask as addTaskAction,
  deleteTask,
  editTask as editTaskAction,
  toggleComplete,
} from '@/store/tasksSlice' // Import the Redux actions

type StatusFilter = 'all' | 'pending' | 'completed'
type SortDirection = 'asc' | 'desc'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
}

const TasksPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sortDirection, setSortDirection] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('all')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  const dispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks.tasks)

  const filterTasks = (tasks: Task[], statusFilter: string): Task[] => {
    switch (statusFilter) {
      case 'pending':
        return tasks.filter((task) => !task.completed)
      case 'completed':
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }

  const sortTasks = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
    })
  }

  const filteredTasks = filterTasks(tasks, statusFilter)
  const sortedTasks = sortTasks(filteredTasks)

  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage)

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleAddTask = () => {
    setIsEditing(false)
    setEditingTaskId(null)
    setTitle('')
    setDescription('')
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setIsEditing(true)
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description || '')
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      return
    }

    if (isEditing && editingTaskId) {
      dispatch(
        editTaskAction({
          id: editingTaskId,
          title: title.trim(),
          description: description.trim() || undefined,
        })
      )
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      dispatch(addTaskAction(newTask))
    }

    // Reset form and close dialog
    setTitle('')
    setDescription('')
    setIsEditing(false)
    setEditingTaskId(null)
    setIsDialogOpen(false)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Task Manager</h1>
          <p className="text-muted-foreground">
            Organize your tasks efficiently
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0" onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                  }}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description (optional)"
                />
              </div>

              <Button type="submit" className="w-full">
                {isEditing ? (
                  'Update Task'
                ) : (
                  <>
                    <PlusCircle size={18} className="mr-2" />
                    Add Task
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-1/2">
          <Label htmlFor="status-filter" className="mb-3 block text-left">
            Filter by Status
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className=" w-full" id="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-1/2">
          <Label htmlFor="sort-direction" className="mb-3 block text-left">
            Sort by Date
          </Label>
          <Select value={sortDirection} onValueChange={setSortDirection}>
            <SelectTrigger className="w-full" id="sort-direction">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="flex h-[300px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <ClipboardList size={32} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
            {description && (
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                " You don't have any tasks yet.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {currentTasks.map((task) => (
            <Card
              key={task.id}
              className={`task-card animate-fade-in ${task.completed ? 'border-l-4 border-l-primary/40' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => {
                        dispatch(toggleComplete(task.id))
                      }}
                      className="mt-1"
                    />
                    <CardTitle
                      className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </CardTitle>
                  </div>
                  {task.completed && (
                    <CheckCircle size={18} className="text-primary" />
                  )}
                </div>
              </CardHeader>

              {task.description && (
                <CardContent className="pl-7">
                  <p
                    className={`text-sm text-left ${task.completed ? 'text-muted-foreground' : ''}`}
                  >
                    {task.description}
                  </p>
                </CardContent>
              )}
              <div className="text-xs text-left text-muted-foreground ml-7">
                Created: {moment(task.createdAt).format('MMM DD, YYYY')}
              </div>

              <CardFooter className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true)
                    handleEditTask(task)
                  }}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    dispatch(deleteTask(task.id))
                  }}
                >
                  <Trash size={16} className="mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {pageNumbers.map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? 'default' : 'outline'}
                    size="sm"
                    className="min-w-[2.5rem]"
                    onClick={() => goToPage(number)}
                  >
                    {number}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TasksPage
