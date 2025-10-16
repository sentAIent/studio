'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DashboardLayout from '@/components/dashboard-layout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

const customers = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    avatar: 'https://picsum.photos/seed/1/40/40',
    type: 'Paid',
    date: '2023-01-15',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    avatar: 'https://picsum.photos/seed/2/40/40',
    type: 'Free',
    date: '2023-02-20',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    avatar: 'https://picsum.photos/seed/3/40/40',
    type: 'Paid',
    date: '2023-03-10',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    avatar: 'https://picsum.photos/seed/4/40/40',
    type: 'Free',
    date: '2023-04-05',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    avatar: 'https://picsum.photos/seed/5/40/40',
    type: 'Paid',
    date: '2023-05-21',
  },
   {
    name: 'Liam Garcia',
    email: 'liam.garcia@email.com',
    avatar: 'https://picsum.photos/seed/6/40/40',
    type: 'Paid',
    date: '2023-06-12',
  },
  {
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    avatar: 'https://picsum.photos/seed/7/40/40',
    type: 'Free',
    date: '2023-07-30',
  },
];

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            A list of your recent customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>
                          {customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.type === 'Paid' ? 'default' : 'secondary'
                      }
                    >
                      {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
