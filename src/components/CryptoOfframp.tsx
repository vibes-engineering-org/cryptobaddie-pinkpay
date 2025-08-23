"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

interface PayoutMethod {
  id: string;
  name: string;
  type: "mpesa" | "bank" | "mobile_money";
  currency: string;
  fees: number;
  processingTime: string;
  available: boolean;
}

const CRYPTOCURRENCIES = [
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86a33E6411a3200BFD10e8f71030B5b4e21E8", decimals: 6 },
  { symbol: "USDT", name: "Tether USD", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
  { symbol: "ETH", name: "Ethereum", address: "native", decimals: 18 },
  { symbol: "BTC", name: "Bitcoin", address: "native", decimals: 8 },
];

const FIAT_CURRENCIES = [
  { code: "KSH", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
];

const PAYOUT_METHODS: PayoutMethod[] = [
  {
    id: "mpesa_ke",
    name: "M-Pesa Kenya",
    type: "mpesa",
    currency: "KSH",
    fees: 2.5,
    processingTime: "1-5 minutes",
    available: true,
  },
  {
    id: "mpesa_tz",
    name: "M-Pesa Tanzania",
    type: "mpesa",
    currency: "TZS",
    fees: 3.0,
    processingTime: "1-5 minutes",
    available: true,
  },
  {
    id: "bank_ng",
    name: "Nigerian Bank Transfer",
    type: "bank",
    currency: "NGN",
    fees: 1.5,
    processingTime: "5-30 minutes",
    available: true,
  },
];

export default function CryptoOfframp() {
  const { address, isConnected } = useAccount();
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [selectedFiat, setSelectedFiat] = useState<string>("KSH");
  const [selectedPayout, setSelectedPayout] = useState<string>("mpesa_ke");
  const [amount, setAmount] = useState<string>("");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankCode, setBankCode] = useState<string>("");

  // Simulate fetching exchange rates
  useEffect(() => {
    const fetchRates = () => {
      const mockRates: ExchangeRate[] = [
        { from: "USDC", to: "KSH", rate: 129.50, lastUpdated: new Date() },
        { from: "USDT", to: "KSH", rate: 129.45, lastUpdated: new Date() },
        { from: "ETH", to: "KSH", rate: 324500.00, lastUpdated: new Date() },
        { from: "BTC", to: "KSH", rate: 6820000.00, lastUpdated: new Date() },
        { from: "USDC", to: "TZS", rate: 2650.00, lastUpdated: new Date() },
        { from: "USDT", to: "TZS", rate: 2649.50, lastUpdated: new Date() },
        { from: "ETH", to: "TZS", rate: 6634000.00, lastUpdated: new Date() },
        { from: "BTC", to: "TZS", rate: 139500000.00, lastUpdated: new Date() },
        { from: "USDC", to: "NGN", rate: 1650.00, lastUpdated: new Date() },
        { from: "USDT", to: "NGN", rate: 1649.50, lastUpdated: new Date() },
        { from: "ETH", to: "NGN", rate: 4125000.00, lastUpdated: new Date() },
        { from: "BTC", to: "NGN", rate: 86700000.00, lastUpdated: new Date() },
      ];
      setExchangeRates(mockRates);
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getCurrentRate = () => {
    const rate = exchangeRates.find(r => r.from === selectedCrypto && r.to === selectedFiat);
    return rate?.rate || 0;
  };

  const calculateFiatAmount = () => {
    const cryptoAmount = parseFloat(amount);
    const rate = getCurrentRate();
    if (cryptoAmount && rate) {
      return (cryptoAmount * rate).toFixed(2);
    }
    return "0.00";
  };

  const getAvailablePayouts = () => {
    return PAYOUT_METHODS.filter(method => method.currency === selectedFiat);
  };

  const selectedPayoutMethod = PAYOUT_METHODS.find(method => method.id === selectedPayout);

  const handleOfframp = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!amount || !selectedCrypto || !selectedFiat) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setIsLoading(false);
      alert(`Payment initiated! You will receive ${calculateFiatAmount()} ${selectedFiat} via ${selectedPayoutMethod?.name}`);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Crypto to Fiat Payments</CardTitle>
          <CardDescription>
            Convert your cryptocurrency to local currency with M-Pesa and bank transfers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected && (
            <Alert>
              <AlertDescription>
                Please connect your wallet to continue with the payment process.
              </AlertDescription>
            </Alert>
          )}

          {/* Cryptocurrency Selection */}
          <div className="space-y-2">
            <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue placeholder="Choose cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {CRYPTOCURRENCIES.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{crypto.symbol}</span>
                      <span className="text-muted-foreground">{crypto.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Convert</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!selectedCrypto}
            />
            {amount && selectedCrypto && (
              <p className="text-sm text-muted-foreground">
                ≈ {calculateFiatAmount()} {selectedFiat}
              </p>
            )}
          </div>

          {/* Fiat Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="fiat-select">Target Currency</Label>
            <Select value={selectedFiat} onValueChange={setSelectedFiat}>
              <SelectTrigger>
                <SelectValue placeholder="Choose target currency" />
              </SelectTrigger>
              <SelectContent>
                {FIAT_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-muted-foreground">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exchange Rate Display */}
          {selectedCrypto && selectedFiat && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Exchange Rate</span>
                <Badge variant="default" className="bg-primary">Live</Badge>
              </div>
              <p className="text-lg font-semibold">
                1 {selectedCrypto} = {getCurrentRate().toLocaleString()} {selectedFiat}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated every 30 seconds
              </p>
            </div>
          )}

          <Separator />

          {/* Payout Method Selection */}
          <div className="space-y-4">
            <Label>Payout Method</Label>
            <Tabs value={selectedPayout} onValueChange={setSelectedPayout}>
              <TabsList className="grid w-full grid-cols-3">
                {getAvailablePayouts().map((method) => (
                  <TabsTrigger key={method.id} value={method.id} disabled={!method.available}>
                    {method.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {getAvailablePayouts().map((method) => (
                <TabsContent key={method.id} value={method.id} className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{method.name}</h4>
                      <Badge variant={method.available ? "default" : "secondary"}>
                        {method.available ? "Available" : "Coming Soon"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Fee: {method.fees}%</p>
                      <p>Processing Time: {method.processingTime}</p>
                    </div>

                    {method.type === "mpesa" && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="phone">M-Pesa Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={method.currency === "KSH" ? "+254712345678" : "+255712345678"}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    )}

                    {method.type === "bank" && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank">Bank</Label>
                          <Select value={bankCode} onValueChange={setBankCode}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="access">Access Bank</SelectItem>
                              <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                              <SelectItem value="zenith">Zenith Bank</SelectItem>
                              <SelectItem value="firstbank">First Bank</SelectItem>
                              <SelectItem value="uba">United Bank for Africa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account">Account Number</Label>
                          <Input
                            id="account"
                            type="text"
                            placeholder="Enter account number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Transaction Summary */}
          {amount && selectedCrypto && selectedPayoutMethod && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium">Transaction Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>{amount} {selectedCrypto}</span>
                </div>
                <div className="flex justify-between">
                  <span>You will receive:</span>
                  <span>{calculateFiatAmount()} {selectedFiat}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Fee ({selectedPayoutMethod.fees}%):</span>
                  <span>-{(parseFloat(calculateFiatAmount()) * selectedPayoutMethod.fees / 100).toFixed(2)} {selectedFiat}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Net Amount:</span>
                  <span>{(parseFloat(calculateFiatAmount()) * (1 - selectedPayoutMethod.fees / 100)).toFixed(2)} {selectedFiat}</span>
                </div>
              </div>
            </div>
          )}

          {/* Offramp Button */}
          <Button 
            onClick={handleOfframp}
            disabled={!isConnected || !amount || !selectedCrypto || isLoading || (!phoneNumber && selectedPayoutMethod?.type === "mpesa") || (!accountNumber && selectedPayoutMethod?.type === "bank")}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isLoading ? "Processing..." : "Send Payment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}