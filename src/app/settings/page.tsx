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
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your name and email address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Your Name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="you@example.com" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <h3 className="font-medium">Password</h3>
                            <p className="text-sm text-muted-foreground">Update your password.</p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <h3 className="font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security.</p>
                        </div>
                        <Button variant="outline">Enable</Button>
                    </div>
                </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4">
             <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Manage your notification preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-start space-x-3">
                        <Checkbox id="marketing" defaultChecked />
                        <div className="grid gap-1.5 leading-none">
                            <label
                            htmlFor="marketing"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Marketing emails
                            </label>
                             <p className="text-xs text-muted-foreground">
                                Receive emails about new products, features, and more.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Checkbox id="product" />
                         <div className="grid gap-1.5 leading-none">
                            <label
                            htmlFor="product"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Product updates
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Get notified about new features and improvements.
                            </p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-3">
                        <Checkbox id="security" defaultChecked />
                         <div className="grid gap-1.5 leading-none">
                            <label
                            htmlFor="security"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Security alerts
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Receive alerts about suspicious activity.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Save preferences</Button>
                </CardFooter>
            </Card>
          </div>
        </main>
    </DashboardLayout>
  );
}
