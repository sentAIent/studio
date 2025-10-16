'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading, error } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(email, password);
    if (success) {
      router.push('/');
    } else {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "Could not create account. Please try again.",
        })
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm bg-slate-900/80 border-cyan-400/30 text-white">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription className="text-cyan-300/80">
            Get started with your AI Avatar Assistant.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/80 border-cyan-400/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/80 border-cyan-400/30 pr-10"
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-cyan-300/80 hover:text-cyan-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-cyan-300/60">Password must be at least 6 characters.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-teal-600" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
             <p className="text-sm text-cyan-300/80">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
