import { useState, useEffect } from "react";
import { Bell, Bot, Phone, Shield, User, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ProfilePhotoUpload = ({ userId, avatarUrl, onUploadSuccess }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarPath, setAvatarPath] = useState(avatarUrl);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile_photos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("profile_photos")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Update the avatar_url in the profiles table
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      setAvatarPath(publicUrl);
      onUploadSuccess(publicUrl);

      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      setUploading(true);

      // Reset the avatar_url in the profiles table
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", userId);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      setAvatarPath(null);
      onUploadSuccess(null);

      toast({
        title: "Photo deleted",
        description: "Your profile photo has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-24 w-24 rounded-full relative mb-4 overflow-hidden bg-muted">
        {avatarPath ? (
          <img
            src={avatarPath}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-12 w-12 text-primary" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
          <Label
            htmlFor="avatar-upload"
            className="cursor-pointer flex items-center justify-center w-full h-full"
          >
            <Camera className="h-8 w-8 text-white" />
            <span className="sr-only">Upload photo</span>
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={uploadAvatar}
          />
        </div>
      </div>
      <div className="text-center space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => document.getElementById("avatar-upload").click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Change Photo"}
        </Button>
        {avatarPath && (
          <Button
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={deleteAvatar}
            disabled={uploading}
          >
            {uploading ? "Deleting..." : "Delete Photo"}
          </Button>
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    callScreening: true,
    newFeatures: true,
  });
  const [userScans, setUserScans] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (profileData) {
          setProfile(profileData);
          setEditedProfile(profileData);
        } else {
          const defaultProfile = {
            id: session.user.id,
            first_name: '',
            last_name: '',
            avatar_url: null,
          };
          setProfile(defaultProfile);
          setEditedProfile(defaultProfile);
        }

        const { data: scansData, error: scansError } = await supabase
          .from('scans')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (scansError) {
          throw scansError;
        }
        
        setUserScans(scansData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Failed to load profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (session && event === 'SIGNED_IN') {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          avatar_url: editedProfile.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleAvatarUpload = (url) => {
    setEditedProfile({
      ...editedProfile,
      avatar_url: url,
    });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true} isAdmin={profile?.role === 'admin'}>
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="flex-1">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ProfilePhotoUpload 
                userId={user?.id} 
                avatarUrl={profile?.avatar_url} 
                onUploadSuccess={handleAvatarUpload}
              />

              <Separator className="my-4" />

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Full Name
                    </h4>
                    <p>{profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : "Not set"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Email
                    </h4>
                    <p>{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={editedProfile?.first_name || ''}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={editedProfile?.last_name || ''}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, last_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleLogout}>
                Sign Out
              </Button>
            </CardFooter>
          </Card>

          <div className="flex-1">
            <Tabs defaultValue="notifications">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive spam detection alerts via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailAlerts}
                        onCheckedChange={() => handleNotificationChange("emailAlerts")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive spam detection alerts via SMS
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsAlerts}
                        onCheckedChange={() => handleNotificationChange("smsAlerts")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Call Screening Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Get real-time alerts during calls
                        </p>
                      </div>
                      <Switch
                        checked={notifications.callScreening}
                        onCheckedChange={() => handleNotificationChange("callScreening")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">New Features</h4>
                        <p className="text-sm text-muted-foreground">
                          Stay updated on new features and improvements
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newFeatures}
                        onCheckedChange={() => handleNotificationChange("newFeatures")}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Password</h4>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Connected Devices</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage devices that are logged into your account
                      </p>
                      <Button variant="link" className="p-0 h-auto">
                        View Devices
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your recent number scans and results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userScans.length > 0 ? (
                userScans.map((scan) => (
                  <div key={scan.id} className="flex items-start space-x-4 p-3 rounded-lg bg-accent/50">
                    <div className="rounded-full p-2 bg-background flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{scan.phone_number}</h4>
                        <div className="flex items-center">
                          <Badge variant={
                            scan.result.includes("Spam") ? "destructive" : 
                            scan.result.includes("Safe") ? "success" : 
                            "secondary"
                          }>
                            {scan.result}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(scan.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Phone className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No scan history yet</p>
                  <Button 
                    onClick={() => navigate('/verify')} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Go to Call Verification
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          {userScans.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full">View All Scans</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
