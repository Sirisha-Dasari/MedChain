'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

type Reminder = {
  id: string;
  medicine: string;
  dosage: string;
  time: string;
  active: boolean;
};

const initialReminders: Reminder[] = [
  { id: '1', medicine: 'Metformin', dosage: '500 mg', time: '08:00 AM', active: true },
  { id: '2', medicine: 'Lisinopril', dosage: '10 mg', time: '08:00 AM', active: true },
  { id: '3', medicine: 'Atorvastatin', dosage: '20 mg', time: '08:00 PM', active: false },
  { id: '4', medicine: 'Vitamin D3', dosage: '1000 IU', time: '12:00 PM', active: true },
];

const RemindersTable = () => {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddReminder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newReminder: Reminder = {
      id: (reminders.length + 1).toString(),
      medicine: formData.get('medicine') as string,
      dosage: formData.get('dosage') as string,
      time: formData.get('time') as string,
      active: true,
    };
    setReminders([...reminders, newReminder]);
    setDialogOpen(false);
    form.reset();
  };

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };
  
  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
              <DialogDescription>
                Fill in the details for your new medication reminder.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddReminder}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="medicine" className="text-right">
                    Medicine
                  </Label>
                  <Input id="medicine" name="medicine" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dosage" className="text-right">
                    Dosage
                  </Label>
                  <Input id="dosage" name="dosage" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input id="time" name="time" type="time" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Reminder</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell className="font-medium">{reminder.medicine}</TableCell>
                <TableCell>{reminder.dosage}</TableCell>
                <TableCell>{reminder.time}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={reminder.active}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                    aria-label="Toggle reminder"
                  />
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RemindersTable;
