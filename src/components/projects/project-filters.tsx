import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProjectFiltersProps } from '@/data/static_link'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export default function ProjectFilters({
  selectedSkill,
  setSelectedSkill,
  searchTerm,
  onSearchChange,
  allSkills,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center justify-center mb-6 px-4 py-3 rounded-lg bg-muted/50 border">
      <Select value={selectedSkill} onValueChange={setSelectedSkill}>
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="Skill" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Skills</SelectItem>
          {allSkills.map((skill) => (
            <SelectItem key={skill} value={skill}>
              {skill}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSkill !== '__all__' && (
        <Button variant="secondary" size="sm" onClick={() => setSelectedSkill('__all__')}>
          Clear Filters
        </Button>
      )}

      <Input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-[200px]"
      />
    </div>
  )
}
