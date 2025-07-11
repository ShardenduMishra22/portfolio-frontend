'use client';

import { useEffect, useState } from 'react';
import { experiencesAPI } from '../../util/apiResponse.util';
import { Experience } from '../../data/types.data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ExternalLink, ChevronLeft, ChevronRight, MoreHorizontal, Building2, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Label } from '../../components/ui/label';

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 4;
  const [selectedTech, setSelectedTech] = useState<string>("__all__");
  const [selectedCompany, setSelectedCompany] = useState<string>("__all__");
  const [selectedYear, setSelectedYear] = useState<string>("__all__");

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

  // Extract unique technologies, companies, and years from experiences
  const allTechs = Array.from(new Set(experiences.flatMap(e => e.technologies)));
  const allCompanies = Array.from(new Set(experiences.map(e => e.company_name)));
  const allYears = Array.from(new Set(experiences.map(e => e.start_date ? new Date(e.start_date).getFullYear().toString() : ''))).filter(Boolean);

  // Filter logic
  const filteredExperiences = experiences.filter(exp => {
    const matchesTech = selectedTech !== "__all__" ? exp.technologies.includes(selectedTech) : true;
    const matchesCompany = selectedCompany !== "__all__" ? exp.company_name === selectedCompany : true;
    const matchesYear = selectedYear !== "__all__" ? (exp.start_date && new Date(exp.start_date).getFullYear().toString() === selectedYear) : true;
    return matchesTech && matchesCompany && matchesYear;
  });

  // Pagination on filteredExperiences
  const totalPages = Math.ceil(filteredExperiences.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentExperiences = filteredExperiences.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`Page changed to ${page}`);
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) return       (
  <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-heading text-foreground">Loading Experience</h2>
            <p className="text-foreground">Fetching amazing work...</p>
          </div>
        </div>
      </div>
    );

  if (error) return       <div className="h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Zap className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-heading text-foreground">Oops! Something went wrong</h2>
            <p className="text-foreground">{error}</p>
          </div>
        </div>
      </div>;

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-7xl flex-1 flex flex-col">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Experience</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Work Journey
          </h1>

          <p className="text-base text-foreground max-w-2xl mx-auto leading-relaxed">
            Roles, contributions, and responsibilities across companies and domains
          </p>
        </div>
        {/* Filter Bar */}
        <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center justify-center mb-6 px-4 py-3 rounded-lg bg-muted/40 border border-border/30 shadow-sm">
          <Select value={selectedTech} onValueChange={setSelectedTech}>
            <SelectTrigger className="min-w-[140px] px-2 py-2 rounded-md border border-border/30 bg-background focus:ring-2 focus:ring-primary/30">
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
            <SelectTrigger className="min-w-[140px] px-2 py-2 rounded-md border border-border/30 bg-background focus:ring-2 focus:ring-primary/30">
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
            <SelectTrigger className="min-w-[120px] px-2 py-2 rounded-md border border-border/30 bg-background focus:ring-2 focus:ring-primary/30">
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
              className="ml-2 px-3 py-2 rounded-md border border-border/30"
              onClick={() => { setSelectedTech("__all__"); setSelectedCompany("__all__"); setSelectedYear("__all__"); }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {filteredExperiences.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-foreground">
              No experiences yet.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {currentExperiences.map((experience, index) => (
                  <Card
                    key={experience.inline?.id || experience.inline.id}
                    className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm w-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="relative z-10 pb-2">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {experience.position}
                          </CardTitle>
                          <CardDescription className="text-sm text-foreground">
                            {experience.company_name}
                          </CardDescription>
                          <p className="text-xs text-foreground mt-1">
                            {new Date(experience.start_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })} - {new Date(experience.end_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-sm text-foreground line-clamp-3">
                        {experience.description.length > 150 ? experience.description.slice(0, 150) + '...' : experience.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {experience.technologies.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {experience.certificate_url && (
                          <a
                            href={experience.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <Link href={`/experiences/${experience.inline?.id || experience.inline.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          >
                            Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border-2 border-border/20 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </Button>

                  <div className="flex space-x-1">
                    {getPaginationNumbers().map((pageNumber, index) => (
                      <div key={index}>
                        {pageNumber === '...' ? (
                          <Button variant="ghost" size="sm" disabled className="px-2 py-2 text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber as number)}
                            className={`px-3 py-2 rounded-lg border-2 transition-all ${
                              currentPage === pageNumber
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                                : 'border-border/20 hover:border-primary/40 hover:bg-primary/10'
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border-2 border-border/20 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              <div className="text-center text-xs text-foreground pb-2">
                Showing {filteredExperiences.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredExperiences.length)} of {filteredExperiences.length} experiences
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
