import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface CertificationFiltersProps {
  selectedSkill: string
  setSelectedSkill: (skill: string) => void
  selectedIssuer: string
  setSelectedIssuer: (issuer: string) => void
  selectedYear: string
  setSelectedYear: (year: string) => void
  searchTerm: string
  onSearchChange: (value: string) => void
  allSkills: string[]
  allIssuers: string[]
  allYears: string[]
}

export default function CertificationFilters({
  selectedSkill,
  setSelectedSkill,
  selectedIssuer,
  setSelectedIssuer,
  selectedYear,
  setSelectedYear,
  searchTerm,
  onSearchChange,
  allSkills,
  allIssuers,
  allYears,
}: CertificationFiltersProps) {
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

      <Select value={selectedIssuer} onValueChange={setSelectedIssuer}>
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="Issuer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Issuers</SelectItem>
          {allIssuers.map((issuer) => (
            <SelectItem key={issuer} value={issuer}>
              {issuer}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="min-w-[120px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Years</SelectItem>
          {allYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(selectedSkill !== '__all__' ||
        selectedIssuer !== '__all__' ||
        selectedYear !== '__all__') && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedSkill('__all__')
            setSelectedIssuer('__all__')
            setSelectedYear('__all__')
          }}
        >
          Clear Filters
        </Button>
      )}

      <Input
        type="text"
        placeholder="Search certifications..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-[200px]"
      />
    </div>
  )
}
