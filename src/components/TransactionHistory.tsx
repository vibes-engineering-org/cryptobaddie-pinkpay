"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface Transaction {
  id: string;
  type: "offramp" | "onramp";
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  cryptoAmount: number;
  cryptoCurrency: string;
  fiatAmount: number;
  fiatCurrency: string;
  payoutMethod: string;
  exchangeRate: number;
  fees: number;
  netAmount: number;
  createdAt: Date;
  completedAt?: Date;
  txHash?: string;
  reference: string;
  notes?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "tx_001",
    type: "offramp",
    status: "completed",
    cryptoAmount: 100,
    cryptoCurrency: "USDC",
    fiatAmount: 12950,
    fiatCurrency: "KSH",
    payoutMethod: "M-Pesa Kenya",
    exchangeRate: 129.50,
    fees: 323.75,
    netAmount: 12626.25,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    completedAt: new Date("2024-01-15T10:35:00Z"),
    txHash: "0x1234567890abcdef1234567890abcdef12345678",
    reference: "MP240115103000001",
  },
  {
    id: "tx_002",
    type: "offramp",
    status: "processing",
    cryptoAmount: 0.5,
    cryptoCurrency: "ETH",
    fiatAmount: 162250,
    fiatCurrency: "KSH",
    payoutMethod: "M-Pesa Kenya",
    exchangeRate: 324500,
    fees: 4056.25,
    netAmount: 158193.75,
    createdAt: new Date("2024-01-16T14:20:00Z"),
    reference: "MP240116142000001",
    notes: "Large transaction - additional verification required",
  },
  {
    id: "tx_003",
    type: "offramp",
    status: "failed",
    cryptoAmount: 50,
    cryptoCurrency: "USDT",
    fiatAmount: 1647.50,
    fiatCurrency: "NGN",
    payoutMethod: "Nigerian Bank Transfer",
    exchangeRate: 1649.50,
    fees: 24.71,
    netAmount: 1622.79,
    createdAt: new Date("2024-01-14T16:45:00Z"),
    reference: "NG240114164500001",
    notes: "Bank details verification failed",
  },
  {
    id: "tx_004",
    type: "offramp",
    status: "completed",
    cryptoAmount: 200,
    cryptoCurrency: "USDC",
    fiatAmount: 529800,
    fiatCurrency: "TZS",
    payoutMethod: "M-Pesa Tanzania",
    exchangeRate: 2649,
    fees: 15894,
    netAmount: 513906,
    createdAt: new Date("2024-01-12T09:15:00Z"),
    completedAt: new Date("2024-01-12T09:22:00Z"),
    reference: "MP240112091500001",
  },
  {
    id: "tx_005",
    type: "offramp",
    status: "pending",
    cryptoAmount: 0.01,
    cryptoCurrency: "BTC",
    fiatAmount: 868200,
    fiatCurrency: "NGN",
    payoutMethod: "Nigerian Bank Transfer",
    exchangeRate: 86820000,
    fees: 13023,
    netAmount: 855177,
    createdAt: new Date("2024-01-17T11:00:00Z"),
    reference: "NG240117110000001",
  },
];

const getStatusColor = (status: Transaction["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "KSH" ? "USD" : currency === "TZS" ? "USD" : currency === "NGN" ? "USD" : currency,
    minimumFractionDigits: currency === "BTC" ? 8 : 2,
    maximumFractionDigits: currency === "BTC" ? 8 : 2,
  }).format(amount).replace("$", currency + " ");
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    let filtered = transactions;

    if (statusFilter !== "all") {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    if (currencyFilter !== "all") {
      filtered = filtered.filter((tx) => tx.cryptoCurrency === currencyFilter || tx.fiatCurrency === currencyFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((tx) =>
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, statusFilter, typeFilter, currencyFilter, searchQuery]);

  const getTransactionSummary = () => {
    const completed = transactions.filter((tx) => tx.status === "completed");
    const totalVolume = completed.reduce((sum, tx) => sum + tx.fiatAmount, 0);
    const totalFees = completed.reduce((sum, tx) => sum + tx.fees, 0);

    return {
      totalTransactions: transactions.length,
      completedTransactions: completed.length,
      totalVolume,
      totalFees,
    };
  };

  const summary = getTransactionSummary();

  const retryTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txId ? { ...tx, status: "processing" as const } : tx
      )
    );
  };

  const cancelTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txId ? { ...tx, status: "cancelled" as const } : tx
      )
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summary.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summary.completedTransactions}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${(summary.totalVolume / 100).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${(summary.totalFees / 100).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Fees</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage your cryptocurrency transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by ID, reference, or hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="offramp">Offramp</SelectItem>
                  <SelectItem value="onramp">Onramp</SelectItem>
                </SelectContent>
              </Select>

              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="KSH">KSH</SelectItem>
                  <SelectItem value="TZS">TZS</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <div className="text-lg mb-2">No transactions found</div>
                        <div className="text-sm">Try adjusting your filters or search query</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{transaction.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.reference}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {transaction.cryptoAmount} {transaction.cryptoCurrency}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(transaction.fiatAmount, transaction.fiatCurrency)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{transaction.payoutMethod}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{formatDate(transaction.createdAt)}</div>
                          {transaction.completedAt && (
                            <div className="text-xs text-muted-foreground">
                              Completed: {formatDate(transaction.completedAt)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            View
                          </Button>
                          {transaction.status === "failed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => retryTransaction(transaction.id)}
                            >
                              Retry
                            </Button>
                          )}
                          {(transaction.status === "pending" || transaction.status === "processing") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelTransaction(transaction.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Card className="fixed inset-4 z-50 bg-background shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>{selectedTransaction.id}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTransaction(null)}
            >
              ×
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="mt-1 text-sm">{selectedTransaction.type}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Crypto Amount</Label>
                  <div className="mt-1 text-sm font-medium">
                    {selectedTransaction.cryptoAmount} {selectedTransaction.cryptoCurrency}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Fiat Amount</Label>
                  <div className="mt-1 text-sm">
                    {formatCurrency(selectedTransaction.fiatAmount, selectedTransaction.fiatCurrency)}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Exchange Rate</Label>
                  <div className="mt-1 text-sm">
                    1 {selectedTransaction.cryptoCurrency} = {selectedTransaction.exchangeRate.toLocaleString()} {selectedTransaction.fiatCurrency}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Payout Method</Label>
                  <div className="mt-1 text-sm">{selectedTransaction.payoutMethod}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Reference</Label>
                  <div className="mt-1 text-sm font-mono">{selectedTransaction.reference}</div>
                </div>

                {selectedTransaction.txHash && (
                  <div>
                    <Label className="text-sm font-medium">Transaction Hash</Label>
                    <div className="mt-1 text-sm font-mono break-all">
                      {selectedTransaction.txHash}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <div className="mt-1 text-sm">{formatDate(selectedTransaction.createdAt)}</div>
                </div>

                {selectedTransaction.completedAt && (
                  <div>
                    <Label className="text-sm font-medium">Completed</Label>
                    <div className="mt-1 text-sm">{formatDate(selectedTransaction.completedAt)}</div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Fee Breakdown</Label>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gross Amount:</span>
                  <span>{formatCurrency(selectedTransaction.fiatAmount, selectedTransaction.fiatCurrency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Transaction Fee:</span>
                  <span>-{formatCurrency(selectedTransaction.fees, selectedTransaction.fiatCurrency)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>Net Amount:</span>
                  <span>{formatCurrency(selectedTransaction.netAmount, selectedTransaction.fiatCurrency)}</span>
                </div>
              </div>
            </div>

            {selectedTransaction.notes && (
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <div className="mt-1 text-sm text-muted-foreground">
                  {selectedTransaction.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}