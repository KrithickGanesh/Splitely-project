"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Key, Brain, List } from "lucide-react";

export default function CheckAIPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkGemini = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/check-gemini');
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      setError({ error: err.message, solution: "Check your internet connection" });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-check on page load
  useEffect(() => {
    checkGemini();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title">🔧 AI Diagnostics</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Check your Gemini AI configuration and find the right model to use.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            Gemini API Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={checkGemini} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking API...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Check Gemini API
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">API Working!</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Badge className="mb-2 bg-green-100 text-green-800">
                      Status: {result.apiKeyStatus}
                    </Badge>
                    <p className="text-green-800 text-sm">{result.message}</p>
                  </div>

                  {result.workingModel && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">✅ Working Model Found:</h4>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {result.workingModel}
                      </p>
                      {result.testResponse && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Test Response:</p>
                          <p className="text-sm italic">"{result.testResponse}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {result.availableModels && (
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <List className="h-4 w-4" />
                        Available Models:
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {result.availableModels.map((model, index) => (
                          <div key={index} className="text-sm border-l-2 border-blue-200 pl-3">
                            <p className="font-mono text-xs">{model.name}</p>
                            <p className="text-gray-600">{model.displayName}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.recommendedModel && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-blue-900 font-semibold">Recommended Model:</p>
                      <p className="font-mono text-sm">{result.recommendedModel}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900">API Issue</span>
                </div>
                <div className="text-red-800 text-sm space-y-2">
                  <p><strong>Error:</strong> {error.error}</p>
                  <p><strong>Status:</strong> {error.apiKeyStatus}</p>
                  {error.solution && (
                    <div className="bg-red-100 p-3 rounded">
                      <p className="font-semibold">Solution:</p>
                      <p>{error.solution}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔑 How to Fix API Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">1. Get a new API key:</p>
              <p>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-600 underline">Google AI Studio</a> and create a new API key</p>
            </div>
            <div>
              <p className="font-semibold">2. Update your .env.local file:</p>
              <p className="font-mono bg-gray-100 p-2 rounded">GEMINI_API_KEY=your_new_key_here</p>
            </div>
            <div>
              <p className="font-semibold">3. Restart your development server:</p>
              <p className="font-mono bg-gray-100 p-2 rounded">npm run dev</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}