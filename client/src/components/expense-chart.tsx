import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface ExpenseData {
  category: string;
  total: number;
  count: number;
}

const COLORS = ['#F44336', '#FF9800', '#2196F3', '#9C27B0', '#4CAF50', '#795548'];

export default function ExpenseChart() {
  const [period, setPeriod] = useState("30");
  
  // Calculate date range based on period
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - (parseInt(period) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

  const { data: expenseData, isLoading } = useQuery<ExpenseData[]>({
    queryKey: ["/api/analytics/expenses-by-category", { startDate, endDate }],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/expenses-by-category?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expense data');
      }
      return response.json();
    },
  });

  const formatData = (data: ExpenseData[]) => {
    return data.map((item) => ({
      name: item.category,
      value: item.total,
      count: item.count,
    }));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Total: <span className="font-medium text-error-500">${data.value.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Transactions: <span className="font-medium">{data.payload.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900" data-testid="text-expense-breakdown">
            Expense Breakdown
          </CardTitle>
          <Select value={period} onValueChange={setPeriod} data-testid="select-period">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <Skeleton className="w-64 h-64 rounded-full" />
          </div>
        ) : !expenseData || expenseData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No expense data available for the selected period</p>
          </div>
        ) : (
          <div className="h-80" data-testid="chart-expenses">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatData(expenseData)}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {formatData(expenseData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
