import { useState } from "react";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardCards from "@/components/dashboard-cards";
import ExpenseChart from "@/components/expense-chart";
import RecentTransactions from "@/components/recent-transactions";
import TransactionHistory from "@/components/transaction-history";
import AddTransactionModal from "@/components/add-transaction-modal";

export default function Dashboard() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-white text-sm"></i>
                </div>
                <h1 className="text-xl font-semibold text-gray-900" data-testid="app-name">
                  FinanceTracker
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAddTransaction(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white"
                data-testid="button-add-transaction"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                  data-testid="button-profile"
                >
                  <User className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <DashboardCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expense Breakdown Chart */}
          <div className="lg:col-span-2">
            <ExpenseChart />
          </div>

          {/* Recent Transactions */}
          <div>
            <RecentTransactions />
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="mt-8">
          <TransactionHistory />
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
      />
    </div>
  );
}
