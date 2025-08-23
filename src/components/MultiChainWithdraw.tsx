"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { useAccount } from "wagmi";

interface Chain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  gasToken: string;
  rpcUrl: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  countries: string[];
}

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "base",
    name: "Base",
    symbol: "BASE",
    icon: "🔵",
    gasToken: "ETH",
    rpcUrl: "https://mainnet.base.org"
  },
  {
    id: "celo",
    name: "Celo",
    symbol: "CELO",
    icon: "💚",
    gasToken: "CELO",
    rpcUrl: "https://forno.celo.org"
  },
  {
    id: "optimism",
    name: "Optimism",
    symbol: "OP",
    icon: "🔴",
    gasToken: "ETH",
    rpcUrl: "https://mainnet.optimism.io"
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
    icon: "🔷",
    gasToken: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc"
  },
  {
    id: "gnosis",
    name: "Gnosis Chain",
    symbol: "GNO",
    icon: "🟢",
    gasToken: "xDAI",
    rpcUrl: "https://rpc.gnosischain.com"
  }
];

const KSH_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "mpesa",
    name: "M-Pesa",
    description: "Direct to M-Pesa wallet",
    icon: "📱",
    countries: ["KE", "TZ"]
  },
  {
    id: "till",
    name: "Till Number",
    description: "Pay to business till number",
    icon: "🏪",
    countries: ["KE"]
  },
  {
    id: "paybill",
    name: "Paybill",
    description: "Corporate paybill payment",
    icon: "🏢",
    countries: ["KE"]
  },
  {
    id: "pochi",
    name: "Pochi la Biashara",
    description: "Business wallet payment",
    icon: "💼",
    countries: ["KE"]
  }
];

export default function MultiChainWithdraw() {
  const { address, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedChainData = SUPPORTED_CHAINS.find(chain => chain.id === selectedChain);
  const selectedPaymentData = KSH_PAYMENT_METHODS.find(method => method.id === selectedPayment);

  const handleWithdraw = async () => {
    if (!selectedChain || !selectedPayment || !amount || !recipient) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Withdrawal of ${amount} initiated from ${selectedChainData?.name} to ${selectedPaymentData?.name}!`);
      
      // Reset form
      setAmount("");
      setRecipient("");
      setAccountNumber("");
    }, 3000);
  };

  const getPaymentMethodFields = () => {
    switch (selectedPayment) {
      case "mpesa":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g., 254712345678"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </div>
        );
      case "till":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tillnumber">Till Number</Label>
              <Input
                id="tillnumber"
                placeholder="e.g., 123456"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </div>
        );
      case "paybill":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paybill">Paybill Number</Label>
              <Input
                id="paybill"
                placeholder="e.g., 400200"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="account">Account Number</Label>
              <Input
                id="account"
                placeholder="Your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          </div>
        );
      case "pochi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="business">Business Name</Label>
              <Input
                id="business"
                placeholder="Business name"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-2 border-dashed border-primary/50 bg-gradient-to-br from-green-100 to-blue-100">
        <CardContent className="p-8 text-center">
          <h3 className="fancy-font text-2xl text-primary mb-4">Connect Wallet to Withdraw!</h3>
          <p className="text-muted-foreground">Connect your wallet to start withdrawing across multiple chains.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="fancy-font text-4xl text-primary">MultiChain Withdraw</h2>
        <p className="playful-font text-lg text-muted-foreground">Withdraw from any supported chain to KSH</p>
      </div>

      {/* Supported Chains */}
      <Card className="bg-gradient-to-r from-blue-100 to-green-100">
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">Supported Networks</CardTitle>
          <CardDescription>Choose your source blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SUPPORTED_CHAINS.map((chain) => (
              <Button
                key={chain.id}
                variant={selectedChain === chain.id ? "default" : "outline"}
                className="flex flex-col items-center p-4 h-auto space-y-2"
                onClick={() => setSelectedChain(chain.id)}
              >
                <span className="text-2xl">{chain.icon}</span>
                <span className="text-sm font-medium">{chain.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {chain.gasToken}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KSH Payment Methods */}
      <Card className="bg-gradient-to-r from-green-100 to-yellow-100">
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">KSH Payment Methods</CardTitle>
          <CardDescription>Choose how to receive your KSH</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {KSH_PAYMENT_METHODS.map((method) => (
              <Button
                key={method.id}
                variant={selectedPayment === method.id ? "default" : "outline"}
                className="flex flex-col items-center p-4 h-auto space-y-2"
                onClick={() => setSelectedPayment(method.id)}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-sm font-medium">{method.name}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {method.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {selectedChain && selectedPayment && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-primary/30">
          <CardHeader>
            <CardTitle className="playful-font text-xl text-primary">Withdrawal Details</CardTitle>
            <CardDescription>
              Withdrawing from {selectedChainData?.name} to {selectedPaymentData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum: $10 USD | Maximum: $10,000 USD
              </p>
            </div>

            {getPaymentMethodFields()}

            {amount && (
              <div className="bg-primary/10 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-primary">Transaction Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${amount} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exchange Rate:</span>
                    <span>1 USD = 150 KSH (approx)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span>~$2 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee (1.5%):</span>
                    <span>${(parseFloat(amount || "0") * 0.015).toFixed(2)} USD</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>You&apos;ll receive:</span>
                    <span>~{Math.round((parseFloat(amount || "0") - 2 - parseFloat(amount || "0") * 0.015) * 150)} KSH</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleWithdraw}
              disabled={!amount || !recipient || isProcessing || parseFloat(amount || "0") < 10}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                `Withdraw ${amount ? `$${amount}` : ''} to KSH`
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transaction History Preview */}
      <Card className="border-dashed border-primary/50">
        <CardHeader>
          <CardTitle className="playful-font text-lg text-primary">Recent Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>No withdrawals yet. Make your first withdrawal to see history here!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}