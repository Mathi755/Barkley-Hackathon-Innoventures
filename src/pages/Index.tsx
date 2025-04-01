import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaRobot, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";

const features = [
  {
    icon: <FaPhoneAlt className="h-12 w-12 text-primary" />,
    title: "Call Verification",
    description: "Verify unknown callers before answering. Check if a number is flagged as spam or verified as legitimate.",
    action: "Verify a call",
    href: "/verify",
  },
  {
    icon: <FaEnvelope className="h-12 w-12 text-primary" />,
    title: "Email Protection",
    description: "Scan emails for phishing attempts and scams. Protect yourself from fraudulent messages.",
    action: "Check emails",
    href: "/email-protection",
  },
  {
    icon: <FaRobot className="h-12 w-12 text-primary" />,
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
      <motion.section
        className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <motion.div
            className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">New Feature</span>
          </motion.div>
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
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/verify")}>
              Try Now
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-12 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" onClick={() => navigate(feature.href)}>
                      {feature.action}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-12 md:py-24 bg-accent rounded-lg my-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
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
              <motion.div
                className="flex flex-col items-center space-y-4"
                whileHover={{ scale: 1.1 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FaShieldAlt className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Scan</h3>
                <p className="text-muted-foreground text-center">
                  Upload or enter details of suspicious calls or emails.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-4"
                whileHover={{ scale: 1.1 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FaRobot className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Analyze</h3>
                <p className="text-muted-foreground text-center">
                  Our AI analyzes patterns and compares with known scams.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center space-y-4"
                whileHover={{ scale: 1.1 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FaPhoneAlt className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Protect</h3>
                <p className="text-muted-foreground text-center">
                  Get instant alerts and recommendations to keep you safe.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
{/* Creators Section */}
<motion.section
  className="py-12 md:py-24 bg-accent rounded-lg my-12"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.6 }}
>
  <div className="container px-4 md:px-6">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Meet the Creators
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          The talented individuals behind SpamShield.
        </p>
      </div>
      <div className="grid gap-8 md:gap-12 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {[
          { name: "Nishtha Goyal", photo: "/images/Nishtha.jpg" },
          { name: "Aman Deep Singh", photo: "/images/Aman.png" },
          { name: "Arjun Dogra", photo: "/images/Arjun.jpeg" },
          { name: "Dron Haritwal", photo: "/images/Dron.jpeg" },
          { name: "Gomathi Nayagam", photo: "/images/Mathi.JPG" },
        ].map((creator, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center space-y-4 bg-primary/10 p-6 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={creator.photo}
              alt={creator.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            <h3 className="text-lg font-bold">{creator.name}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</motion.section>
      {/* CTA Section */}
      <motion.section
        className="py-12 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
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
              <Button size="lg" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/verify")}>
                Try Now
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </MainLayout>
  );
};

export default Index;