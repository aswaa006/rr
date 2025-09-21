import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginWithGoogle } from "@/firebase";

const AuthTest = () => {
  const testGoogleAuth = async () => {
    console.log("Testing Google Auth...");
    try {
      await loginWithGoogle("user");
    } catch (error) {
      console.error("Test failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Auth Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testGoogleAuth} className="w-full">
          Test Google Authentication
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Check browser console for detailed logs
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthTest;
