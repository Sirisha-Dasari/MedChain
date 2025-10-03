import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SymptomCheckerClient from "./symptom-checker-client";

export default function SymptomCheckerPage() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>AI-Powered Symptom Checker</CardTitle>
        <CardDescription>
          Describe your symptoms to get preliminary guidance. This tool does not provide medical advice. Consult a healthcare professional for any health concerns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SymptomCheckerClient />
      </CardContent>
    </Card>
  );
}
