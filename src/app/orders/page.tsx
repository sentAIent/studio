'use client';

import { ShoppingCart } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your Orders
          </h2>
          <p className="mt-4 text-lg text-cyan-200/80">
            Manage and view your order history.
          </p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border-cyan-400/20 border rounded-lg p-8 text-center">
          <p className="text-cyan-100/90">
            Order management content will be displayed here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
