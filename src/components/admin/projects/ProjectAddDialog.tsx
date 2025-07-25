import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Checkbox } from '../../ui/checkbox'
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover'
import { Plus } from 'lucide-react'
import React from 'react'

type ProjectAddDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  errors: any
  register: any
  handleSubmit: any
  reset: () => void
  setValue: any
  watch: any
  editingProject: any
  allSkills: string[]
  openDialog: () => void
}

export function ProjectAddDialog({
  open,
  setOpen,
  onSubmit,
  errors,
  register,
  handleSubmit,
  setValue,
  watch,
  editingProject,
  allSkills,
  openDialog,
}: ProjectAddDialogProps) {
  const selectedSkills = watch('skills') || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={openDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {editingProject
              ? 'Update your project details.'
              : 'Add a new project to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name</Label>
              <Input
                id="project_name"
                {...register('project_name')}
                placeholder="My Awesome Project"
              />
              {errors.project_name && (
                <p className="text-sm text-red-500">{errors.project_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-between">
                    {selectedSkills.length > 0
                      ? `${selectedSkills.length} selected`
                      : 'Select Skills'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-64 overflow-y-auto w-72 p-2">
                  {allSkills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('skills', [...selectedSkills, skill])
                          else
                            setValue(
                              'skills',
                              selectedSkills.filter((s: string) => s !== skill)
                            )
                        }}
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message as string}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="small_description">Small Description</Label>
            <Input
              id="small_description"
              {...register('small_description')}
              placeholder="Short summary of the project"
            />
            {errors.small_description && (
              <p className="text-sm text-red-500">{errors.small_description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detailed project description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="project_repository">Repository URL</Label>
            <Input
              id="project_repository"
              {...register('project_repository')}
              placeholder="https://github.com/username/repo"
            />
            {errors.project_repository && (
              <p className="text-sm text-red-500">{errors.project_repository.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="project_live_link">Live Link</Label>
            <Input
              id="project_live_link"
              {...register('project_live_link')}
              placeholder="https://project-live.com"
            />
            {errors.project_live_link && (
              <p className="text-sm text-red-500">{errors.project_live_link.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="project_video">Video Link</Label>
            <Input
              id="project_video"
              {...register('project_video')}
              placeholder="https://youtube.com/video"
            />
            {errors.project_video && (
              <p className="text-sm text-red-500">{errors.project_video.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingProject ? 'Update Project' : 'Create Project'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
