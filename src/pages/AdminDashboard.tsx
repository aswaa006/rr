import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

// Placeholder Firestore-like API. Replace with real Firebase when available.
type HeroApplication = {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseUrl: string;
  agreed: boolean;
  submittedAt: number; // epoch ms
  status?: "pending" | "approved" | "rejected";
};

// Simulated fetch/update for demo. Swap with Firebase Firestore SDK later.
async function fetchHeroApplications(): Promise<HeroApplication[]> {
  return [
    {
      id: "demo-1",
      name: "John Doe",
      phone: "+91 9876543210",
      vehicleType: "Bike",
      vehicleNumber: "HR-26-AX-1234",
      licenseUrl: "https://example.com/license/demo1.jpg",
      agreed: true,
      submittedAt: Date.now() - 1000 * 60 * 60,
      status: "pending"
    }
  ];
}

async function updateApplicationStatus(_id: string, _status: "approved" | "rejected") {
  // Replace with Firestore updateDoc call
  return true;
}

export default function AdminDashboard() {
  const { isAuthenticated } = useAdminAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [buffer, setBuffer] = useState<string[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<HeroApplication[]>([]);

  // Secret sequence: press '8', then '7', then '6'
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key;
      const next = [...buffer, key].slice(-3);
      setBuffer(next);
      if (next.join("") === "876") {
        setSecretUnlocked(true);
        setLoginOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [buffer]);

  useEffect(() => {
    if (!isAuthenticated || !secretUnlocked) return;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchHeroApplications();
        setApps(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, secretUnlocked]);

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
              <p className="text-sm text-muted-foreground mt-2">Hint: 3 digits ascending from 6 but typed in reverse.</p>
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
                              onClick={async ()=>{
                                await updateApplicationStatus(app.id, 'approved');
                                setApps(prev => prev.map(a => a.id===app.id ? { ...a, status: 'approved' } : a));
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async ()=>{
                                await updateApplicationStatus(app.id, 'rejected');
                                setApps(prev => prev.map(a => a.id===app.id ? { ...a, status: 'rejected' } : a));
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


