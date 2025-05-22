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
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [sortDirection, setSortDirection] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('all')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

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

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, eggs, and bread',
      completed: false,
      createdAt: '2025-05-22T09:00:00Z',
    },
    {
      id: '2',
      title: 'Finish project report',
      completed: true,
      createdAt: '2025-05-21T14:30:00Z',
    },
    {
      id: '3',
      title: 'Book dentist appointment',
      description: 'Call Dr. Sharma’s clinic',
      completed: false,
      createdAt: '2025-05-20T10:15:00Z',
    },
    {
      id: '4',
      title: 'Workout',
      description: 'Leg day at the gym',
      completed: true,
      createdAt: '2025-05-19T07:45:00Z',
    },
    {
      id: '5',
      title: 'Read a book',
      description: 'Continue reading "Atomic Habits"',
      completed: false,
      createdAt: '2025-05-18T20:00:00Z',
    },
    {
      id: '6',
      title: 'Water plants',
      completed: true,
      createdAt: '2025-05-18T07:00:00Z',
    },
    {
      id: '7',
      title: 'Clean the house',
      description: 'Living room and kitchen',
      completed: false,
      createdAt: '2025-05-17T15:00:00Z',
    },
    {
      id: '8',
      title: 'Reply to emails',
      completed: true,
      createdAt: '2025-05-17T10:30:00Z',
    },
    {
      id: '9',
      title: 'Prepare dinner',
      description: 'Cook pasta and salad',
      completed: false,
      createdAt: '2025-05-16T18:00:00Z',
    },
    {
      id: '10',
      title: 'Meditation',
      completed: true,
      createdAt: '2025-05-16T06:30:00Z',
    },
    {
      id: '11',
      title: 'Write blog post',
      description: 'Topic: Benefits of TypeScript',
      completed: false,
      createdAt: '2025-05-15T13:45:00Z',
    },
    {
      id: '12',
      title: 'Fix bug in login page',
      completed: true,
      createdAt: '2025-05-15T11:00:00Z',
    },
  ]

  const filteredTasks = filterTasks(tasks, statusFilter)
  const sortedTasks = sortTasks(filteredTasks)

  // Pagination
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

  const addTask = () => {}

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Task Manager</h1>
          <p className="text-muted-foreground">
            Organize your tasks efficiently
          </p>
        </div>

        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={addTask} className="space-y-4">
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
              className={`task-card animate-fade-in ${task.completed ? 'border-l-4 border-l-primary/40' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.completed}
                      //  onCheckedChange={handleToggleStatus}
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
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {}}>
                  <Trash size={16} className="mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Pagination */}
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
        </div>
      )}
    </div>
  )
}

export default TasksPage
