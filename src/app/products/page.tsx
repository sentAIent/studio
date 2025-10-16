'use client';

import Image from 'next/image';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import DashboardLayout from '@/components/dashboard-layout';

const products = [
  {
    name: 'Laser-Cut Chair',
    status: 'Active',
    price: '$49.99',
    stock: 25,
    image: 'https://picsum.photos/seed/p1/400/300',
    imageHint: 'modern chair',
  },
  {
    name: '3D-Printed Vase',
    status: 'Active',
    price: '$29.99',
    stock: 120,
    image: 'https://picsum.photos/seed/p2/400/300',
    imageHint: 'geometric vase',
  },
  {
    name: 'CNC-Milled Desk Organizer',
    status: 'Archived',
    price: '$79.99',
    stock: 0,
    image: 'https://picsum.photos/seed/p3/400/300',
    imageHint: 'wood organizer',
  },
  {
    name: 'Engraved Coasters (Set of 4)',
    status: 'Active',
    price: '$19.99',
    stock: 200,
    image: 'https://picsum.photos/seed/p4/400/300',
    imageHint: 'slate coasters',
  },
  {
    name: 'Custom Vinyl Decal',
    status: 'Draft',
    price: '$9.99',
    stock: 500,
    image: 'https://picsum.photos/seed/p5/400/300',
    imageHint: 'laptop decal',
  },
];

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card key={product.name}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    alt={product.name}
                    className="aspect-square w-full rounded-md object-cover"
                    height="200"
                    src={product.image}
                    width="200"
                    data-ai-hint={product.imageHint}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {product.price}
                  </div>
                   <Badge variant={product.status === "Active" ? "default" : "secondary"}>{product.status}</Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
