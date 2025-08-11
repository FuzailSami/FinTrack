import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowUp, ArrowDown, PiggyBank } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  savingsGoal: number;
  savingsPercentage: number;
}

export default function DashboardCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/analytics/dashboard-stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No financial data available
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" data-testid="text-total-balance-label">
                Total Balance
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1" data-testid="text-total-balance">
                ${stats.totalBalance.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Wallet className="text-primary-500 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" data-testid="text-monthly-income-label">
                Monthly Income
              </p>
              <p className="text-2xl font-semibold text-success-600 mt-1" data-testid="text-monthly-income">
                ${stats.monthlyIncome.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
              <ArrowUp className="text-success-500 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-success-600 font-medium">+5.2%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" data-testid="text-monthly-expenses-label">
                Monthly Expenses
              </p>
              <p className="text-2xl font-semibold text-error-500 mt-1" data-testid="text-monthly-expenses">
                ${stats.monthlyExpenses.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <ArrowDown className="text-error-500 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-error-500 font-medium">+8.1%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600" data-testid="text-savings-goal-label">
                Savings Goal
              </p>
              <p className="text-2xl font-semibold text-warning-600 mt-1" data-testid="text-savings-progress">
                ${stats.savings.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
              <PiggyBank className="text-warning-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-warning-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stats.savingsPercentage}%` }}
                data-testid="progress-savings"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.savingsPercentage.toFixed(0)}% of ${stats.savingsGoal} goal
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
