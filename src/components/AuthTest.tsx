import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/firebase";

export default function AuthTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStudentsTable = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const { error: qErr } = await supabase
        .from("students")
        .select("id")
        .limit(1);
      if (qErr) {
        setError(`Error: ${qErr.message}`);
        return;
      }
      setResult("Table found and API working!");
    } catch (err: any) {
      setError(`Error: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Supabase Students Table Check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={checkStudentsTable} disabled={loading} className="w-full">
          {loading ? "Checking..." : "Check Students Table"}
        </Button>
        {result && (
          <p className="text-green-600">✅ {result}</p>
        )}
        {error && (
          <p className="text-red-600">❌ {error}</p>
        )}
      </CardContent>
    </Card>
  );
}
