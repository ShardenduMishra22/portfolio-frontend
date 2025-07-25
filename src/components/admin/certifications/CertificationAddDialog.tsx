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
import { Checkbox } from '../../ui/checkbox'
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover'
import { Plus } from 'lucide-react'
import React from 'react'
import dynamic from 'next/dynamic'

const TiptapModalEditor = dynamic(
  () => import('../../extra/TipTap').then((mod) => ({ default: mod.TiptapModalEditor })),
  { ssr: false }
)

type CertificationAddDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  errors: any
  register: any
  handleSubmit: any
  reset: () => void
  setValue: any
  watch: any
  editingCertification: any
  allSkills: string[]
  allProjects: { id: string; name: string }[]
  openDialog: () => void
}

export function CertificationAddDialog({
  open,
  setOpen,
  onSubmit,
  errors,
  register,
  handleSubmit,
  reset,
  setValue,
  watch,
  editingCertification,
  allSkills,
  allProjects,
  openDialog,
}: CertificationAddDialogProps) {
  const selectedSkills = watch('skills')
  const selectedProjects = watch('projects')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={openDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCertification ? 'Edit Certification' : 'Add New Certification'}
          </DialogTitle>
          <DialogDescription>
            {editingCertification
              ? 'Update your certification details.'
              : 'Add a new certification to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} placeholder="Certification Title" />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input id="issuer" {...register('issuer')} placeholder="Google, AWS, etc." />
              {errors.issuer && <p className="text-sm text-red-500">{errors.issuer.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Markdown Editor)</Label>
            <TiptapModalEditor
              value={watch('description')}
              onChange={(value) => setValue('description', value)}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-between">
                    {selectedProjects.length > 0
                      ? `${selectedProjects.length} selected`
                      : 'Select Projects'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-64 overflow-y-auto w-72 p-2">
                  {allProjects.map((project) => (
                    <label
                      key={project.id}
                      className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={(checked) => {
                          if (checked) setValue('projects', [...selectedProjects, project.id])
                          else
                            setValue(
                              'projects',
                              selectedProjects.filter((p: string) => p !== project.id)
                            )
                        }}
                      />
                      <span>{project.name}</span>
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificate_url">Certificate URL</Label>
            <Input
              id="certificate_url"
              {...register('certificate_url')}
              placeholder="https://example.com/cert.pdf"
            />
            {errors.certificate_url && (
              <p className="text-sm text-red-500">{errors.certificate_url.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (comma-separated, optional)</Label>
            <Input
              id="images"
              {...register('images')}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input id="issue_date" type="date" {...register('issue_date')} />
              {errors.issue_date && (
                <p className="text-sm text-red-500">{errors.issue_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input id="expiry_date" type="date" {...register('expiry_date')} />
              {errors.expiry_date && (
                <p className="text-sm text-red-500">{errors.expiry_date.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCertification ? 'Update Certification' : 'Create Certification'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
