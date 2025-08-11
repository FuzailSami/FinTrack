import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Download, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { ShoppingCart, Briefcase, Car, Wifi } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
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

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/dashboard-stats"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  // Filter transactions based on search term
  const filteredTransactions = transactions?.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Paginate filtered transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactionMutation.mutate(id);
    }
  };

  const exportTransactions = () => {
    if (!transactions || transactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ["Date", "Description", "Category", "Type", "Amount", "Notes"].join(","),
      ...transactions.map(t => [
        t.date,
        `"${t.description}"`,
        t.category,
        t.type,
        t.amount,
        `"${t.notes || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Transactions exported successfully",
    });
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900" data-testid="text-transaction-history">
            Transaction History
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
                data-testid="input-search-transactions"
              />
            </div>
            
            {/* Filter and Export buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" data-testid="button-filter">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportTransactions}
                data-testid="button-export"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-100">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : paginatedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? "No transactions match your search" : "No transactions found"}
            </p>
          </div>
        ) : (
          <>
            {/* Transaction Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Amount</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => {
                    const IconComponent = getCategoryIcon(transaction.category);
                    const iconColorClass = getCategoryColor(transaction.category);
                    const badgeColorClass = getBadgeColor(transaction.category);
                    
                    return (
                      <tr 
                        key={transaction.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        data-testid={`row-transaction-${transaction.id}`}
                      >
                        <td className="py-4 px-4 text-sm text-gray-900" data-testid="text-transaction-date">
                          {new Date(transaction.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColorClass}`}>
                              <IconComponent className="w-3 h-3" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900" data-testid="text-transaction-description">
                                {transaction.description}
                              </p>
                              {transaction.notes && (
                                <p className="text-xs text-gray-500" data-testid="text-transaction-notes">
                                  {transaction.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`text-xs font-medium ${badgeColorClass}`} data-testid="badge-transaction-category">
                            {transaction.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span 
                            className={`text-sm font-semibold ${
                              transaction.type === 'income' ? 'text-success-600' : 'text-error-500'
                            }`}
                            data-testid="text-transaction-amount"
                          >
                            {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="p-1 text-gray-400 hover:text-primary-500 h-8 w-8"
                              data-testid={`button-edit-${transaction.id}`}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="p-1 text-gray-400 hover:text-error-500 h-8 w-8"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              disabled={deleteTransactionMutation.isPending}
                              data-testid={`button-delete-${transaction.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500" data-testid="text-pagination-info">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    data-testid="button-previous-page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  {[...Array(Math.min(3, totalPages))].map((_, i) => {
                    const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
                    if (page > totalPages) return null;
                    
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-primary-500 text-white" : ""}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
