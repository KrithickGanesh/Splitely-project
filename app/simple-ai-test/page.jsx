"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, CheckCircle, AlertCircle, Zap } from "lucide-react";

export default function SimpleAITestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testAI = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/simple-ai-test', {
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
        <h1 className="text-4xl font-bold gradient-title">🧪 Simple AI Test</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test the AI functionality with sample data to make sure everything works before using real expenses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick AI Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">This test will:</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Use sample expense data (no real data needed)</li>
              <li>• Test Google Gemini AI connection</li>
              <li>• Generate financial insights</li>
              <li>• Show you exactly what the AI produces</li>
            </ul>
          </div>

          <Button 
            onClick={testAI} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing AI...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Test AI Now
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">AI Test Successful!</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Badge className="mb-2">Model Used: {result.model}</Badge>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">Sample Data Used:</h4>
                      <div className="text-sm space-y-1">
                        {result.sampleData?.expenses?.map((expense, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{expense.description}</span>
                            <span>₹{expense.amount} ({expense.category})</span>
                          </div>
                        ))}
                        <div className="border-t pt-1 font-semibold">
                          Total: ₹{result.sampleData?.totalSpent}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">🤖 AI Generated Insights:</h4>
                    <div className="bg-white p-4 rounded border">
                      <div className="whitespace-pre-wrap text-sm">
                        {result.aiResponse}
                      </div>
                    </div>
                  </div>
                </div>
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
                <div className="text-red-800 text-sm space-y-2">
                  <p><strong>Error:</strong> {error}</p>
                  <div className="bg-red-100 p-3 rounded">
                    <p className="font-semibold">Troubleshooting:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Check if GEMINI_API_KEY is set in .env.local</li>
                      <li>• Verify your Gemini API key is valid</li>
                      <li>• Make sure you have API quota remaining</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>🎉 Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✅ Your AI is working perfectly!</p>
              <p>Now you can:</p>
              <ul className="space-y-1 ml-4">
                <li>• Add real expenses to your dashboard</li>
                <li>• Use the full AI insights feature</li>
                <li>• Get personalized financial recommendations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}