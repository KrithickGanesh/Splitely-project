"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Mail, CheckCircle, AlertCircle, Users, TestTube } from "lucide-react";

export default function TestAIAllUsersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testAIForAllUsers = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-ai-all-users', {
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
          <TestTube className="h-10 w-10 text-purple-600" />
          Test AI Insights - All Users
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Send AI-powered financial insights to ALL users in your platform for testing purposes. 
          Users without expenses will receive sample data analysis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Test AI Insights for All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">All Users</h3>
              <p className="text-purple-700 text-sm">Sends to everyone in platform</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">AI Analysis</h3>
              <p className="text-blue-700 text-sm">Real or sample data analysis</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Test Emails</h3>
              <p className="text-green-700 text-sm">Clearly marked as test</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important Notes:</h3>
            <ul className="text-amber-800 space-y-1 text-sm">
              <li>• This sends emails to ALL users in your platform</li>
              <li>• Users with expenses get real data analysis</li>
              <li>• Users without expenses get sample data for testing</li>
              <li>• Rate limiting applied (35 seconds between users)</li>
              <li>• May take several minutes if you have multiple users</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">🚨 API Quota Warning:</h3>
            <div className="text-red-800 text-sm">
              <p>• Google Gemini free tier: 2 requests per minute</p>
              <p>• If you hit quota limits, wait 60 seconds and try again</p>
              <p>• Consider enabling billing for higher limits</p>
            </div>
          </div>

          <Button 
            onClick={testAIForAllUsers} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing AI for All Users...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Test AI Insights for All Users
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Test AI Insights Sent!</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      Test Summary
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
                        <div className="flex gap-2">
                          {user.success ? (
                            <Badge className="bg-green-100 text-green-800">✅ Success</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">❌ Failed</Badge>
                          )}
                          {user.isTestData && (
                            <Badge className="bg-yellow-100 text-yellow-800">🧪 Sample Data</Badge>
                          )}
                        </div>
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
                    Check all user emails for test insights!
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
                  <p className="text-red-900 font-semibold text-sm">Common Issues:</p>
                  <ul className="text-red-800 text-sm mt-1 space-y-1">
                    <li>• API quota exceeded - wait 60 seconds and try again</li>
                    <li>• Check your Gemini API key is valid</li>
                    <li>• Make sure users exist in your platform</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}