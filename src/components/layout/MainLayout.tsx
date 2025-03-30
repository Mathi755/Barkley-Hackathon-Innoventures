
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, Key, Shield, User, Users, Home, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Call Verification",
    href: "/verify",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Bot Detection",
    href: "/bot-detection",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Admin Dashboard",
    href: "/admin",
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export function MainLayout({ 
  children, 
  isAuthenticated = false, 
  isAdmin = false 
}: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when changing location
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center mr-4">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-lg font-bold tracking-tight">SpamShield</h1>
          </div>
          
          {/* Mobile menu button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn(
                      "justify-start",
                      isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                    )}
                    onClick={() => navigate(item.href)}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </nav>
          )}
          
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeSwitcher />
            
            {!isAuthenticated ? (
              <Button onClick={() => navigate("/login")}>Login</Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/profile")}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="container py-4 lg:hidden">
          <nav className="flex flex-col space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "justify-start",
                    isActive ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-14">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} SpamShield. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>{" "}
            •{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
