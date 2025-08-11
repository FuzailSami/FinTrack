import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, X, DollarSign, Calendar, FileText, Tag, StickyNote, Receipt, ArrowUp, ArrowDown } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { insertTransactionSchema, type Category } from "@shared/schema";

const formSchema = insertTransactionSchema.extend({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Amount must be a positive number"
  ),
});

type FormData = z.infer<typeof formSchema>;

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ open, onClose }: AddTransactionModalProps) {
  const { toast } = useToast();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
      receipt_url: "",
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const transactionData = {
        ...data,
        amount: parseFloat(data.amount).toFixed(2),
      };
      return apiRequest("POST", "/api/transactions", transactionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/expenses-by-category"] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createTransactionMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Filter categories based on transaction type
  const transactionType = form.watch("type");
  const availableCategories = categories?.filter(cat => 
    transactionType === "income" ? cat.type === "income" : cat.type === "expense"
  ) || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-add-transaction">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Add New Transaction
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Track your income and expenses easily
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 rounded-full"
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Type - Enhanced Design */}
            <Card className="border-0 bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-900 mb-3 block">
                        Transaction Type
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                              field.value === 'expense' 
                                ? 'border-error-500 bg-error-50 dark:bg-error-900/20' 
                                : 'border-gray-200 bg-white dark:bg-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => field.onChange('expense')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                field.value === 'expense' ? 'bg-error-500' : 'bg-gray-200'
                              }`}>
                                <ArrowDown className={`w-4 h-4 ${
                                  field.value === 'expense' ? 'text-white' : 'text-gray-500'
                                }`} />
                              </div>
                              <div>
                                <p className={`font-medium ${
                                  field.value === 'expense' ? 'text-error-700' : 'text-gray-700'
                                }`}>
                                  Expense
                                </p>
                                <p className="text-xs text-gray-500">Money going out</p>
                              </div>
                            </div>
                          </div>
                          
                          <div
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                              field.value === 'income' 
                                ? 'border-success-500 bg-success-50 dark:bg-success-900/20' 
                                : 'border-gray-200 bg-white dark:bg-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => field.onChange('income')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                field.value === 'income' ? 'bg-success-500' : 'bg-gray-200'
                              }`}>
                                <ArrowUp className={`w-4 h-4 ${
                                  field.value === 'income' ? 'text-white' : 'text-gray-500'
                                }`} />
                              </div>
                              <div>
                                <p className={`font-medium ${
                                  field.value === 'income' ? 'text-success-700' : 'text-gray-700'
                                }`}>
                                  Income
                                </p>
                                <p className="text-xs text-gray-500">Money coming in</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2 text-base font-medium text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>Amount</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-lg font-medium">$</span>
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10 h-12 text-lg font-medium border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                          data-testid="input-amount"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2 text-base font-medium text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Date</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                        data-testid="input-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2 text-base font-medium text-gray-900">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Description</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What was this transaction for?"
                      className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                      data-testid="input-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2 text-base font-medium text-gray-900">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span>Category</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} data-testid="select-category">
                      <SelectTrigger className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2 text-base font-medium text-gray-900">
                    <StickyNote className="w-4 h-4 text-gray-500" />
                    <span>Notes</span>
                    <span className="text-sm font-normal text-gray-500">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or details..."
                      rows={3}
                      className="resize-none border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                      data-testid="textarea-notes"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Receipt Upload - Enhanced */}
            <div>
              <Label className="flex items-center space-x-2 text-base font-medium text-gray-900 mb-3">
                <Receipt className="w-4 h-4 text-gray-500" />
                <span>Receipt</span>
                <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </Label>
              <Card className="border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors duration-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CloudUpload className="text-primary-500 w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drop your receipt here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supports JPG, PNG, PDF files up to 10MB
                    </p>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      className="hidden" 
                      data-testid="input-receipt"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="text-primary-500 border-primary-200 hover:bg-primary-50 hover:border-primary-300"
                      data-testid="button-choose-file"
                    >
                      <CloudUpload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-12 text-base font-medium"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className={`flex-1 h-12 text-base font-medium text-white ${
                  transactionType === 'income' 
                    ? 'bg-success-500 hover:bg-success-600' 
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
                disabled={createTransactionMutation.isPending}
                data-testid="button-submit"
              >
                {createTransactionMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {transactionType === 'income' ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span>Add {transactionType === 'income' ? 'Income' : 'Expense'}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
