import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import * as z from 'zod';
import React from 'react';

const skillsSchema = z.object({
  skills: z.string().min(1, 'Skills are required'),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

type SkillsAddDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: SkillsFormData) => Promise<void>;
  errors: any;
  register: any;
  handleSubmit: any;
  reset: () => void;
};

export function SkillsAddDialog({ open, setOpen, onSubmit, errors, register, handleSubmit, reset }: SkillsAddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => { reset(); setOpen(true); }}>
          Add Skills
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Skills</DialogTitle>
          <DialogDescription>
            Add new skills to your portfolio. Separate multiple skills with commas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              {...register('skills')}
              placeholder="JavaScript, React, Node.js, MongoDB"
            />
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Skills
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
