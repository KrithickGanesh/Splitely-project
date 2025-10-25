"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testEmail = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
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
    <div className="container max-w-4xl mx-auto pt-24 pb-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title flex items-center justify-center gap-3">
          <Mail className="h-10 w-10 text-blue-600" />
          Test Email System
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Test if the email system is working properly by sending a test email to your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Send Test Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What this test does:</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Checks if you're properly authenticated</li>
              <li>• Verifies your user details in the database</li>
              <li>• Tests the email sending functionality</li>
              <li>• Sends a simple test email to your registered email</li>
            </ul>
          </div>

          <Button 
            onClick={testEmail} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Test Email...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Test Email Sent Successfully!</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-semibold mb-2">Your Details:</h4>
                    <p><strong>Name:</strong> {result.user?.name}</p>
                    <p><strong>Email:</strong> {result.user?.email}</p>
                    <p><strong>User ID:</strong> {result.user?.userId}</p>
                  </div>
                  
                  <div className="bg-green-100 p-3 rounded">
                    <p className="text-green-800 font-medium">✅ Check your email inbox!</p>
                    <p className="text-green-700 text-sm">If you received the test email, the system is working properly.</p>
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
                <p className="text-red-800 text-sm">{error}</p>
                <div className="mt-3 bg-red-100 p-3 rounded">
                  <p className="text-red-900 font-semibold text-sm">Possible Issues:</p>
                  <ul className="text-red-800 text-sm mt-1 space-y-1">
                    <li>• Not logged in to Splitely</li>
                    <li>• Email service configuration issue</li>
                    <li>• Network connectivity problem</li>
                    <li>• Invalid email address in your profile</li>
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