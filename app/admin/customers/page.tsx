"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Filter, Mail, Users, AlertCircle, Loader2 } from "lucide-react";
import { getAdminCustomers } from "@/app/actions/orders";
import { toast } from "sonner";

type CustomerRecord = {
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  joined: string;
  status: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAdminCustomers().then(res => {
      if (res.success && res.customers) {
        setCustomers(res.customers);
      } else {
        toast.error(res.error || "Failed to load customers");
      }
      setIsLoading(false);
    });
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl text-jungle">Customers</h2>
        <p className="text-sm text-jungle/60">View and manage customers who completed checkouts on your store.</p>
      </div>

      {/* Main Listing Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <span className="text-xs text-jungle/50 font-medium flex items-center gap-1.5 bg-white border border-border px-3 py-2 rounded-lg">
            <Users className="w-4 h-4 text-gold/70" />
            <span>Total Customers: <span className="font-bold text-jungle">{customers.length}</span></span>
          </span>
        </div>

        {/* Customer Table */}
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
            <p className="text-sm text-jungle/50">Loading customer directory...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-12 h-12 text-jungle/20 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-jungle mb-1">No customers found</h3>
            <p className="text-sm text-jungle/50 max-w-sm mx-auto">
              {customers.length === 0
                ? "Customers will automatically appear here once checkouts are completed on the storefront."
                : "No customer records match your active search terms."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ivory border-b border-border text-xs uppercase tracking-wider text-jungle/70">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-cream/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-jungle/10 flex items-center justify-center text-jungle font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-jungle">{customer.name}</p>
                          <p className="text-xs text-jungle/50">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : customer.status === "New"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-jungle">{customer.ordersCount}</td>
                    <td className="px-6 py-4 text-sm font-medium text-jungle">
                      Rs. {customer.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-jungle/70">
                      {new Date(customer.joined).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <a
                          href={`mailto:${customer.email}`}
                          className="p-2 text-jungle/50 hover:text-jungle hover:bg-cream rounded-md transition-colors inline-flex items-center justify-center"
                          title={`Email ${customer.name}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
