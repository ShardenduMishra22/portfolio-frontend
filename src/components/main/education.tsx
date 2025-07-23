import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Award, 
  Languages, 
  ExternalLink, 
  Download,
  BookOpen,
  Star,
  ArrowRight
} from 'lucide-react';

const educationData = {
  resumeLink: "https://drive.google.com/file/d/1AiCHH7NoA5BqaigPzavo2zBaq6KphSvT/preview",
  
  // Education Information
  CollegeBatch: "2023-2027",
  CollegeWebsite: "https://iiitdwd.ac.in/",
  CollegeLocation: "Dharwad, Karnataka, India",
  CollegeName: "Indian Institute of Information Technology, Dharwad",
  
  SchoolBatch: "2008-2022",
  SchoolName: "Delhi Public School, Kalyanpur",
  SchoolLocation: "Kanpur, Uttar Pradesh, India",
  
  Class12thPercentage: "96.4%",
  Class12thCourse: "PCM and Computer Science",
  
  Class10thPercentage: "84%",
  
  // Languages 
  Languages: [
    "Hindi",
    "French", 
    "English",
  ]
};

const EducationSection = () => {
  const [hoveredCard, setHoveredCard] = useState<"college" | "school" | "languages" | "resume" | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Mobile Center Aligned */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <GraduationCap className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Academic Journey</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">Educational </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Background</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Academic journey through diverse learning experiences and achievements
          </p>
        </div>

        {/* Education Grid - Responsive Height Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* College Education - Dynamic Height */}
          <div 
            className={`min-h-[320px] bg-card/50 border border-border/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col ${
              hoveredCard === 'college' && !isMobile ? 'scale-[1.02]' : ''
            } ${isMobile ? 'text-center' : ''}`}
            onMouseEnter={() => !isMobile && setHoveredCard('college')}
            onMouseLeave={() => !isMobile && setHoveredCard(null)}
          >
            {/* Header Section - Fixed Space */}
            <div className={`flex items-start justify-between mb-6 ${isMobile ? 'flex-col items-center space-y-4' : ''}`}>
              <div className={`flex items-center space-x-4 ${isMobile ? 'flex-col items-center space-x-0 space-y-3' : ''}`}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 flex-shrink-0">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                
                <div className={`min-w-0 ${isMobile && 'text-center'}`}>
                  <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">Higher Education</h3>
                  <div className={`flex items-center space-x-2 text-sm text-muted-foreground ${isMobile ? 'justify-center' : ''}`}>
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{educationData.CollegeBatch}</span>
                  </div>
                </div>
              </div>
              
              {!isMobile && (
                <a 
                  href={educationData.CollegeWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-300 text-sm border border-primary/20 flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit</span>
                </a>
              )}
            </div>
            
            {/* Content Section - Flexible Space */}
            <div className={`flex-1 space-y-4 ${isMobile ? 'text-center' : ''}`}>
              {/* College Name - Constrained Height */}
              <div className="min-h-[3rem]">
                <h4 className="text-base sm:text-lg font-semibold leading-tight">
                  {isMobile ? 
                    educationData.CollegeName.length > 40 ? 
                      `${educationData.CollegeName.substring(0, 40)}...` : 
                      educationData.CollegeName
                    : educationData.CollegeName
                  }
                </h4>
              </div>
              
              {/* Location */}
              <div className={`flex items-start space-x-2 text-muted-foreground ${isMobile ? 'justify-center' : ''}`}>
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  {isMobile ? 
                    educationData.CollegeLocation.length > 30 ? 
                      `${educationData.CollegeLocation.substring(0, 30)}...` : 
                      educationData.CollegeLocation
                    : educationData.CollegeLocation
                  }
                </span>
              </div>
              
              {/* Description */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Computer Science and Engineering - Focusing on software development and emerging technologies
                </p>
              </div>

              {/* Mobile Website Link */}
              {isMobile && (
                <div className="pt-2">
                  <a 
                    href={educationData.CollegeWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-300 text-sm border border-primary/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* School Education - Dynamic Height */}
          <div 
            className={`min-h-[320px] bg-card/50 border border-border/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-secondary/20 transition-all duration-300 flex flex-col ${
              hoveredCard === 'school' && !isMobile ? 'scale-[1.02]' : ''
            } ${isMobile ? 'text-center' : ''}`}
            onMouseEnter={() => !isMobile && setHoveredCard('school')}
            onMouseLeave={() => !isMobile && setHoveredCard(null)}
          >
            {/* Header Section */}
            <div className={`flex items-center space-x-4 mb-6 ${isMobile ? 'flex-col items-center space-x-0 space-y-3' : ''}`}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center border border-secondary/20 flex-shrink-0">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-secondary" />
              </div>
              <div className={`min-w-0 ${isMobile ? 'text-center' : ''}`}>
                <h3 className="text-lg sm:text-xl font-bold text-secondary mb-2">School Education</h3>
                <div className={`flex items-center space-x-2 text-sm text-muted-foreground ${isMobile ? 'justify-center' : ''}`}>
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{educationData.SchoolBatch}</span>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className={`flex-1 space-y-4 ${isMobile ? 'text-center' : ''}`}>
              {/* School Name - Constrained Height */}
              <div className="min-h-[3rem]">
                <h4 className="text-base sm:text-lg font-semibold leading-tight">
                  {isMobile ? 
                    educationData.SchoolName.length > 35 ? 
                      `${educationData.SchoolName.substring(0, 35)}...` : 
                      educationData.SchoolName
                    : educationData.SchoolName
                  }
                </h4>
              </div>
              
              {/* Location */}
              <div className={`flex items-start space-x-2 text-muted-foreground ${isMobile ? 'justify-center' : ''}`}>
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  {isMobile ? 
                    educationData.SchoolLocation.length > 30 ? 
                      `${educationData.SchoolLocation.substring(0, 30)}...` : 
                      educationData.SchoolLocation
                    : educationData.SchoolLocation
                  }
                </span>
              </div>
              
              {/* Grades Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-primary/5 rounded-xl p-3 sm:p-4 border border-primary/10">
                  <div className={`flex items-center space-x-2 mb-2 ${isMobile ? 'justify-center' : ''}`}>
                    <Award className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-semibold text-sm">Class 12th</span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-primary mb-1">{educationData.Class12thPercentage}</p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {isMobile && educationData.Class12thCourse.length > 15 ? 
                      `${educationData.Class12thCourse.substring(0, 15)}...` : 
                      educationData.Class12thCourse
                    }
                  </p>
                </div>
                
                <div className="bg-secondary/5 rounded-xl p-3 sm:p-4 border border-secondary/10">
                  <div className={`flex items-center space-x-2 mb-2 ${isMobile ? 'justify-center' : ''}`}>
                    <Award className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="font-semibold text-sm">Class 10th</span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-secondary mb-1">{educationData.Class10thPercentage}</p>
                  <p className="text-xs text-muted-foreground">All Subjects</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Responsive Heights */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Languages - Dynamic Height */}
          <div 
            className={`min-h-[240px] bg-card/50 border border-border/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-accent/20 transition-all duration-300 flex flex-col ${
              hoveredCard === 'languages' && !isMobile ? 'scale-[1.02]' : ''
            } ${isMobile ? 'text-center' : ''}`}
            onMouseEnter={() => !isMobile && setHoveredCard('languages')}
            onMouseLeave={() => !isMobile && setHoveredCard(null)}
          >
            {/* Header */}
            <div className={`flex items-center space-x-4 mb-6 ${isMobile ? 'flex-col items-center space-x-0 space-y-3' : ''}`}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 flex-shrink-0">
                <Languages className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
              </div>
              <div className={`${isMobile ? 'text-center' : ''}`}>
                <h3 className="text-lg sm:text-xl font-bold text-accent mb-1">Languages</h3>
                <p className="text-sm text-muted-foreground">Communication</p>
              </div>
            </div>
            
            {/* Languages List */}
            <div className={`flex-1 flex items-start ${isMobile ? 'justify-center' : ''}`}>
              <div className="flex flex-wrap gap-3">
                {educationData.Languages.map((language, index) => (
                  <div 
                    key={index}
                    className="px-3 sm:px-4 py-2 bg-accent/10 rounded-full text-accent font-medium hover:bg-accent/20 transition-all duration-300 cursor-default text-sm border border-accent/20 whitespace-nowrap"
                  >
                    {language}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Section - Dynamic Height */}
          <div 
            className={`lg:col-span-2 min-h-[240px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col ${
              hoveredCard === 'resume' && !isMobile ? 'scale-[1.02]' : ''
            } ${isMobile ? 'text-center' : ''}`}
            onMouseEnter={() => !isMobile && setHoveredCard('resume')}
            onMouseLeave={() => !isMobile && setHoveredCard(null)}
          >
            <div className={`flex-1 flex items-center ${isMobile ? 'flex-col justify-center space-y-6' : 'justify-between'}`}>
              {/* Content */}
              <div className={`flex-1 ${isMobile ? 'text-center' : ''}`}>
                <div className={`flex items-center space-x-4 mb-4 ${isMobile ? 'justify-center flex-col space-x-0 space-y-3' : ''}`}>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className={`min-w-0 ${isMobile ? 'text-center' : ''}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Complete Resume</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      View detailed resume for comprehensive technical background
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Buttons */}
              <div className={`flex gap-3 sm:gap-4 ${isMobile ? 'flex-col w-full' : 'flex-col flex-shrink-0'}`}>
                <a 
                  href={educationData.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <a 
                  href={educationData.resumeLink.replace('/preview', '/export?format=pdf')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Professional accent line */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default EducationSection;