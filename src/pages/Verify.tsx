import { useState } from "react";
import { CheckCircle, Phone, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MainLayout } from "@/components/layout/MainLayout";

type VerificationResult = {
  phoneNumber: string;
  status: "safe" | "spam" | "suspicious" | null;
  reportedCount?: number;
  lastReported?: string;
};

const Verify = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, this would be an API call to check the number
    // For now, we'll simulate different responses based on the input
    setTimeout(() => {
      let mockResult: VerificationResult;

      if (phoneNumber.endsWith("1111")) {
        mockResult = {
          phoneNumber,
          status: "spam",
          reportedCount: 47,
          lastReported: "2 hours ago",
        };
      } else if (phoneNumber.endsWith("2222")) {
        mockResult = {
          phoneNumber,
          status: "suspicious",
          reportedCount: 3,
          lastReported: "6 days ago",
        };
      } else {
        mockResult = {
          phoneNumber,
          status: "safe",
        };
      }

      setResult(mockResult);
      setIsLoading(false);
    }, 1500);
  };

  const renderResultCard = () => {
    if (!result) return null;

    const statusConfig = {
      safe: {
        icon: <CheckCircle className="h-16 w-16 text-green-500" />,
        title: "Safe Number",
        description: "This number appears to be legitimate and has no reported spam activity.",
        alertVariant: "default" as const,
        alertTitle: "Safe to Answer",
        alertDescription: "This number has not been reported as spam by our community.",
      },
      spam: {
        icon: <XCircle className="h-16 w-16 text-red-500" />,
        title: "Known Spam",
        description: `This number has been reported as spam ${result.reportedCount} times. Last reported ${result.lastReported}.`,
        alertVariant: "destructive" as const,
        alertTitle: "Warning: Likely Spam",
        alertDescription: "We recommend blocking this number to avoid scam attempts.",
      },
      suspicious: {
        icon: <AlertCircle className="h-16 w-16 text-amber-500" />,
        title: "Potentially Suspicious",
        description: `This number has been reported ${result.reportedCount} times. Last reported ${result.lastReported}.`,
        alertVariant: "default" as const,
        alertTitle: "Exercise Caution",
        alertDescription: "This number has a few reports. Answer with caution.",
      },
    };

    const config = result.status ? statusConfig[result.status] : null;
    if (!config) return null;

    return (
      <Card className="mt-8 w-full max-w-md">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          {config.icon}
          <CardTitle className="mt-4 text-2xl">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={config.alertVariant}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{config.alertTitle}</AlertTitle>
            <AlertDescription>{config.alertDescription}</AlertDescription>
          </Alert>

          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Options:</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Block Number</Button>
              <Button variant="outline" size="sm">Report as Spam</Button>
              <Button variant="outline" size="sm">Add to Contacts</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Call Verification</h1>
          <p className="text-muted-foreground">
            Check if a phone number is known for spam or scam calls
          </p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify a Phone Number</CardTitle>
            <CardDescription>
              Enter a phone number to check if it's been reported as spam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading || !phoneNumber}>
                    {isLoading ? "Checking..." : "Check"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: Try numbers ending in 1111 (spam) or 2222 (suspicious)
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {renderResultCard()}

        <div className="mt-12 p-6 bg-accent rounded-lg w-full">
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Enter any phone number you want to verify</li>
            <li>Our system checks against our database of known spam numbers</li>
            <li>We also analyze reports from our community of users</li>
            <li>You'll receive an instant assessment of the number's risk level</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            For more accurate results, consider creating an account to access our premium features.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Verify;
