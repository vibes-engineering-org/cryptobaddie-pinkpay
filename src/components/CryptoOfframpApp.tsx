"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import CryptoOfframp from "./CryptoOfframp";
import LanguageSelector from "./LanguageSelector";
import { LanguageProvider, useLanguage } from "~/hooks/use-language";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";

function AppContent() {
  const { address, isConnected } = useAccount();
  const { isSDKLoaded } = useMiniAppSdk();
  const { t } = useLanguage();
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
            <h1 className="fancy-font text-4xl text-primary">Pink Pay</h1>
            <p className="playful-font text-lg text-primary/80 mt-1">
              Off-ramp crypto to Kenyan Shilling, Tanzanian Shilling, and Nigerian Naira
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
        <div className="space-y-6">
          {checkKYCRequired() && kycStatus !== "pending" && (
            <Alert>
              <AlertDescription>
                You may need to complete verification to use payment services for larger amounts.
              </AlertDescription>
            </Alert>
          )}
          
          {kycStatus === "pending" && (
            <Alert>
              <AlertDescription>
                Your verification application is under review. You will be notified once complete.
              </AlertDescription>
            </Alert>
          )}

          <CryptoOfframp />
        </div>

        {/* Features Overview */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border-primary/30 bg-gradient-to-br from-green-100 to-teal-100">
            <CardHeader>
              <CardTitle className="playful-font text-lg text-primary">Multi-Chain Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Off-ramp from Base, Celo, and Optimism networks to KES, TZS, NGN via M-Pesa and Bank Transfers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-blue-100 to-indigo-100">
            <CardHeader>
              <CardTitle className="playful-font text-lg text-primary">Fast Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get your local currency in minutes with M-Pesa or bank transfers. Real-time exchange rates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-pink-100 to-purple-100">
            <CardHeader>
              <CardTitle className="playful-font text-lg text-primary">Secure & Simple</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Low fees, secure transactions, and an intuitive interface designed for African markets.
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
            <span className="playful-font">Pink Pay - Off-ramp from Base, Celo, Optimism to KES, TZS, NGN</span>
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