"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Brain, Mail, CheckCircle, AlertCircle, Users, Target } from "lucide-react";

export default function SelectiveAIInsightsPage() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load all users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/get-all-users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Error loading users: ' + err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(users.map(user => user._id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const sendSelectedAIInsights = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/selective-ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers
        })
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
    <div className="container max-w-6xl mx-auto pt-24 pb-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-title flex items-center justify-center gap-3">
          <Target className="h-10 w-10 text-blue-600" />
          Selective AI Insights
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Choose specific users to send AI-powered financial insights to. 
          Perfect for managing API limits and targeted testing.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Selection Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Select Users ({selectedUsers.length} selected)
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllUsers}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found in the system
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUsers.includes(user._id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleUserSelection(user._id)}
                    >
                      <Checkbox
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Insights Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Selected Users</h3>
                <div className="text-2xl font-bold text-blue-600">{selectedUsers.length}</div>
                <p className="text-blue-700 text-sm">
                  {selectedUsers.length === 0 
                    ? 'No users selected' 
                    : `Will send ${selectedUsers.length} email${selectedUsers.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-2">⚡ API Usage</h3>
                <div className="text-amber-800 text-sm space-y-1">
                  <p>• Each user = 1 AI request</p>
                  <p>• Free tier: 2 requests/minute</p>
                  <p>• Estimated time: {Math.max(1, Math.ceil(selectedUsers.length / 2))} minute(s)</p>
                </div>
              </div>

              <Button 
                onClick={sendSelectedAIInsights} 
                disabled={isLoading || selectedUsers.length === 0}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending AI Insights...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send AI Insights ({selectedUsers.length})
                  </>
                )}
              </Button>

              <div className="bg-red-50 p-3 rounded-lg">
                <h4 className="font-semibold text-red-900 text-sm mb-1">Rate Limiting</h4>
                <p className="text-red-800 text-xs">
                  35-second delays between users to avoid quota limits
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-900">AI Insights Sent Successfully!</span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Processing Summary
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

              <Badge className="mt-3 bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                <Mail className="h-3 w-3" />
                Check selected user emails for AI insights!
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
    </div>
  );
}