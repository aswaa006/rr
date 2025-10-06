import { useEffect, useMemo, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

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

import { getAllDriverApplications, updateDriverApplicationStatus } from '@/services/supabaseService';

// Fetch hero applications from Supabase
async function fetchHeroApplications(): Promise<HeroApplication[]> {
  const applications = await getAllDriverApplications();
  return applications.map(app => ({
    id: app.id || '',
    name: app.name,
    phone: app.phone,
    vehicleType: app.vehicle_type,
    vehicleNumber: app.vehicle_number,
    licenseUrl: app.license_file_url || '',
    agreed: app.agreed,
    submittedAt: new Date(app.submitted_at).getTime(),
    status: app.status
  }));
}

// Update application status via Supabase
async function updateApplicationStatus(id: string, status: "approved" | "rejected") {
  return await updateDriverApplicationStatus(id, status);
}

export default function AdminDashboard() {
  const { isAuthenticated, token } = useAdminAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const bufferRef = useRef<string[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<HeroApplication[]>([]);

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

  useEffect(() => {
    if (!secretUnlocked) return;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchHeroApplications();
        setApps(data);
      } catch {
        setApps([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [secretUnlocked]);

  const hasData = useMemo(() => apps.length > 0, [apps]);

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
        )}
      </main>
      <Footer />
      <AdminLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
