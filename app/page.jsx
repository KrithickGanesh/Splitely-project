import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";

export default function LandingPage() {
  return (
    <div className="flex flex-col pt-16">
      {/* ───── Hero ───── */}
      <section className="mt-20 pb-12 space-y-10 md:space-y-15 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Split expenses. Simplify life.
          </Badge>

          <h1 className="gradient-title mx-auto max-w-6xl text-4xl font-bold md:text-8xl">
            The smartest way to split expenses with friends
          </h1>

          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Track shared expenses, split bills effortlessly, and settle up
            quickly. Never worry about who owes who again.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row justify-center">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl px-8 py-3"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 hover:scale-105 transition-all duration-200 px-8 py-3"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Clean Hero Visual */}
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Quick Stats Cards */}
            <Card className="p-6 text-center border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
              <div className="text-3xl font-bold text-green-600 mb-2">₹0</div>
              <p className="text-sm text-gray-600">Setup Cost</p>
            </Card>
            
            <Card className="p-6 text-center border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <p className="text-sm text-gray-600">Groups & Friends</p>
            </Card>
            
            <Card className="p-6 text-center border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
              <div className="text-3xl font-bold text-green-600 mb-2">AI</div>
              <p className="text-sm text-gray-600">Smart Categorization</p>
            </Card>
          </div>

          {/* Feature Preview */}
          <div className="mt-16 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="flex-1 text-center">
                  <span className="text-white font-medium">Splitely Dashboard</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Recent Expenses</h3>
                <Badge className="bg-green-100 text-green-700">Live Demo</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      🍕
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pizza Night</p>
                      <p className="text-sm text-gray-500">Split between 4 friends</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹48.00</p>
                    <p className="text-sm text-green-600">You owe ₹12.00</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      🚗
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Uber Ride</p>
                      <p className="text-sm text-gray-500">Weekend trip</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹25.50</p>
                    <p className="text-sm text-blue-600">Sarah owes you ₹8.50</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      🏠
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Groceries</p>
                      <p className="text-sm text-gray-500">Roommate expenses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹67.30</p>
                    <p className="text-sm text-gray-500">Settled up</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Features
          </Badge>
          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            Everything you need to split expenses
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Our platform provides all the tools you need to handle shared
            expenses with ease.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card
                key={title}
                className="card flex flex-col items-center space-y-4 p-6 text-center border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`rounded-full p-3 ${bg} transition-transform duration-300 hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            How It Works
          </Badge>
          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            Splitting expenses has never been easier
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Follow these simple steps to start tracking and splitting expenses
            with friends.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {STEPS.map(({ label, title, description }, index) => (
              <div key={label} className="flex flex-col items-center space-y-4 relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-xl font-bold text-white shadow-lg hover:scale-110 transition-transform duration-300">
                  {label}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent -z-10"></div>
                )}
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-gray-600 text-center leading-relaxed max-w-xs">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Testimonials
          </Badge>
          <h2 className="gradient-title mt-2 text-3xl md:text-4xl">
            What our users are saying
          </h2>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, image }) => (
              <Card key={name} className="card flex flex-col justify-between border-gray-100 hover:border-green-200 hover:shadow-xl">
                <CardContent className="space-y-4 p-6">
                  <div className="text-4xl text-green-600 mb-2">"</div>
                  <p className="text-gray-600 italic leading-relaxed">{quote}</p>
                  <div className="flex items-center space-x-3 pt-4">
                    <Avatar className="ring-2 ring-green-100">
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback className="uppercase bg-green-100 text-green-700">
                        {name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{name}</p>
                      <p className="text-sm text-gray-500">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Call‑to‑Action ───── */}
      <section className="py-20 gradient">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
            Ready to simplify expense sharing?
          </h2>
          <p className="mx-auto max-w-[600px] text-green-100 md:text-xl/relaxed">
            Join thousands of users who have made splitting expenses
            stress‑free.
          </p>
          <Button asChild size="lg" className="bg-green-800 hover:opacity-90">
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t bg-gray-50 py-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Splitely. All rights reserved.
      </footer>
    </div>
  );
}
