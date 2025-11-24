'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Ticket } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";



interface CurrentUser {
  id: string
  email: string
  role: 'user' | 'admin' | 'moderator'
}

interface LoginPageProps {
  onLogin: (user: CurrentUser) => void
}

export default function AuthLayout(
  { onLogin }: LoginPageProps) {

  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const router = useRouter();



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loginEmail && loginPassword) {

      const res = await axios.post('http://localhost:3001/api/v1/user/login', {
        email: loginEmail,
        password: loginPassword,
      });



      if (res.status === 200) {
        onLogin({
          id: res.data.user.id,
          email: res.data.user.email,
          role: res.data.user.role.toLowerCase()
        })



      }
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signupEmail && signupPassword) {
      const res = await axios.post('http://localhost:3001/api/v1/user/signup', {
        email: signupEmail,
        password: signupPassword,
      });

      if (res.status === 200) {
        onLogin({
          id: res.data.user.id,
          email: res.data.user.email,
          role: res.data.user.role.toLowerCase()
        })
      }
    }
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl animate-shimmer" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-xl border border-white/10 rounded-xl hover:from-primary/50 hover:to-accent/50 transition-all duration-300">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">TicketHub</h1>
          </div>
          <p className="text-muted-foreground">Manage and track support tickets efficiently</p>
        </div>

        <Card className="border-white/10 backdrop-blur-xl bg-white/5">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Login or create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20"
                  >
                    Sign In
                  </Button>
                </form>


              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="bg-secondary/50 border-white/10 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20"
                  >
                    Create Account
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center">
                  By signing up, you agree to our Terms and Privacy Policy
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>


      </div>
    </div>
  );

}