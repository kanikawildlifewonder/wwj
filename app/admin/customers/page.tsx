"use client";

import React, { useState } from "react";
import { Search, Filter, Mail, MoreVertical } from "lucide-react";

const MOCK_CUSTOMERS = [
  { id: "CUST-001", name: "Rahul Sharma", email: "rahul@example.com", orders: 12, spent: 15400, joined: "2025-11-10T10:00:00Z", status: "Active" },
  { id: "CUST-002", name: "Priya Patel", email: "priya@example.com", orders: 4, spent: 3200, joined: "2026-01-15T14:30:00Z", status: "Active" },
  { id: "CUST-003", name: "Amit Kumar", email: "amit@example.com", orders: 1, spent: 4500, joined: "2026-06-01T09:45:00Z", status: "New" },
  { id: "CUST-004", name: "Sneha Reddy", email: "sneha@example.com", orders: 0, spent: 0, joined: "2026-06-02T16:20:00Z", status: "Inactive" },
  { id: "CUST-005", name: "Vikram Singh", email: "vikram@example.com", orders: 8, spent: 11250, joined: "2025-12-05T11:10:00Z", status: "Active" },
];

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = MOCK_CUSTOMERS.filter((c) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-jungle">Customers</h2>
        <p className="text-sm text-jungle/60">View and manage your customer base.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle/40" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <button className="flex items-center justify-center gap-2 text-sm text-jungle border border-border px-4 py-2 rounded-lg bg-white hover:bg-cream transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory border-b border-border text-xs uppercase tracking-wider text-jungle/70">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-jungle/10 flex items-center justify-center text-jungle font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-jungle">{customer.name}</p>
                        <p className="text-xs text-jungle/50">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === "Active" ? "bg-emerald-100 text-emerald-800" :
                      customer.status === "New" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-jungle">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-jungle">
                    ₹{customer.spent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-sm text-jungle/70">
                    {new Date(customer.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`mailto:${customer.email}`} className="p-2 text-jungle/50 hover:text-jungle hover:bg-cream rounded-md transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                      <button className="p-2 text-jungle/50 hover:text-jungle hover:bg-cream rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-jungle/50 text-sm">
                    No customers found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
