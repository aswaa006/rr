import { useEffect, useMemo, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Shield, CheckCircle2, XCircle, Clock, MapPin } from "lucide-react";

type HeroApplication = {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseUrl: string;
  agreed: boolean;
  submittedAt: number;
  status?: "pending" | "approved" | "rejected";
};

type PreBookRide = {
  id: number;
  username: string;
  pickup: string;
  drop_location: string;
  scheduled_date: string;
  scheduled_time: string;
  scheduled_datetime: string;
  created_at: string;
  status: string;
};

import { getAllDriverApplications, updateDriverApplicationStatus } from '@/services/supabaseService';

// Fetch hero applications from Supabase - called only after login + secret unlocked
async function fetchHeroApplications(): Promise<HeroApplication[]> {
  const applications = await getAllDriverApplications();
  return applications.map(app => ({
    id: app.id || '',
    name: app.name,
    phone: app.phone,
    vehicleType: app.vehicleType,
    vehicleNumber: app.vehicleNumber,
    licenseUrl: app.licenseFileUrl || '',
    agreed: app.agreed,
    submittedAt: new Date(app.submittedAt).getTime(),
    status: app.status
  }));
}

// Update application status via Supabase
async function updateApplicationStatus(id: string, status: "approved" | "rejected") {
  return await updateDriverApplicationStatus(id, status);
}

// Fetch pre-booked rides from backend
async function fetchPreBookRides(): Promise<PreBookRide[]> {
  try {
    const response = await fetch('http://localhost:4000/api/prebook');
    if (!response.ok) {
      throw new Error('Failed to fetch pre-booked rides');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pre-booked rides:', error);
    return [];
  }
}

// Update pre-book ride status
async function updatePreBookStatus(id: number, status: string) {
  try {
    const response = await fetch(`http://localhost:4000/api/prebook/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating pre-book status:', error);
    return false;
  }
}

export default function AdminDashboard() {
  const { isAuthenticated, token } = useAdminAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const bufferRef = useRef<string[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<HeroApplication[]>([]);
  const [preBookRides, setPreBookRides] = useState<PreBookRide[]>([]);
  const [preBookLoading, setPreBookLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      bufferRef.current = [...bufferRef.current, key].slice(-5);
      if (bufferRef.current.join("") === "11223") {
        setSecretUnlocked(true);
        setLoginOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Critical fix: fetch only when secret unlocked AND admin is authenticated
  useEffect(() => {
    if (!secretUnlocked || !isAuthenticated) return;
    (async () => {
      setLoading(true);
      setPreBookLoading(true);
      try {
        const [heroData, preBookData] = await Promise.all([
          fetchHeroApplications(),
          fetchPreBookRides()
        ]);
        setApps(heroData);
        setPreBookRides(preBookData);
      } catch {
        setApps([]);
        setPreBookRides([]);
      } finally {
        setLoading(false);
        setPreBookLoading(false);
      }
    })();
  }, [secretUnlocked, isAuthenticated]);

  const hasData = useMemo(() => apps.length > 0, [apps]);
  const hasPreBookData = useMemo(() => preBookRides.length > 0, [preBookRides]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {!secretUnlocked && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Admin Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section is protected. Press the secret sequence to continue.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Hint: 3 digits ascending from 6 but typed in reverse.
              </p>
            </CardContent>
          </Card>
        )}

        {secretUnlocked && !isAuthenticated && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Log in to access the dashboard.</p>
              <Button className="mt-4" onClick={() => setLoginOpen(true)}>Open Login</Button>
            </CardContent>
          </Card>
        )}

        {secretUnlocked && isAuthenticated && (
          <Tabs defaultValue="heroes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="heroes">Hero Applications</TabsTrigger>
              <TabsTrigger value="prebook">Pre-Booked Rides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="heroes">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && <p>Loading applications...</p>}
                  {!loading && !hasData && (
                    <p className="text-muted-foreground">No applications found.</p>
                  )}
                  {!loading && hasData && (
                    <div className="w-full overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>License</TableHead>
                            <TableHead>Agreed</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {apps.map(app => (
                            <TableRow key={app.id}>
                              <TableCell className="font-medium">{app.name}</TableCell>
                              <TableCell>{app.phone}</TableCell>
                              <TableCell>{app.vehicleType} • {app.vehicleNumber}</TableCell>
                              <TableCell>
                                <a className="text-primary underline" href={app.licenseUrl} target="_blank" rel="noreferrer">View</a>
                              </TableCell>
                              <TableCell>{app.agreed ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                              <TableCell>{new Date(app.submittedAt).toLocaleString()}</TableCell>
                              <TableCell>
                                {app.status === "approved" && <Badge className="bg-emerald-600 hover:bg-emerald-600">Approved</Badge>}
                                {app.status === "rejected" && <Badge className="bg-red-600 hover:bg-red-600">Rejected</Badge>}
                                {!app.status || app.status === "pending" ? <Badge variant="outline">Pending</Badge> : null}
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={async () => {
                                    await updateApplicationStatus(app.id, 'approved');
                                    setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'approved' } : a));
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={async () => {
                                    await updateApplicationStatus(app.id, 'rejected');
                                    setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a));
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prebook">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-Booked Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  {preBookLoading && <p>Loading pre-booked rides...</p>}
                  {!preBookLoading && !hasPreBookData && (
                    <p className="text-muted-foreground">No pre-booked rides found.</p>
                  )}
                  {!preBookLoading && hasPreBookData && (
                    <div className="w-full overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Scheduled Date</TableHead>
                            <TableHead>Scheduled Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {preBookRides.map(ride => (
                            <TableRow key={ride.id}>
                              <TableCell className="font-medium">{ride.username}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-sm">{ride.pickup} → {ride.drop_location}</span>
                                </div>
                              </TableCell>
                              <TableCell>{new Date(ride.scheduled_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-sm">{ride.scheduled_time}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={ride.status === 'pending' ? 'outline' : ride.status === 'confirmed' ? 'default' : 'secondary'}>
                                  {ride.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(ride.created_at).toLocaleString()}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={async () => {
                                    const success = await updatePreBookStatus(ride.id, 'confirmed');
                                    if (success) {
                                      setPreBookRides(prev => prev.map(r => r.id === ride.id ? { ...r, status: 'confirmed' } : r));
                                    }
                                  }}
                                  disabled={ride.status === 'confirmed'}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" /> Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={async () => {
                                    const success = await updatePreBookStatus(ride.id, 'cancelled');
                                    if (success) {
                                      setPreBookRides(prev => prev.map(r => r.id === ride.id ? { ...r, status: 'cancelled' } : r));
                                    }
                                  }}
                                  disabled={ride.status === 'cancelled'}
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Cancel
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
      <AdminLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
