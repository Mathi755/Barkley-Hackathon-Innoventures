import { useState, useEffect } from "react";
import { Bot, PieChart, Shield, User, Users, Activity, Info, Phone, X } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [reportedNumbers, setReportedNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userScans, setUserScans] = useState([]);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (profileData.role !== 'admin') {
          toast({
            title: "Access denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            role,
            avatar_url,
            created_at
          `)
          .order('created_at', { ascending: false });
        
        if (usersError) throw usersError;
        
        const usersWithEmails = await Promise.all(
          usersData.map(async (user) => {
            return {
              ...user,
              email: `user_${user.id.substring(0, 6)}@example.com`,
              last_active: "Recently",
            };
          })
        );
        
        setUsers(usersWithEmails);
        
        const { data: scansData, error: scansError } = await supabase
          .from('scans')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (scansError) throw scansError;
        
        const phoneNumberCounts = scansData.reduce((acc, scan) => {
          const key = scan.phone_number;
          if (!acc[key]) {
            acc[key] = {
              phoneNumber: scan.phone_number,
              reportCount: 0,
              lastReported: null,
              classification: scan.result,
              reportedBy: new Set(),
              scans: [],
            };
          }
          
          acc[key].reportCount += 1;
          acc[key].reportedBy.add(scan.user_id);
          
          const scanDate = new Date(scan.created_at);
          if (!acc[key].lastReported || scanDate > new Date(acc[key].lastReported)) {
            acc[key].lastReported = scan.created_at;
          }
          
          acc[key].scans.push(scan);
          
          return acc;
        }, {});
        
        const reportedNumbersArray = Object.values(phoneNumberCounts).map(item => ({
          ...item,
          id: item.phoneNumber.replace(/\D/g, ''),
          reportedBy: item.reportedBy.size,
        }));
        
        setReportedNumbers(reportedNumbersArray);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Failed to load admin data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  const filteredUsers = users.filter(
    (user) =>
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredReportedNumbers = reportedNumbers.filter(
    (report) =>
      report.phoneNumber.includes(searchTerm)
  );

  const handleViewUser = async (user) => {
    try {
      setSelectedUser(user);
      
      const { data: scansData, error: scansError } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (scansError) throw scansError;
      
      setUserScans(scansData || []);
      setIsUserDetailOpen(true);
    } catch (error) {
      console.error('Error fetching user scans:', error);
      toast({
        title: "Failed to load user data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout isAuthenticated={true} isAdmin={true}>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true} isAdmin={true}>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, view reports, and monitor system performance
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Active registered users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Scans Today
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportedNumbers.reduce((acc, num) => acc + num.reportCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total phone number scans
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unique Numbers
              </CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportedNumbers.length}</div>
              <p className="text-xs text-muted-foreground">
                Unique phone numbers scanned
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Spam Detected
              </CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportedNumbers.filter(r => 
                  r.classification && r.classification.toLowerCase().includes('spam')
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Numbers marked as spam
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle>Administration</CardTitle>
                <CardDescription>
                  Manage users and review reported spam numbers
                </CardDescription>
              </div>
              <div className="w-full sm:w-auto">
                <Input
                  placeholder="Search users or numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="reports">Reported Numbers</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                                  {user.avatar_url ? (
                                    <img 
                                      src={user.avatar_url} 
                                      alt={`${user.first_name || ''} ${user.last_name || ''}`}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <div>{user.first_name && user.last_name 
                                    ? `${user.first_name} ${user.last_name}`
                                    : "Unnamed User"}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                user.role === "admin" ? "destructive" : "outline"
                              }>
                                {user.role || 'user'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                >
                                  View Activity
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            No users found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Reports</TableHead>
                        <TableHead>Classification</TableHead>
                        <TableHead>Last Reported</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReportedNumbers.length > 0 ? (
                        filteredReportedNumbers.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">
                              {report.phoneNumber}
                            </TableCell>
                            <TableCell>
                              {report.reportCount} reports by {report.reportedBy} users
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                report.classification && report.classification.toLowerCase().includes('spam') 
                                  ? "destructive" 
                                  : "success"
                              }>
                                {report.classification || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(report.lastReported).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">Blocked</span>
                                        <Switch checked={report.reportCount > 5} />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Toggle to block or allow this number</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            No reported numbers found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <div className="flex justify-center items-center p-12">
                  <div className="text-center space-y-4">
                    <PieChart className="h-12 w-12 mx-auto text-primary opacity-70" />
                    <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                    <p className="text-muted-foreground max-w-md">
                      Detailed analytics would be displayed here, including user growth, 
                      scan volumes, detection rates, and system performance metrics.
                    </p>
                    <div className="flex justify-center pt-4">
                      <Button>
                        Generate Reports
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                {selectedTab === "users" && filteredUsers.length > 0 && 
                  `Showing ${filteredUsers.length} of ${users.length} users`
                }
                {selectedTab === "reports" && filteredReportedNumbers.length > 0 && 
                  `Showing ${filteredReportedNumbers.length} of ${reportedNumbers.length} reported numbers`
                }
              </div>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardFooter>
        </Card>

        <Sheet open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>User Activity</SheetTitle>
              <SheetDescription>
                {selectedUser && (
                  <div className="flex items-center space-x-3 mt-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                      {selectedUser.avatar_url ? (
                        <img 
                          src={selectedUser.avatar_url} 
                          alt={`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{selectedUser.first_name && selectedUser.last_name 
                        ? `${selectedUser.first_name} ${selectedUser.last_name}`
                        : "Unnamed User"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedUser.email}
                      </div>
                    </div>
                  </div>
                )}
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Phone Number Scans</h3>
              
              {userScans.length > 0 ? (
                <div className="space-y-4">
                  {userScans.map((scan) => (
                    <div key={scan.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="rounded-full p-2 bg-background flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{scan.phone_number}</h4>
                          <Badge variant={
                            scan.result.toLowerCase().includes('spam') ? "destructive" : "success"
                          }>
                            {scan.result}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(scan.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border rounded-lg">
                  <Phone className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No scan history for this user</p>
                </div>
              )}
            </div>
            
            <SheetFooter className="mt-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsUserDetailOpen(false)}
              >
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current performance and health metrics
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium">Operational</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>All systems are functioning normally</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm font-medium">124ms</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Database Load</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full" 
                    style={{ width: "42%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div 
                    className="h-2 bg-amber-500 rounded-full" 
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Admin;
