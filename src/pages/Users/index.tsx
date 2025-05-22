import { useEffect, useState } from 'react'
import { fetchUsers } from './fetchUsers';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
  }

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true)
        const data = await fetchUsers()
        setUsers(data)
        setFilteredUsers(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch users. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.website.toLowerCase().includes(query)
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-1">Users</h1>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users by name, email or website..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[150px] rounded-md" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredUsers.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No users found matching your search criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card className="animate-slide-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Email:</span>
                    <a 
                      href={`mailto:${user.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {user.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Phone:</span>
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Website:</span>
                    <a 
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UsersPage
