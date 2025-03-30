
import { useNavigate } from "react-router-dom";
import { Bot, MessageSquare, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";

const features = [
  {
    icon: <Phone className="h-12 w-12 text-primary" />,
    title: "Call Verification",
    description: "Verify unknown callers before answering. Check if a number is flagged as spam or verified as legitimate.",
    action: "Verify a call",
    href: "/verify",
  },
  {
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    title: "Email Protection",
    description: "Scan emails for phishing attempts and scams. Protect yourself from fraudulent messages.",
    action: "Check emails",
    href: "/email-protection",
  },
  {
    icon: <Bot className="h-12 w-12 text-primary" />,
    title: "Bot Detection",
    description: "Analyze voice patterns to detect if you're talking to a bot or a real person.",
    action: "Try bot detection",
    href: "/bot-detection",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
            <span className="text-primary font-medium">New Feature</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Protect Yourself from{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Fraudulent Calls and Emails
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            SpamShield uses advanced AI to detect and block spam calls, identify phishing emails,
            and protect you from fraud.
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/verify")}
            >
              Try Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(feature.href)}
                  >
                    {feature.action}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-24 bg-accent rounded-lg my-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our advanced system uses machine learning to protect you from scams.
              </p>
            </div>
            <div className="grid gap-8 md:gap-12 mt-8 grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Scan</h3>
                <p className="text-muted-foreground text-center">
                  Upload or enter details of suspicious calls or emails.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Analyze</h3>
                <p className="text-muted-foreground text-center">
                  Our AI analyzes patterns and compares with known scams.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Protect</h3>
                <p className="text-muted-foreground text-center">
                  Get instant alerts and recommendations to keep you safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to protect yourself?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of users who trust SpamShield to keep them safe.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/verify")}
              >
                Try Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
