'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

import { Badge } from '@/components/ui/badge'
import { LogOut, Plus, X, Ticket } from 'lucide-react'
import axios from 'axios'

interface CurrentUser {
  id: string
  email: string
  role: 'USER' | 'ADMIN' |'MODERATOR'
}

interface TicketType {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

interface UserDashboardProps {
  user: CurrentUser
  onLogout: () => void
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {



  console.log("UserDashboard rendered:", user.role);
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: '1',
      title: 'Login not working',
      description: 'Cannot login with my credentials',
      status: 'open',
      createdAt: '2024-01-15',
      priority: 'high',
    },
  ])

  useEffect(() => {
    // Fetch tickets from backend API here and setTickets
   
    async function getAlltickets(){
        const res = await axios.get('http://localhost:3001/api/v1/ticket/',
          {
            withCredentials: true,
          }
        );

        console.log("data",res);

        if(res.status === 200){
          setTickets(res.data.tickets);
        }
     }
      getAlltickets();
  }, [])

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && description) {
      const newTicket: TicketType = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
        priority: priority as 'low' | 'medium' | 'high',
      }
      setTickets([newTicket, ...tickets])
      setTitle('')
      setDescription('')
      setPriority('medium')
      setShowForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-300'
      case 'resolved':
        return 'bg-green-500/20 text-green-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500/20 text-green-300'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'high':
        return 'bg-red-500/20 text-red-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-xl border border-white/10 rounded-lg hover:from-primary/50 hover:to-accent/50 transition-all duration-300">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold gradient-text">TicketHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
    
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-white/10 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 gradient-text">My Tickets</h2>
          <p className="text-muted-foreground">Create and manage your support tickets</p>
        </div>

        <Card className="border-white/10 backdrop-blur-xl bg-white/5 mb-8 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create New Ticket</CardTitle>
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              )}
            </div>
          </CardHeader>
          {showForm && (
            <CardContent className="pt-4">
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="ticket-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="ticket-title"
                    placeholder="Brief description of your issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="ticket-description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="ticket-description"
                    placeholder="Provide detailed information about your issue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground shadow-lg hover:shadow-xl"
                  >
                    Create Ticket
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="border-white/10 backdrop-blur-xl bg-white/5">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No tickets yet. Create one to get started.</p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="border-white/10 backdrop-blur-xl bg-white/5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{ticket.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{ticket.description}</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority} priority
                        </Badge>
                        <span className="text-xs text-muted-foreground">Created: {ticket.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-xs text-muted-foreground font-mono bg-secondary/50 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-lg hover:text-primary transition-all duration-300">
                        #{ticket.id.slice(0, 6)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
