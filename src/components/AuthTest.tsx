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
    <Card>
      <CardHeader>
        <CardTitle>Auth Test Component</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testGoogleAuth}>
          Test Google Auth
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthTest;
