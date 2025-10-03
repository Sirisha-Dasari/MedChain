import RemindersTable from "@/components/reminders-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RemindersPage() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Your Medicine Schedule</CardTitle>
        <CardDescription>
          Manage your medication reminders to stay on track with your health plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RemindersTable />
      </CardContent>
    </Card>
  );
}
