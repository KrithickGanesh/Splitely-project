"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, CheckCircle, AlertCircle, Bug } from "lucide-react";

export default function DebugEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [directLoading, setDirectLoading] = useState(false);
  const [debugResult, setDebugResult] = useState(null);
  const [directResult, setDirectResult] = useState(null);
  const [error, setError] = useState(null);

  const debugEmailConfig = async () => {
    setIsLoading(true);
    setError(null);
    setDebugResult(null);

    try {
      const response = await fetch('/api/debug-email');
      const data = await response.json();
      setDebugResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectEmail = async () => {
    setDirectLoading(true);
    setError(null);
    setDirectResult(null);

    try {
      const response = await fetch('/api/direct-email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setDirectResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDirectLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto pt-24 pb-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title flex items-center justify-center gap-3">
          <Bug className="h-10 w-10 text-red-600" />
          Debug Email System
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Debug the email configuration to find out why emails aren't being delivered.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Debug Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-600" />
              Debug Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Check email service configuration and API key status.
            </p>

            <Button 
              onClick={debugEmailConfig} 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Debugging...
                </>
              ) : (
                <>
                  <Bug className="mr-2 h-4 w-4" />
                  Debug Email Config
                </>
              )}
            </Button>

            {debugResult && (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <h4 className="font-semibold mb-2">Configuration Status:</h4>
                  <p><strong>API Key:</strong> {debugResult.debug?.hasApiKey ? '✅ Present' : '❌ Missing'}</p>
                  <p><strong>Key Length:</strong> {debugResult.debug?.apiKeyLength}</p>
                  <p><strong>Key Prefix:</strong> {debugResult.debug?.apiKeyPrefix}</p>
                </div>

                {debugResult.debug?.resendTest && (
                  <div className={`p-3 rounded text-sm ${
                    debugResult.debug.resendTest.success ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <h4 className="font-semibold mb-2">Resend API Test:</h4>
                    <p><strong>Status:</strong> {debugResult.debug.resendTest.success ? '✅ Success' : '❌ Failed'}</p>
                    {debugResult.debug.resendTest.result && (
                      <pre className="text-xs mt-2 overflow-auto">
                        {JSON.stringify(debugResult.debug.resendTest.result, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Direct Email Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Direct Email Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send email directly through Resend API (bypassing Convex).
            </p>

            <Button 
              onClick={testDirectEmail} 
              disabled={directLoading}
              className="w-full"
            >
              {directLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Direct Email...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Direct Email Test
                </>
              )}
            </Button>

            {directResult && (
              <div className={`p-3 rounded text-sm ${
                directResult.success ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {directResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-semibold">
                    {directResult.success ? 'Email Sent!' : 'Email Failed'}
                  </span>
                </div>
                
                {directResult.success && (
                  <div>
                    <p><strong>Email ID:</strong> {directResult.emailId}</p>
                    <p className="text-green-700 mt-2">Check your email inbox!</p>
                  </div>
                )}

                {directResult.debug && (
                  <div className="mt-3">
                    <h5 className="font-semibold">Debug Info:</h5>
                    <pre className="text-xs mt-1 overflow-auto">
                      {JSON.stringify(directResult.debug, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Email Troubleshooting</h3>
              <div className="text-sm text-yellow-800 space-y-1">
                <p><strong>Common Issues:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Invalid or expired Resend API key</li>
                  <li>Email domain not verified in Resend</li>
                  <li>Rate limiting or quota exceeded</li>
                  <li>Email going to spam folder</li>
                  <li>Incorrect sender email format</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}