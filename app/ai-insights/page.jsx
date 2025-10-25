"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Mail, CheckCircle, AlertCircle, Sparkles, TrendingUp, DollarSign } from "lucide-react";

export default function AIInsightsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai-insights', {
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
    <div className="container max-w-5xl mx-auto pt-24 pb-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title flex items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-green-600" />
          AI Financial Insights
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Get your personal financial insights powered by AI. Analyze your own expense data 
          and receive actionable recommendations in your email inbox.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Generate My Personal Financial Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Spending Analysis</h3>
              <p className="text-blue-700 text-sm">AI analyzes your expense patterns</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Saving Tips</h3>
              <p className="text-green-700 text-sm">Personalized money-saving advice</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Email Report</h3>
              <p className="text-purple-700 text-sm">Detailed insights sent to your inbox</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">What you'll get:</h3>
            <ul className="text-amber-800 space-y-1 text-sm">
              <li>• Monthly spending overview and category breakdowns</li>
              <li>• AI-powered insights about your spending habits</li>
              <li>• Personalized money-saving recommendations</li>
              <li>• Positive feedback on your financial management</li>
              <li>• Beautiful HTML email report with all details</li>
            </ul>
          </div>

          <Button 
            onClick={generateInsights} 
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
                <Sparkles className="mr-2 h-4 w-4" />
                Generate My Personal Insights
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
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      AI Processing Summary
                    </h4>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.summary?.processed}</div>
                        <div className="text-gray-600">Users Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{result.summary?.success}</div>
                        <div className="text-gray-600">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{result.summary?.failed}</div>
                        <div className="text-gray-600">Failed</div>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-purple-100 text-purple-800">
                          {result.summary?.modelUsed}
                        </Badge>
                        <div className="text-gray-600 text-xs mt-1">AI Model</div>
                      </div>
                    </div>
                  </div>

                  {result.summary?.results?.map((user, index) => (
                    <div key={index} className="bg-white p-4 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{user.name}</h4>
                        {user.success ? (
                          <Badge className="bg-green-100 text-green-800">✅ Success</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">❌ Failed</Badge>
                        )}
                      </div>
                      
                      {user.success ? (
                        <div className="space-y-2 text-sm">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <span className="font-medium">Email:</span> {user.email}
                            </div>
                            <div>
                              <span className="font-medium">Expenses:</span> {user.expenseCount}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> ₹{user.totalSpent?.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Top Category:</span> {user.topCategory}
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-xs">
                            <span className="font-medium">AI Preview:</span> {user.aiPreview}
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-700 text-sm">
                          <strong>Error:</strong> {user.error}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      {result.instructions?.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))}
                    </ul>
                  </div>

                  <Badge className="mt-3 bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                    <Mail className="h-3 w-3" />
                    Check your email now!
                  </Badge>
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
                <p className="text-red-800 text-sm">{error}</p>
                <div className="mt-3 bg-red-100 p-3 rounded">
                  <p className="text-red-900 font-semibold text-sm">Troubleshooting:</p>
                  <ul className="text-red-800 text-sm mt-1 space-y-1">
                    <li>• Make sure you have added some expenses to your account</li>
                    <li>• Check that your email is set correctly in your profile</li>
                    <li>• Verify your AI configuration at <a href="/check-ai" className="underline">/check-ai</a></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📧 Sample Email Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded text-sm">
            <div className="font-semibold mb-2">Subject: 💡 Your Monthly Spending Insights - Splitely</div>
            <div className="space-y-2 text-gray-700">
              <p>• Monthly spending overview with category breakdowns</p>
              <p>• AI analysis of your spending patterns and habits</p>
              <p>• Personalized money-saving tips and recommendations</p>
              <p>• Positive feedback on what you're doing well financially</p>
              <p>• Beautiful HTML formatting with charts and insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}