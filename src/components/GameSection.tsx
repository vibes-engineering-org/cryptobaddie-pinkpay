"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { useAccount } from "wagmi";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is a stablecoin?",
    options: [
      "A cryptocurrency that maintains a stable value relative to a reference asset",
      "A coin that never changes in price",
      "A physical coin made of stable materials",
      "A cryptocurrency only for stable people"
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    reward: 10
  },
  {
    id: 2,
    question: "Which of the following is NOT a popular stablecoin?",
    options: ["USDC", "USDT", "DAI", "DOGE"],
    correctAnswer: 3,
    difficulty: 'easy',
    reward: 15
  },
  {
    id: 3,
    question: "What does 'offramping' mean in crypto?",
    options: [
      "Buying more cryptocurrency",
      "Converting cryptocurrency to traditional fiat currency",
      "Mining cryptocurrency",
      "Staking cryptocurrency"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    reward: 25
  },
  {
    id: 4,
    question: "Which blockchain network is known for low transaction fees and fast processing?",
    options: ["Bitcoin", "Ethereum", "Base", "Litecoin"],
    correctAnswer: 2,
    difficulty: 'medium',
    reward: 30
  },
  {
    id: 5,
    question: "What is the main advantage of using M-Pesa for crypto offramping in Africa?",
    options: [
      "It's the cheapest option globally",
      "It provides wide accessibility and instant transfers in local currencies",
      "It only works with Bitcoin",
      "It doesn't require any verification"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    reward: 50
  },
  {
    id: 6,
    question: "Which regulatory compliance is most important for crypto-fiat services in Kenya?",
    options: ["SEC regulations", "KYC/AML compliance", "GDPR compliance", "ISO certification"],
    correctAnswer: 1,
    difficulty: 'hard',
    reward: 45
  }
];

interface GameStats {
  totalQuestions: number;
  correctAnswers: number;
  totalEarned: number;
  streak: number;
  bestStreak: number;
}

export default function GameSection() {
  const { address, isConnected } = useAccount();
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    totalEarned: 0,
    streak: 0,
    bestStreak: 0
  });
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);

  useEffect(() => {
    if (isConnected && address) {
      const savedStats = localStorage.getItem(`gameStats_${address}`);
      if (savedStats) {
        setGameStats(JSON.parse(savedStats));
      }
    }
  }, [isConnected, address]);

  const saveGameStats = (newStats: GameStats) => {
    if (address) {
      localStorage.setItem(`gameStats_${address}`, JSON.stringify(newStats));
      setGameStats(newStats);
    }
  };

  const startNewQuestion = () => {
    if (availableQuestions.length === 0) {
      setAvailableQuestions(QUIZ_QUESTIONS);
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const submitAnswer = () => {
    if (!currentQuestion || selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update stats
    const newStats = { ...gameStats };
    newStats.totalQuestions += 1;
    
    if (correct) {
      newStats.correctAnswers += 1;
      newStats.totalEarned += currentQuestion.reward;
      newStats.streak += 1;
      newStats.bestStreak = Math.max(newStats.bestStreak, newStats.streak);
      
      // Add tokens to user's balance
      if (address) {
        const currentTokens = parseInt(localStorage.getItem(`tokens_${address}`) || "0");
        localStorage.setItem(`tokens_${address}`, (currentTokens + currentQuestion.reward).toString());
      }
    } else {
      newStats.streak = 0;
    }

    saveGameStats(newStats);

    // Remove question from available pool
    setAvailableQuestions(prev => prev.filter(q => q.id !== currentQuestion.id));
  };

  const nextQuestion = () => {
    startNewQuestion();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccuracy = () => {
    return gameStats.totalQuestions > 0 ? Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) : 0;
  };

  if (!isConnected) {
    return (
      <Card className="border-2 border-dashed border-primary/50 bg-gradient-to-br from-blue-100 to-purple-100">
        <CardContent className="p-8 text-center">
          <h3 className="fancy-font text-2xl text-primary mb-4">Connect Wallet to Play!</h3>
          <p className="text-muted-foreground">Connect your wallet to start playing quizzes and earning $THECRYPTOBADDIE tokens.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="fancy-font text-4xl text-primary">Crypto Quiz Game</h2>
        <p className="playful-font text-lg text-muted-foreground">Test your knowledge and earn $THECRYPTOBADDIE!</p>
      </div>

      {/* Game Stats */}
      <Card className="bg-gradient-to-r from-blue-200 to-indigo-200 border-primary/30">
        <CardHeader>
          <CardTitle className="playful-font text-2xl text-primary">Your Gaming Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{gameStats.totalQuestions}</p>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{getAccuracy()}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{gameStats.streak}</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{gameStats.totalEarned}</p>
              <p className="text-sm text-muted-foreground">Tokens Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Game */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="playful-font text-xl text-primary">Knowledge Quiz</CardTitle>
          <CardDescription>Answer correctly to earn $THECRYPTOBADDIE tokens!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentQuestion ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Ready to test your crypto knowledge?</p>
              <Button onClick={startNewQuestion} className="bg-primary hover:bg-primary/90 font-bold">
                Start Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty.toUpperCase()}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  +{currentQuestion.reward} $THECRYPTOBADDIE
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{currentQuestion.question}</h3>
                
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className="w-full justify-start p-4 h-auto text-left"
                      onClick={() => !showResult && setSelectedAnswer(index)}
                      disabled={showResult}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>

                {showResult ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </p>
                      {isCorrect ? (
                        <p className="text-green-700">
                          Great job! You earned {currentQuestion.reward} $THECRYPTOBADDIE tokens.
                        </p>
                      ) : (
                        <p className="text-red-700">
                          The correct answer was: {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={nextQuestion} className="flex-1">
                        Next Question
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={submitAnswer} 
                    disabled={selectedAnswer === null}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Bonus */}
      {gameStats.streak > 0 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-yellow-800">Streak Bonus Active!</p>
                <p className="text-sm text-yellow-700">
                  {gameStats.streak} correct answers in a row. Keep going for bonus rewards!
                </p>
              </div>
              <Badge className="bg-yellow-500 text-white font-bold">
                🔥 {gameStats.streak}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}