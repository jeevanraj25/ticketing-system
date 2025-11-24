'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LogOut, AlertCircle, Clock, CheckCircle, Ticket } from 'lucide-react'
import axios from 'axios'

interface CurrentUser {
  id: string
  name?: string
  email: string
  role: 'user' | 'admin' | 'moderator'
}

interface AssignedTo {
  id: number
  email: string
}

interface TicketType {
  id: number
  title: string
  description: string
  status: 'open' | 'processing' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  createdById: number | null
  assignedToId: number
  assignedTo: AssignedTo
  deadline: string | null
  helpfulResources: string
  relatedSkills: string[]
}

interface AdminDashboardProps {
  user: CurrentUser
  onLogout: () => void
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [tickets, setTickets] = useState<TicketType[]>([]);

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)

  useEffect(() => {
    async function getAlltickets() {
      const res = await axios.get('http://localhost:3001/api/v1/ticket/', {
        withCredentials: true,
      });


     
      if (res.status === 200) {
        setTickets(res.data.tickets);
      }


    }
    getAlltickets();


  }, []);

  const updateTicketStatus = async (ticketId: number, newStatus: 'open' | 'processing' | 'resolved') => {
    try {
      const res = await axios.patch(`http://localhost:3001/api/v1/ticket/${ticketId}/status`, {
        status: newStatus
      }, {
        withCredentials: true
      });

      if (res.status === 200) {
        setTickets(
          tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket))
        )
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus })
        }
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'processing':
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />
      case 'processing':
        return <Clock className="w-4 h-4" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const openTickets = tickets.filter((t) => t.status === 'open').length
  const processingTickets = tickets.filter((t) => t.status === 'processing').length
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-xl border border-white/10 rounded-lg hover:from-primary/50 hover:to-accent/50 transition-all duration-300">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold gradient-text">TicketHub Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
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
          <h2 className="text-3xl font-bold mb-2 gradient-text">Ticket Management</h2>
          <p className="text-muted-foreground">Overview and management of all support tickets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Open Tickets', count: openTickets, icon: AlertCircle, color: 'from-yellow-500/30 to-yellow-500/10', textColor: 'text-yellow-300' },
            { label: 'Processing', count: processingTickets, icon: Clock, color: 'from-blue-500/30 to-blue-500/10', textColor: 'text-blue-300' },
            { label: 'Resolved', count: resolvedTickets, icon: CheckCircle, color: 'from-green-500/30 to-green-500/10', textColor: 'text-green-300' },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border-white/10 backdrop-blur-xl bg-white/5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 group"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold group-hover:text-primary transition-all duration-300">{stat.count}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/10 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-white/10 backdrop-blur-xl bg-white/5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle>All Tickets</CardTitle>
                <CardDescription>Showing {tickets.length} total tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg group ${selectedTicket?.id === ticket.id
                        ? 'border-primary/50 bg-gradient-to-r from-primary/20 to-accent/20 shadow-lg shadow-primary/20'
                        : 'border-white/10 backdrop-blur-xl bg-white/5 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1 group-hover:text-primary transition-all duration-300">{ticket.title}</h4>
                          <p className="text-sm text-muted-foreground">{ticket?.assignedTo?.email}</p>
                        </div>
                        <div className="flex-shrink-0 text-xs text-muted-foreground font-mono bg-secondary/50 backdrop-blur-xl border border-white/10 px-2 py-1 rounded group-hover:text-primary transition-all duration-300">
                          #{ticket.id}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge className={getStatusColor(ticket?.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(ticket.status)}
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </Badge>
                        {/* <Badge className={getPriorityColor(ticket?.priority)}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </Badge> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedTicket ? (
              <Card className="border-white/10 backdrop-blur-xl bg-white/5 sticky top-20 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 max-h-[calc(100vh-120px)] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="text-lg">Ticket Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
                    <p className="font-mono text-sm">#{selectedTicket?.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Title</p>
                    <p className="font-medium">{selectedTicket?.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-foreground/80">{selectedTicket.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                    <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur-xl border border-white/10 p-2 rounded hover:from-primary/10 hover:to-primary/5 transition-all duration-300">
                      <p className="text-xs text-muted-foreground">ID: {selectedTicket?.assignedTo?.id}</p>
                      <p className="font-medium text-sm">{selectedTicket?.assignedTo?.email}</p>
                    </div>
                  </div>
                  {selectedTicket.relatedSkills.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Related Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTicket.relatedSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs border-primary/30 text-primary/80 hover:bg-primary/10 transition-all duration-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Priority</p>
                    <Badge className={`${getPriorityColor(selectedTicket.priority)} w-full justify-center hover:shadow-lg transition-all duration-300`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Status</p>
                    <Select value={selectedTicket.status} onValueChange={(value) => updateTicketStatus(selectedTicket.id, value as any)}>
                      <SelectTrigger className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedTicket.deadline && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                      <p className="text-sm">{new Date(selectedTicket?.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedTicket.helpfulResources && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Helpful Resources</p>
                      <p className="text-xs text-foreground/70 bg-secondary/30 backdrop-blur-xl border border-white/10 p-2 rounded leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300">
                        {selectedTicket.helpfulResources}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm">{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/10 backdrop-blur-xl bg-white/5">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Select a ticket to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
