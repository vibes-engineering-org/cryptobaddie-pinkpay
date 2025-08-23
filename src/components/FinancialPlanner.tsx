"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { useAccount } from "wagmi";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface Budget {
  category: string;
  budgeted: number;
  spent: number;
  icon: string;
}

interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
}

const EXPENSE_CATEGORIES = [
  { value: "food", label: "Food & Dining", icon: "🍽️" },
  { value: "transport", label: "Transport", icon: "🚗" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "bills", label: "Bills & Utilities", icon: "⚡" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "crypto", label: "Crypto Trading", icon: "₿" },
  { value: "savings", label: "Savings", icon: "💰" },
  { value: "other", label: "Other", icon: "📝" }
];

export default function FinancialPlanner() {
  const { address, isConnected } = useAccount();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  
  // Form states
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: ""
  });
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: ""
  });
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: ""
  });

  useEffect(() => {
    if (isConnected && address) {
      // Load data from localStorage
      const savedExpenses = localStorage.getItem(`expenses_${address}`);
      const savedBudgets = localStorage.getItem(`budgets_${address}`);
      const savedGoals = localStorage.getItem(`goals_${address}`);

      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
      if (savedGoals) setSavingsGoals(JSON.parse(savedGoals));

      // Initialize default budgets if none exist
      if (!savedBudgets) {
        const defaultBudgets: Budget[] = EXPENSE_CATEGORIES.map(cat => ({
          category: cat.value,
          budgeted: 0,
          spent: 0,
          icon: cat.icon
        }));
        setBudgets(defaultBudgets);
      }
    }
  }, [isConnected, address]);


  useEffect(() => {
    if (address) {
      localStorage.setItem(`expenses_${address}`, JSON.stringify(expenses));
      localStorage.setItem(`budgets_${address}`, JSON.stringify(budgets));
      localStorage.setItem(`goals_${address}`, JSON.stringify(savingsGoals));
    }
  }, [expenses, budgets, savingsGoals, address]);

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString()
    };

    setExpenses([...expenses, expense]);
    
    // Update budget spent amount
    setBudgets(prev => prev.map(budget => 
      budget.category === newExpense.category 
        ? { ...budget, spent: budget.spent + expense.amount }
        : budget
    ));

    // Reset form
    setNewExpense({ category: "", description: "", amount: "" });
  };

  const setBudget = () => {
    if (!newBudget.category || !newBudget.amount) return;

    setBudgets(prev => prev.map(budget =>
      budget.category === newBudget.category
        ? { ...budget, budgeted: parseFloat(newBudget.amount) }
        : budget
    ));

    setNewBudget({ category: "", amount: "" });
  };

  const addSavingsGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return;

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      current: 0,
      deadline: newGoal.deadline
    };

    setSavingsGoals([...savingsGoals, goal]);
    setNewGoal({ title: "", target: "", deadline: "" });
  };

  const getTotalSpent = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalBudgeted = () => {
    return budgets.reduce((total, budget) => total + budget.budgeted, 0);
  };

  const getMonthlyExpenses = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return expenses.filter(expense => new Date(expense.date) >= monthStart);
  };

  const getCategoryIcon = (category: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === category)?.icon || "📝";
  };

  const getCategoryName = (category: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === category)?.label || category;
  };

  if (!isConnected) {
    return (
      <Card className="border-2 border-dashed border-primary/50 bg-gradient-to-br from-purple-100 to-pink-100">
        <CardContent className="p-8 text-center">
          <h3 className="fancy-font text-2xl text-primary mb-4">Connect Wallet for Financial Planning!</h3>
          <p className="text-muted-foreground">Connect your wallet to start tracking expenses and planning finances.</p>
        </CardContent>
      </Card>
    );
  }

  const monthlyExpenses = getMonthlyExpenses();
  const monthlyTotal = monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="fancy-font text-4xl text-primary">Financial Planner</h2>
        <p className="playful-font text-lg text-muted-foreground">Track spending, set budgets, and achieve your goals!</p>
      </div>

      {/* Financial Overview */}
      <Card className="bg-gradient-to-r from-green-200 to-blue-200 border-primary/30">
        <CardHeader>
          <CardTitle className="playful-font text-2xl text-primary">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">${getTotalBudgeted().toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Budgeted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">${monthlyTotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Spent This Month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">${(getTotalBudgeted() - monthlyTotal).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{expenses.length}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Expense */}
      <Card className="bg-gradient-to-br from-yellow-100 to-orange-100">
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">Quick Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            />
            
            <Input
              type="number"
              placeholder="Amount ($)"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            />
            
            <Button onClick={addExpense} className="bg-primary hover:bg-primary/90">
              Add Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">Budget vs Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgets.filter(b => b.budgeted > 0).map(budget => {
              const percentage = budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0;
              const isOverBudget = percentage > 100;
              
              return (
                <div key={budget.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>{budget.icon}</span>
                      <span>{getCategoryName(budget.category)}</span>
                    </span>
                    <span className={`font-semibold ${isOverBudget ? 'text-red-600' : ''}`}>
                      ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                  />
                  {isOverBudget && (
                    <Badge variant="destructive" className="text-xs">
                      Over budget by ${(budget.spent - budget.budgeted).toFixed(2)}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Set Budget */}
      <Card className="bg-gradient-to-br from-blue-100 to-purple-100">
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">Set Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={newBudget.category} onValueChange={(value) => setNewBudget({...newBudget, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="Monthly Budget ($)"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
            />
            
            <Button onClick={setBudget} className="bg-primary hover:bg-primary/90">
              Set Budget
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">Savings Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savingsGoals.length > 0 ? (
            <div className="space-y-4">
              {savingsGoals.map(goal => {
                const progress = (goal.current / goal.target) * 100;
                const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={goal.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <Badge variant={daysLeft > 0 ? "secondary" : "destructive"}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No savings goals yet. Add one below!</p>
          )}

          {/* Add Savings Goal */}
          <div className="p-4 bg-primary/5 rounded-lg space-y-4">
            <h4 className="font-semibold text-primary">Add New Savings Goal</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
              
              <Input
                type="number"
                placeholder="Target amount ($)"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
              />
              
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
              
              <Button onClick={addSavingsGoal} className="bg-primary hover:bg-primary/90">
                Add Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {expenses.slice(-10).reverse().map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-2 border-b">
                  <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(expense.category)}</span>
                    <div>
                      <p className="font-medium">{expense.description || getCategoryName(expense.category)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No expenses recorded yet. Add your first expense above!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}