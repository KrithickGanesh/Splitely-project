"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function TestAIPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const triggerAITest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title">🤖 AI Testing Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test Splitely's AI-powered spending insights. The AI will analyze your expenses 
          and send personalized financial recommendations to your email.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-600" />
            AI Spending Insights Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What this test does:</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Analyzes your recent expenses using Google Gemini AI</li>
              <li>• Generates personalized spending insights and recommendations</li>
              <li>• Sends a detailed HTML email report to your registered email</li>
              <li>• Provides category breakdowns and saving opportunities</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">Prerequisites:</h3>
            <ul className="text-amber-800 space-y-1 text-sm">
              <li>• Make sure you have added some expenses to your account</li>
              <li>• Check that your email is correctly set in your profile</li>
              <li>• The AI needs at least 2-3 expenses to generate meaningful insights</li>
            </ul>
          </div>

          <Button 
            onClick={triggerAITest} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating AI Insights...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Test AI Spending Insights
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">AI Insights Generated Successfully!</span>
                </div>
                <div className="space-y-3 text-sm text-green-800">
                  {result.summary && (
                    <div className="bg-white p-3 rounded border">
                      <p><strong>Summary:</strong></p>
                      <ul className="mt-1 space-y-1">
                        <li>• Processed: {result.summary.processed} users</li>
                        <li>• Successful: {result.summary.success}</li>
                        <li>• Failed: {result.summary.failed}</li>
                      </ul>
                      {result.summary.results?.map((r, i) => (
                        <div key={i} className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>{r.name}</strong> ({r.email})
                          {r.success ? (
                            <div className="text-green-700">
                              ✅ {r.expenseCount} expenses analyzed, ₹{r.totalSpent?.toFixed(2)} total
                            </div>
                          ) : (
                            <div className="text-red-700">❌ {r.error}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <strong>Next Steps:</strong>
                    <ul className="mt-1 space-y-1 ml-4">
                      {result.instructions?.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Badge className="mt-3 bg-green-100 text-green-800">
                  <Mail className="mr-1 h-3 w-3" />
                  Check your email now!
                </Badge>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900">Error</span>
                </div>
                <p className="text-red-800 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📧 What to Expect in Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>Subject:</strong> 🤖 Your AI-Powered Monthly Spending Insights - Splitely</p>
            <p><strong>Content includes:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Monthly spending overview and totals</li>
              <li>• Top spending categories analysis</li>
              <li>• Unusual spending pattern detection</li>
              <li>• Personalized saving opportunities</li>
              <li>• Recommendations for next month</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}