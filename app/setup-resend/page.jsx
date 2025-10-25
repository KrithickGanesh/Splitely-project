"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, CheckCircle, AlertTriangle } from "lucide-react";

export default function SetupResendPage() {
  return (
    <div className="container max-w-4xl mx-auto pt-24 pb-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title flex items-center justify-center gap-3">
          <Mail className="h-10 w-10 text-blue-600" />
          Setup Resend for Production
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Configure Resend to send emails to any address by verifying a domain.
        </p>
      </div>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Current Limitation</h3>
              <p className="text-yellow-800 text-sm">
                Resend is in testing mode and can only send emails to <strong>unnamedmonster7@gmail.com</strong>. 
                To send emails to any address (like krithickganesh1637@gmail.com), you need to verify a domain.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Step 1: Verify Domain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add and verify a domain in your Resend account.
            </p>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded text-sm">
                <h4 className="font-semibold mb-2">Options:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Use Vercel domain:</strong> splitely.vercel.app</li>
                  <li>• <strong>Use your own domain:</strong> yourdomain.com</li>
                  <li>• <strong>Use subdomain:</strong> mail.yourdomain.com</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <a 
                  href="https://resend.com/domains" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Resend Domains
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Step 2: Update Sender Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              After verifying your domain, update the sender email in your code.
            </p>
            
            <div className="bg-gray-50 p-3 rounded text-sm">
              <h4 className="font-semibold mb-2">Current:</h4>
              <code className="text-red-600">delivered@resend.dev</code>
              
              <h4 className="font-semibold mb-2 mt-3">Change to:</h4>
              <code className="text-green-600">noreply@yourdomain.com</code>
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm">
              <h4 className="font-semibold text-blue-900 mb-1">Files to update:</h4>
              <ul className="text-blue-800 space-y-1">
                <li>• <code>convex/email.js</code></li>
                <li>• <code>app/api/*/route.js</code> (email endpoints)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">1. Add Domain in Resend</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://resend.com/domains" className="text-blue-600 hover:underline" target="_blank">resend.com/domains</a></li>
                  <li>Click "Add Domain"</li>
                  <li>Enter your domain (e.g., splitely.vercel.app)</li>
                  <li>Copy the DNS records provided</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Add DNS Records</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to your domain provider (Vercel, Cloudflare, etc.)</li>
                  <li>Add the DNS records from Resend</li>
                  <li>Wait for DNS propagation (up to 24 hours)</li>
                  <li>Verify domain in Resend dashboard</li>
                </ol>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold text-green-900 mb-2">✅ After Domain Verification:</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Send emails to any address (not just unnamedmonster7@gmail.com)</li>
                <li>• All users can receive AI insights in their own email</li>
                <li>• Payment reminders work for everyone</li>
                <li>• Professional sender email (noreply@yourdomain.com)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}