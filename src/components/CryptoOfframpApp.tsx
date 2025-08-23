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
import RewardsSection from "./RewardsSection";
import GameSection from "./GameSection";
import MultiChainWithdraw from "./MultiChainWithdraw";
import FinancialPlanner from "./FinancialPlanner";
import { LanguageProvider, useLanguage } from "~/hooks/use-language";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";

function AppContent() {
  const { address, isConnected } = useAccount();
  const { isSDKLoaded } = useMiniAppSdk();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("rewards");
  const [kycStatus, setKycStatus] = useState<"none" | "pending" | "verified" | "rejected">("none");

  // Simulate checking KYC status based on wallet connection
  const checkKYCRequired = () => {
    return kycStatus !== "verified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-purple-300">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="fancy-font text-4xl text-primary">The Crypto Baddie</h1>
            <p className="playful-font text-lg text-primary/80 mt-1">
              Your joyful crypto companion - Offramp to KES, TZS, and NGN currencies!
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-primary/20 border-primary/40">
            <TabsTrigger value="rewards" className="playful-font">Rewards</TabsTrigger>
            <TabsTrigger value="game" className="playful-font">Games</TabsTrigger>
            <TabsTrigger value="withdraw" className="playful-font">Withdraw</TabsTrigger>
            <TabsTrigger value="planner" className="playful-font">Planner</TabsTrigger>
            <TabsTrigger value="offramp" className="playful-font">Pay</TabsTrigger>
            <TabsTrigger value="history" className="playful-font">History</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            <RewardsSection />
          </TabsContent>

          <TabsContent value="game" className="space-y-6">
            <GameSection />
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <MultiChainWithdraw />
          </TabsContent>

          <TabsContent value="planner" className="space-y-6">
            <FinancialPlanner />
          </TabsContent>

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

          <TabsContent value="history" className="space-y-6">
            <TransactionHistory />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card className="border-primary/30 bg-gradient-to-br from-pink-100 to-purple-100">
            <CardHeader>
              <CardTitle className="playful-font text-lg text-primary">Earn $THECRYPTOBADDIE</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Every transaction earns you tokens. The more you use the app, the more you earn with tier-based multipliers!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-blue-100 to-indigo-100">
            <CardHeader>
              <CardTitle className="playful-font text-lg text-primary">Play & Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Test your crypto knowledge with fun quizzes about stablecoins and offramping. Learn while you earn rewards!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-green-100 to-teal-100">
            <CardHeader>
              <CardTitle className="playful-font text-lg text-primary">MultiChain Offramping</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Offramp from Base, Celo, Optimism, Arbitrum, Gnosis to KES, TZS, NGN via M-Pesa & Bank Transfers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-yellow-100 to-orange-100">
            <CardHeader>
              <CardTitle className="playful-font text-lg text-primary">Financial Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your expenses, set budgets, create savings goals, and take control of your financial future.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Optimization Notice */}
        <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-primary/70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="playful-font">Multi-currency offramping to KES, TZS, NGN - optimized for mobile across Africa!</span>
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