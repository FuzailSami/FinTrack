import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Briefcase, Car, Wifi } from "lucide-react";
import type { Transaction } from "@shared/schema";

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    "Food & Dining": ShoppingCart,
    "Income": Briefcase,
    "Transportation": Car,
    "Utilities": Wifi,
  };
  return iconMap[category] || ShoppingCart;
};

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Food & Dining": "bg-error-50 text-error-500",
    "Income": "bg-success-50 text-success-500",
    "Transportation": "bg-warning-50 text-warning-600",
    "Utilities": "bg-primary-50 text-primary-500",
  };
  return colorMap[category] || "bg-gray-50 text-gray-500";
};

const getBadgeColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Food & Dining": "bg-red-100 text-red-800",
    "Income": "bg-green-100 text-green-800",
    "Transportation": "bg-yellow-100 text-yellow-800",
    "Utilities": "bg-blue-100 text-blue-800",
  };
  return colorMap[category] || "bg-gray-100 text-gray-800";
};

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const recentTransactions = transactions?.slice(0, 4) || [];

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900" data-testid="text-recent-transactions">
            Recent Transactions
          </CardTitle>
          <Button variant="ghost" className="text-primary-500 text-sm font-medium hover:text-primary-600" data-testid="button-view-all">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent transactions found</p>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const IconComponent = getCategoryIcon(transaction.category);
              const iconColorClass = getCategoryColor(transaction.category);
              
              return (
                <div 
                  key={transaction.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
                  data-testid={`transaction-recent-${transaction.id}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClass}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900" data-testid="text-transaction-description">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500" data-testid="text-transaction-category">
                      {transaction.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p 
                      className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-success-600' : 'text-error-500'
                      }`}
                      data-testid="text-transaction-amount"
                    >
                      {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400" data-testid="text-transaction-date">
                      {new Date(transaction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
