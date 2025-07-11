import React, { useState } from 'react';
import { GraduationCap, MapPin, Calendar, Award, Languages, ExternalLink } from 'lucide-react';

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
  const [hoveredCard, setHoveredCard] = useState<"college" | "school" | "languages" | null>(null);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Education
          </h2>
          <p className="text-foreground max-w-2xl mx-auto">
            Academic journey through diverse learning experiences and achievements
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* College Education */}
          <div 
            className={`bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${hoveredCard === 'college' ? 'scale-105' : ''}`}
            onMouseEnter={() => setHoveredCard('college')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">Higher Education</h3>
                  <div className="flex items-center space-x-2 text-sm opacity-70">
                    <Calendar className="w-4 h-4" />
                    <span>{educationData.CollegeBatch}</span>
                  </div>
                </div>
              </div>
              <a 
                href={educationData.CollegeWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-full transition-all duration-300 text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Visit</span>
              </a>
            </div>
            
            <h4 className="text-lg font-semibold mb-2">{educationData.CollegeName}</h4>
            <div className="flex items-center space-x-2 text-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{educationData.CollegeLocation}</span>
            </div>
            
            <div className="bg-muted/20 rounded-xl p-3">
              <p className="text-sm opacity-80">
                Computer Science and Engineering - Focusing on software development and emerging technologies
              </p>
            </div>
          </div>

          {/* School Education */}
          <div 
            className={`bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${hoveredCard === 'school' ? 'scale-105' : ''}`}
            onMouseEnter={() => setHoveredCard('school')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary">School Education</h3>
                <div className="flex items-center space-x-2 text-sm opacity-70">
                  <Calendar className="w-4 h-4" />
                  <span>{educationData.SchoolBatch}</span>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold mb-2">{educationData.SchoolName}</h4>
            <div className="flex items-center space-x-2 text-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{educationData.SchoolLocation}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-primary" />
                  <h5 className="font-semibold text-sm">Class 12th</h5>
                </div>
                <p className="text-xl font-bold text-primary mb-1">{educationData.Class12thPercentage}</p>
                <p className="text-xs opacity-70">{educationData.Class12thCourse}</p>
              </div>
              
              <div className="bg-muted/20 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-secondary" />
                  <h5 className="font-semibold text-sm">Class 10th</h5>
                </div>
                <p className="text-xl font-bold text-secondary mb-1">{educationData.Class10thPercentage}</p>
                <p className="text-xs opacity-70">All Subjects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Languages */}
          <div 
            className={`bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${hoveredCard === 'languages' ? 'scale-105' : ''}`}
            onMouseEnter={() => setHoveredCard('languages')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Languages className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-accent">Languages</h3>
                <p className="text-sm opacity-70">Communication</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {educationData.Languages.map((language, index) => (
                <div 
                  key={index}
                  className="px-3 py-1 bg-accent/20 rounded-full text-accent font-medium hover:bg-accent/30 transition-all duration-300 cursor-pointer text-sm"
                >
                  {language}
                </div>
              ))}
            </div>
          </div>

          {/* Resume Section */}
          <div className="lg:col-span-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Complete Professional Profile</h3>
                <p className="text-foreground text-sm">
                  View detailed resume for comprehensive technical background
                </p>
              </div>
              <a 
                href={educationData.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;