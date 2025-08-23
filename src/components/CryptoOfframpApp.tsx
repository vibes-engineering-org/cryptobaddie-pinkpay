"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import CryptoOfframp from "./CryptoOfframp";
import KYCCompliance from "./KYCCompliance";
import TransactionHistory from "./TransactionHistory";
import LanguageSelector from "./LanguageSelector";
import { LanguageProvider, useLanguage } from "~/hooks/use-language";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";

function AppContent() {
  const { address, isConnected } = useAccount();
  const { isSDKLoaded } = useMiniAppSdk();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("offramp");
  const [kycStatus, setKycStatus] = useState<"none" | "pending" | "verified" | "rejected">("none");

  // Simulate checking KYC status based on wallet connection
  const checkKYCRequired = () => {
    return kycStatus !== "verified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">PinkPay</h1>
            <p className="text-muted-foreground mt-1">
              Secure crypto to fiat payments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            {isConnected && (
              <Badge variant="secondary" className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            )}
          </div>
        </div>

        {/* SDK Loading State */}
        {!isSDKLoaded && (
          <Alert className="mb-6">
            <AlertDescription>
              Initializing Farcaster Mini App SDK...
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-pink-100 border-pink-200">
            <TabsTrigger value="offramp">Pay</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="offramp" className="space-y-6">
            {checkKYCRequired() && kycStatus !== "pending" && (
              <Alert>
                <AlertDescription>
                  You need to complete KYC verification to use payment services. 
                  <Button 
                    variant="link" 
                    className="p-0 ml-2 h-auto"
                    onClick={() => setActiveTab("kyc")}
                  >
                    Complete KYC now
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {kycStatus === "pending" && (
              <Alert>
                <AlertDescription>
                  Your KYC application is under review. You will be notified once verification is complete.
                </AlertDescription>
              </Alert>
            )}

            <CryptoOfframp />
          </TabsContent>

          <TabsContent value="kyc" className="space-y-6">
            <KYCCompliance />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TransactionHistory />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border-pink-200 bg-pink-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Multi-Currency Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Convert USDC, USDT, ETH, and BTC to KSH, TZS, and NGN with competitive rates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-pink-200 bg-pink-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-primary">M-Pesa Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Direct payments to your M-Pesa wallet in Kenya and Tanzania with instant processing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-pink-200 bg-pink-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Secure & Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full KYC/AML compliance with regulatory standards in Kenya, Tanzania, and Nigeria.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Optimization Notice */}
        <div className="mt-8 p-4 bg-pink-100/70 border border-pink-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Optimized for mobile devices and low-bandwidth connections across Africa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CryptoOfframpApp() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}