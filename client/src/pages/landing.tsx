import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PieChart, Target, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Take Control of Your <span className="text-blue-600">Finances</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track expenses, manage budgets, and achieve your financial goals with our comprehensive finance management platform.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3" 
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Expense Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily track all your income and expenses with detailed categorization and notes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <PieChart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Visual Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get insights into your spending patterns with beautiful charts and analytics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set and track budgets for different categories to stay on top of your spending.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Financial Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your progress towards savings goals and financial milestones.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Financial Journey?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of users who have already taken control of their finances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="text-lg px-8 py-3" 
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login-bottom"
              >
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}