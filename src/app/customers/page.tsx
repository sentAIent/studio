'use client';

import { Users } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Our Customers
          </h2>
          <p className="mt-4 text-lg text-cyan-200/80">
            View and manage your customer base.
          </p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border-cyan-400/20 border rounded-lg p-8 text-center">
          <p className="text-cyan-100/90">
            Customer list and management tools will be here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
