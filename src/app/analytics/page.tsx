'use client';

import { Activity, ArrowUpRight, DollarSign, Users } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import DashboardLayout from '@/components/dashboard-layout';

const barChartData = [
  { date: '2024-07-15', running: 450, cycling: 380 },
  { date: '2024-07-16', running: 520, cycling: 420 },
  { date: '2024-07-17', running: 580, cycling: 450 },
  { date: '2024-07-18', running: 490, cycling: 390 },
  { date: '2024-07-19', running: 620, cycling: 510 },
  { date: '2024-07-20', running: 780, cycling: 650 },
  { date: '2024-07-21', running: 700, cycling: 580 },
];

const areaChartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  running: {
    label: 'Running',
    color: 'hsl(var(--primary))',
  },
  cycling: {
    label: 'Cycling',
    color: 'hsl(var(--secondary))',
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--primary))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--secondary))',
  },
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics_2">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={chartConfig}
                  className="h-[350px] w-full"
                >
                  <AreaChart
                    data={areaChartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                    accessibilityLayer
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      dataKey="mobile"
                      type="natural"
                      fill="var(--color-mobile)"
                      fillOpacity={0.4}
                      stroke="var(--color-mobile)"
                      stackId="a"
                    />
                    <Area
                      dataKey="desktop"
                      type="natural"
                      fill="var(--color-desktop)"
                      fillOpacity={0.4}
                      stroke="var(--color-desktop)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://picsum.photos/seed/1/32/32"
                            alt="Avatar"
                          />
                          <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">Olivia Martin</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">$1,999.00</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://picsum.photos/seed/2/32/32"
                            alt="Avatar"
                          />
                          <AvatarFallback>JL</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">Jackson Lee</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">$39.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://picsum.photos/seed/3/32/32"
                            alt="Avatar"
                          />
                          <AvatarFallback>IN</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">Isabella Nguyen</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">$299.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://picsum.photos/seed/4/32/32"
                            alt="Avatar"
                          />
                          <AvatarFallback>WK</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">William Kim</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">$99.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://picsum.photos/seed/5/32/32"
                            alt="Avatar"
                          />
                          <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">Sofia Davis</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">$39.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics_2" className="space-y-4">
          <Card>
            <CardHeader className="flex items-start gap-4 space-y-0">
              <div className="grid gap-1">
                <CardTitle>Activity</CardTitle>
                <CardDescription>
                  Showing total visitors for the last 7 days
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pl-2 pr-6">
              <ChartContainer
                config={chartConfig}
                className="h-[300px] w-full"
              >
                <BarChart data={barChartData} margin={{ left: -20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', {
                        weekday: 'short',
                      });
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="running"
                    fill="var(--color-running)"
                    radius={4}
                  />
                  <Bar
                    dataKey="cycling"
                    fill="var(--color-cycling)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
