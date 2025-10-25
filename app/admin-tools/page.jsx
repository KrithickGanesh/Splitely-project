"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Mail, 
  Users, 
  Target, 
  TestTube, 
  Settings, 
  Sparkles,
  CreditCard,
  CheckCircle
} from "lucide-react";

export default function AdminToolsPage() {
  return (
    <div className="container max-w-6xl mx-auto pt-24 pb-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title flex items-center justify-center gap-3">
          <Settings className="h-10 w-10 text-gray-600" />
          Admin Tools & Testing
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Administrative tools and testing interfaces for managing your Splitely platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Insights Tools */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Brain className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Generate and send AI-powered financial insights to users.
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/ai-insights">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Regular AI Insights
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/selective-ai-insights">
                  <Target className="mr-2 h-4 w-4" />
                  Selective AI Insights
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/test-ai-all-users">
                  <TestTube className="mr-2 h-4 w-4" />
                  Test All Users
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Email Tools */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <CreditCard className="h-5 w-5" />
              Payment Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Send payment reminders and manage user debts.
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/payment-reminders">
                  <Mail className="mr-2 h-4 w-4" />
                  Payment Reminders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Testing */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              System Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Test system components and API integrations.
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/check-ai">
                  <Brain className="mr-2 h-4 w-4" />
                  Check AI Status
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/simple-ai-test">
                  <TestTube className="mr-2 h-4 w-4" />
                  Simple AI Test
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/test-ai">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Advanced AI Test
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Quick Access Links</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Main App:</strong>
                  <ul className="text-blue-700 space-y-1 mt-1">
                    <li>• <Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
                    <li>• <Link href="/expenses/new" className="hover:underline">Add Expense</Link></li>
                    <li>• <Link href="/contacts" className="hover:underline">Contacts</Link></li>
                  </ul>
                </div>
                <div>
                  <strong>API Endpoints:</strong>
                  <ul className="text-blue-700 space-y-1 mt-1">
                    <li>• <Link href="/api/test-gemini-key" className="hover:underline">Test Gemini Key</Link></li>
                    <li>• <Link href="/api/get-all-users" className="hover:underline">Get All Users</Link></li>
                    <li>• <Link href="/api/refresh-balances" className="hover:underline">Refresh Balances</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}