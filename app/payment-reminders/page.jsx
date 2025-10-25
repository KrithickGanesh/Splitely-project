"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, CheckCircle, AlertCircle, CreditCard, Clock, Users } from "lucide-react";

export default function PaymentRemindersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testReminders = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-payment-reminders', {
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
          <CreditCard className="h-10 w-10 text-red-600" />
          Payment Reminders
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Automatically send email reminders to users who have outstanding debts. 
          Keep everyone accountable and ensure settlements happen on time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Send Payment Reminder Emails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <CreditCard className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-red-900">Outstanding Debts</h3>
              <p className="text-red-700 text-sm">Find users who owe money</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Email Reminders</h3>
              <p className="text-blue-700 text-sm">Send beautiful HTML emails</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Automated</h3>
              <p className="text-green-700 text-sm">Runs daily at 10 AM UTC</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Payment reminder emails include:</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Complete list of who they owe money to</li>
              <li>• Individual amounts and total debt</li>
              <li>• Beautiful HTML formatting with tables</li>
              <li>• Settlement tips and payment suggestions</li>
              <li>• Professional branding and clear call-to-action</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">Automatic Schedule:</h3>
            <div className="text-amber-800 text-sm">
              <p>• <strong>Daily reminders:</strong> Every day at 10:00 AM UTC</p>
              <p>• <strong>Smart filtering:</strong> Only sends to users with actual debts</p>
              <p>• <strong>No spam:</strong> Skips users with zero balances</p>
            </div>
          </div>

          <Button 
            onClick={testReminders} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Payment Reminders...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Test Payment Reminders Now
              </>
            )}
          </Button>

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Payment Reminders Sent!</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Processing Summary
                    </h4>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.summary?.processed}</div>
                        <div className="text-gray-600">Users Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{result.summary?.success}</div>
                        <div className="text-gray-600">Emails Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{result.summary?.failed}</div>
                        <div className="text-gray-600">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{result.summary?.skipped}</div>
                        <div className="text-gray-600">Skipped</div>
                      </div>
                    </div>
                  </div>

                  {result.summary?.results?.map((user, index) => (
                    <div key={index} className="bg-white p-4 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{user.name}</h4>
                        {user.success ? (
                          <Badge className="bg-green-100 text-green-800">✅ Email Sent</Badge>
                        ) : user.skipped ? (
                          <Badge className="bg-gray-100 text-gray-800">⏭️ Skipped</Badge>
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
                              <span className="font-medium">Debts:</span> {user.debtCount}
                            </div>
                            <div>
                              <span className="font-medium">Total Owed:</span> 
                              <span className="text-red-600 font-semibold"> ₹{user.totalOwed?.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="font-medium">Owes money to:</span>
                            <div className="mt-1 space-y-1">
                              {user.debts?.map((debt, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <span>{debt.name}</span>
                                  <span className="text-red-600">₹{debt.amount.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : user.skipped ? (
                        <div className="text-gray-600 text-sm">
                          No outstanding debts - reminder not needed
                        </div>
                      ) : (
                        <div className="text-red-700 text-sm">
                          <strong>Error:</strong> {user.error}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-semibold text-blue-900 mb-2">What happens next:</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      {result.instructions?.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))}
                    </ul>
                  </div>

                  <Badge className="mt-3 bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                    <Mail className="h-3 w-3" />
                    Check your email for payment reminders!
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
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📧 Sample Payment Reminder Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded text-sm">
            <div className="font-semibold mb-2">Subject: 💳 Payment Reminder: You owe ₹45.50 - Splitely</div>
            <div className="space-y-2 text-gray-700">
              <p>• Professional header with payment reminder branding</p>
              <p>• Personal greeting with total amount owed</p>
              <p>• Detailed table showing who they owe and how much</p>
              <p>• Running total of all outstanding debts</p>
              <p>• Settlement tips and payment suggestions</p>
              <p>• Clean, professional HTML formatting</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}