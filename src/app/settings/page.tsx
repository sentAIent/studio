'use client';

import Link from 'next/link';
import {
  Bell,
  Cookie,
  CreditCard,
  Inbox,
  Lock,
  User,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Settings
                </legend>
                <div className="grid gap-3">
                  <label htmlFor="name">Name</label>
                  <Input id="name" type="text" defaultValue="Your Name" />
                </div>
                <div className="grid gap-3">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="you@example.com"
                  />
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  General
                </legend>
                <div className="grid gap-3">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    defaultValue="en"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="grid gap-3">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    id="timezone"
                    defaultValue="gmt-5"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="gmt-8">Pacific Time</option>
                    <option value="gmt-7">Mountain Time</option>
                    <option value="gmt-6">Central Time</option>
                    <option value="gmt-5">Eastern Time</option>
                  </select>
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Security
                </legend>
                <div className="flex items-center justify-between">
                  <label htmlFor="2fa">Two-Factor Authentication</label>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password">Password</label>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex-col items-start gap-8 md:flex">
             <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Manage your notification preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="marketing" defaultChecked />
                        <label
                        htmlFor="marketing"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        Marketing emails
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="product" />
                         <label
                        htmlFor="product"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        Product updates
                        </label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="security" defaultChecked />
                         <label
                        htmlFor="security"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        Security alerts
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save preferences</Button>
                </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
