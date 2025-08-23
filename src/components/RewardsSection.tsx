"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { useAccount } from "wagmi";

interface RewardTier {
  name: string;
  minTransactions: number;
  multiplier: number;
  perks: string[];
}

const REWARD_TIERS: RewardTier[] = [
  {
    name: "Rookie Baddie",
    minTransactions: 0,
    multiplier: 1,
    perks: ["1x $THECRYPTOBADDIE per transaction", "Basic rewards"]
  },
  {
    name: "Pro Baddie",
    minTransactions: 10,
    multiplier: 1.5,
    perks: ["1.5x $THECRYPTOBADDIE per transaction", "Priority support"]
  },
  {
    name: "Elite Baddie",
    minTransactions: 50,
    multiplier: 2,
    perks: ["2x $THECRYPTOBADDIE per transaction", "Exclusive features", "VIP support"]
  },
  {
    name: "Crypto Baddie Legend",
    minTransactions: 100,
    multiplier: 3,
    perks: ["3x $THECRYPTOBADDIE per transaction", "All exclusive features", "Direct line to team"]
  }
];

export default function RewardsSection() {
  const { address, isConnected } = useAccount();
  const [transactionCount, setTransactionCount] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [currentTier, setCurrentTier] = useState(REWARD_TIERS[0]);

  useEffect(() => {
    // Simulate loading user data from localStorage or API
    if (isConnected && address) {
      const savedTransactions = localStorage.getItem(`transactions_${address}`) || "0";
      const savedTokens = localStorage.getItem(`tokens_${address}`) || "0";
      const transactions = parseInt(savedTransactions);
      const tokens = parseInt(savedTokens);
      
      setTransactionCount(transactions);
      setTokenBalance(tokens);
      
      // Calculate current tier
      const tier = REWARD_TIERS.slice().reverse().find(tier => transactions >= tier.minTransactions) || REWARD_TIERS[0];
      setCurrentTier(tier);
    }
  }, [isConnected, address]);

  const nextTier = REWARD_TIERS.find(tier => tier.minTransactions > transactionCount);
  const progressToNextTier = nextTier 
    ? ((transactionCount - currentTier.minTransactions) / (nextTier.minTransactions - currentTier.minTransactions)) * 100
    : 100;

  const simulateTransaction = () => {
    if (!address) return;
    
    const newTransactionCount = transactionCount + 1;
    const rewardAmount = Math.floor(Math.random() * 50 + 10) * currentTier.multiplier;
    const newTokenBalance = tokenBalance + rewardAmount;
    
    setTransactionCount(newTransactionCount);
    setTokenBalance(newTokenBalance);
    
    localStorage.setItem(`transactions_${address}`, newTransactionCount.toString());
    localStorage.setItem(`tokens_${address}`, newTokenBalance.toString());
    
    // Update tier if needed
    const newTier = REWARD_TIERS.slice().reverse().find(tier => newTransactionCount >= tier.minTransactions) || REWARD_TIERS[0];
    setCurrentTier(newTier);
  };

  if (!isConnected) {
    return (
      <Card className="border-2 border-dashed border-primary/50 bg-gradient-to-br from-purple-100 to-pink-100">
        <CardContent className="p-8 text-center">
          <h3 className="fancy-font text-2xl text-primary mb-4">Connect Wallet to Start Earning!</h3>
          <p className="text-muted-foreground">Connect your wallet to start earning $THECRYPTOBADDIE tokens with every transaction.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="fancy-font text-4xl text-primary">Rewards Hub</h2>
        <p className="playful-font text-lg text-muted-foreground">The more you transact, the more you earn!</p>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-pink-200 to-purple-200 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="playful-font text-2xl text-primary">{currentTier.name}</CardTitle>
              <CardDescription className="text-primary/70">Current Tier</CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground font-bold text-lg px-4 py-2">
              {tokenBalance} $THECRYPTOBADDIE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{transactionCount}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{currentTier.multiplier}x</p>
              <p className="text-sm text-muted-foreground">Reward Multiplier</p>
            </div>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>{transactionCount}/{nextTier.minTransactions} transactions</span>
              </div>
              <Progress value={progressToNextTier} className="h-3" />
            </div>
          )}

          <div className="space-y-2">
            <p className="font-semibold text-primary">Current Perks:</p>
            <ul className="text-sm space-y-1">
              {currentTier.perks.map((perk, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tier Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REWARD_TIERS.map((tier, index) => {
          const isUnlocked = transactionCount >= tier.minTransactions;
          const isCurrent = tier.name === currentTier.name;
          
          return (
            <Card 
              key={tier.name}
              className={`${
                isCurrent ? 'ring-2 ring-primary bg-primary/10' : 
                isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              } transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <CardTitle className={`playful-font text-lg ${isCurrent ? 'text-primary' : ''}`}>
                  {tier.name}
                </CardTitle>
                <CardDescription>
                  {tier.minTransactions === 0 ? 'Start here' : `${tier.minTransactions}+ transactions`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{tier.multiplier}x</p>
                  <p className="text-xs text-muted-foreground">Multiplier</p>
                </div>
                
                {isCurrent && (
                  <Badge className="w-full justify-center bg-primary">Current Tier</Badge>
                )}
                {isUnlocked && !isCurrent && (
                  <Badge className="w-full justify-center bg-green-500">Unlocked</Badge>
                )}
                {!isUnlocked && (
                  <Badge className="w-full justify-center bg-gray-400">Locked</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Simulate Transaction Button (for demo) */}
      <Card className="border-dashed border-primary/50 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <h3 className="playful-font text-xl text-primary mb-2">Test Your Rewards!</h3>
          <p className="text-muted-foreground mb-4">Simulate a transaction to see your rewards grow</p>
          <Button onClick={simulateTransaction} className="bg-primary hover:bg-primary/90 font-bold">
            Simulate Transaction +{Math.floor(Math.random() * 50 + 10) * currentTier.multiplier} $THECRYPTOBADDIE
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}