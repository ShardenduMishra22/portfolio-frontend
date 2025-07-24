'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Experience } from '@/data/types.data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
import { experiencesAPI } from '@/util/apiResponse.util';
import ExperienceGrid from '@/components/Experience/grid';
import { useRouter, useSearchParams } from 'next/navigation';
import ExperiencePagination from '@/components/Experience/pagination';
import { EmptyState, ErrorState, LoadingState } from '@/components/Experience/load-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ExperiencePageContent() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const experiencesPerPage = 6;
  const [selectedTech, setSelectedTech] = useState<string>("__all__");
  const [selectedCompany, setSelectedCompany] = useState<string>("__all__");
  const [selectedYear, setSelectedYear] = useState<string>("__all__");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search')?.toLowerCase() || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const allTechs = Array.from(new Set(experiences.flatMap(e => e.technologies)));
  const allCompanies = Array.from(new Set(experiences.map(e => e.company_name)));
  const allYears = Array.from(new Set(experiences.map(e => e.start_date ? new Date(e.start_date).getFullYear().toString() : ''))).filter(Boolean);

  const filteredExperiences = experiences.filter(experience => {
    const matchesTech = selectedTech !== "__all__" ? experience.technologies.includes(selectedTech) : true;
    const matchesCompany = selectedCompany !== "__all__" ? experience.company_name === selectedCompany : true;
    const matchesYear = selectedYear !== "__all__" ? (experience.start_date && new Date(experience.start_date).getFullYear().toString() === selectedYear) : true;
    const matchesSearch = searchTerm === '' || 
      experience.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTech && matchesCompany && matchesYear && matchesSearch;
  });

  const totalPages = Math.ceil(filteredExperiences.length / experiencesPerPage);
  const startIndex = (currentPage - 1) * experiencesPerPage;
  const endIndex = startIndex + experiencesPerPage;
  const currentExperiences = filteredExperiences.slice(startIndex, endIndex);

  const transformedExperiences = currentExperiences.map(experience => ({
    title: experience.position,
    company: experience.company_name,
    description: experience.description,
    link: `/experiences/${experience.inline?.id || experience.inline.id}`,
    technologies: experience.technologies,
    certificateUrl: experience.certificate_url,
    startDate: experience.start_date,
    endDate: experience.end_date,
  }));

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experiencesAPI.getAllExperiences();
        setExperiences(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    toast.error(error, {
      style: { zIndex: 30 },
    });
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Header Bar - Left: Title, Middle: Search, Right: Navigation */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 max-w-full">
          <div className="flex items-center justify-between gap-8">
            
            {/* Left Side: Back Button + Title + Stats */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-muted">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent whitespace-nowrap">
                    Experience
                  </h1>
                </div>
                
                {/* Compact Stats */}
                <div className="hidden lg:flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-primary">{experiences.length}</span>
                    <span className="text-muted-foreground">Total</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-secondary">{currentPage}</span>
                    <span className="text-muted-foreground">of</span>
                    <span className="font-semibold text-secondary">{totalPages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <Input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-10 w-full border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-colors bg-background/50"
              />
            </div>

            {/* Right Side: Pagination */}
            <div className="flex-shrink-0">
              {totalPages > 1 && (
                <ExperiencePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={filteredExperiences.length}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Filter Bar */}
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 max-w-full">
          <div className="flex items-center justify-center gap-4">
            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Technologies</SelectItem>
                {allTechs.map(tech => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Companies</SelectItem>
                {allCompanies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
                
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Years</SelectItem>
                {allYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(selectedTech !== "__all__" || selectedCompany !== "__all__" || selectedYear !== "__all__") && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { 
                  setSelectedTech("__all__"); 
                  setSelectedCompany("__all__"); 
                  setSelectedYear("__all__"); 
                }}
                className="h-9"
              >
                Clear Filters
              </Button>
            )}
            
            {/* Mobile Stats */}
            <div className="lg:hidden flex items-center gap-3 text-sm ml-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-primary">{experiences.length}</span>
                <span className="text-muted-foreground">Total</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1">
                <span className="font-semibold text-secondary">{currentPage}</span>
                <span className="text-muted-foreground">of</span>
                <span className="font-semibold text-secondary">{totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-6 py-8 max-w-full">
          {experiences.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <EmptyState />
            </div>
          ) : (
            <div className="mb-8">
              <div className="prose-md">
                <ExperienceGrid 
                  items={transformedExperiences} 
                  className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                />
              </div>
            </div>
          )}

          {/* Bottom Info Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-border/30 text-sm text-muted-foreground">
            <p>
              Showing {filteredExperiences.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredExperiences.length)} of {filteredExperiences.length} experiences
            </p>
            <p className="text-xs">
              Professional journey and work experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}