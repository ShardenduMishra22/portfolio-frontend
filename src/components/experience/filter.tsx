import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface ExperienceFiltersProps {
  selectedTech: string
  setSelectedTech: (tech: string) => void
  selectedCompany: string
  setSelectedCompany: (company: string) => void
  selectedYear: string
  setSelectedYear: (year: string) => void
  searchTerm: string
  onSearchChange: (value: string) => void
  allTechs: string[]
  allCompanies: string[]
  allYears: string[]
}

export default function ExperienceFilters({
  selectedTech,
  setSelectedTech,
  selectedCompany,
  setSelectedCompany,
  selectedYear,
  setSelectedYear,
  searchTerm,
  onSearchChange,
  allTechs,
  allCompanies,
  allYears,
}: ExperienceFiltersProps) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center justify-center mb-6 px-4 py-3 rounded-lg bg-muted/50 border">
      <Select value={selectedTech} onValueChange={setSelectedTech}>
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="Technology" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Technologies</SelectItem>
          {allTechs.map((tech) => (
            <SelectItem key={tech} value={tech}>
              {tech}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCompany} onValueChange={setSelectedCompany}>
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="Company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Companies</SelectItem>
          {allCompanies.map((company) => (
            <SelectItem key={company} value={company}>
              {company}
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

      {(selectedTech !== '__all__' ||
        selectedCompany !== '__all__' ||
        selectedYear !== '__all__') && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedTech('__all__')
            setSelectedCompany('__all__')
            setSelectedYear('__all__')
          }}
        >
          Clear Filters
        </Button>
      )}

      <Input
        type="text"
        placeholder="Search experiences..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-[200px]"
      />
    </div>
  )
}
