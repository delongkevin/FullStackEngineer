import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function ResumePage() {
  const contactInfo = [
    { icon: Mail, text: 'delong.kevin@gmail.com', href: 'mailto:delong.kevin@gmail.com', label: 'Send email to delong.kevin@gmail.com' },
    { icon: Phone, text: '(810) 287-7409', href: 'tel:810-287-7409', label: 'Call (810) 287-7409' },
    { icon: MapPin, text: 'Grand Blanc, Michigan, United States', href: '#', label: 'Location: Grand Blanc, Michigan, United States' },
    { icon: ExternalLink, text: 'kevindouglasdelong.net', href: 'https://kevindouglasdelong.net', label: 'Visit kevindouglasdelong.net' }
  ];

  const skills = {
    "Frontend Development": ["React", "React Native", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design"],
    "Backend Development": ["Node.js", "Express", "Python", "RESTful APIs", "WebSocket", "Microservices", "C", "Embedded C"],
    "Mobile Development": ["iOS (Swift)", "Android (Kotlin)", "Expo", "React Native", "Cross-platform Apps", "Mobile UI/UX"],
    "Database & Cloud": ["SQL", "PostgreSQL", "Firebase", "AWS", "CI/CD", "Docker", "Git"],
    "Testing & Quality": ["Jest", "Vitest", "Testing Library", "Unit Testing", "Integration Testing", "Test Automation", "CAPL"],
    "Automotive & Embedded": ["AUTOSAR", "CAN", "CAN FD", "Ethernet", "DoIP", "UDS", "CANoe", "Embedded Systems"]
  };

  const experience = [
    {
      title: "Software Test Lead",
      company: "Magna Electronics",
      period: "Jan 2023 - Present",
      description: "Engineered and maintained Python-based automated validation solutions for ADAS and in-vehicle communication systems, increasing test coverage by 40% and reducing manual testing effort.",
      achievements: [
        "Led issue triage and defect root-cause analysis for communication and diagnostics features, partnering with development teams to deliver robust fixes",
        "Served as primary technical liaison for customer accounts, supporting milestone readiness, validation status, and delivery quality",
        "Implemented CI/CD validation pipelines reducing deployment and feedback time by 60%"
      ]
    },
    {
      title: "Software Test Engineer II",
      company: "Trijicon, Inc.",
      period: "Jan 2022 - Jan 2023",
      description: "Designed and developed an automated regression testing framework for thermal imaging scopes, reducing the testing cycle for milestone releases by 60%.",
      achievements: [
        "Authored and reviewed comprehensive test plans and cases, leading to a 25% reduction in post-release defects",
        "Collaborated directly with the development team to troubleshoot and resolve firmware bugs, providing detailed analysis and documentation to accelerate the fix process."
      ]
    },
    {
      title: "Software Developer (Freelance)",
      company: "Upwork, Inc.",
      period: "Jan 2021 - Jan 2023",
      description: "Software Developer that focuses on full stack development on web, react native, Node.js, front/back end services.",
      achievements: [
        "Developed and deployed a full-stack e-commerce web application for a client using React, Node.js,and a SQL database, resulting in a 30% increase in user engagement.",
        "Engineered a cross-platform mobile application for iOS and Android using React Native and Flutter, integrating Bluetooth SDK for IoT device communication.",
        "Built custom features and plugins for various client websites using PHP (Laravel, WordPress) and Python (Django)."
      ]
    },
    {
      title: "Software Testing Lead",
      company: "Harman International",
      period: "Jan 2018 - Nov 2021",
      description: "Led cross-functional validation teams to reduce field defect exposure for automotive infotainment and ECU communication features.",
      achievements: [
         "Automated OTA validation workflows for infotainment software, ensuring 99.9% reliability for remote deployments.",
          "Led defect resolution and integration support for AUTOSAR implementations on SoC and I/O controllers, improving system stability and reliability.",
          "Mentored and trained engineers on software architecture, Vector toolchains, diagnostics workflows, and automation best practices",
      ]
    },
    {
      title: "Senior Software Test Engineer",
      company: "Harman International",
      period: "Jan 2013 - Jan 2018",
      description: "Performed software validation and verification against OEM customer specifications prior to production release.",
      achievements: [
          "Developed and debugged automation scripts using Python and Vector tools to simulate ECU behavior and improve pre-deployment test accuracy.",
          "Built CANoe-based test environments to validate CAN/CAN FD communication, diagnostics behavior, and service interactions.",
          "Authored and optimized 500+ manual and automated test cases for system and bench validation across infotainment releases."
      ]
    }

  ];

  const education = [
    {
      degree: "Bachelor of Science in Computer Engineering",
      school: "Lawrence Technological University",
      period: "2008 - 2013",
      details: "Focus on Embedded Systems and Communication Architectures. C, C++, Python"
    }
  ];

  const projects = [
    {
      name: "Fitness Tracker Mobile App",
      description: "Cross-platform React Native app with HealthKit/Google Fit integration, workout logging, wearable sync, and goal tracking. Built for iOS and Android with Expo.",
      tech: ["React Native", "Expo", "Node.js", "HealthKit", "Google Fit", "REST API"]
    },
    {
      name: "Real Estate Marketplace",
      description: "Full-stack property listing platform with authentication, favorites, search filters, and location services. Includes Jest test suite with 95%+ coverage.",
      tech: ["React Native", "Expo", "Node.js", "Express", "Jest", "Testing Library"]
    },
    {
      name: "Personal Finance Tracker",
      description: "Complete expense and budget management app with category tracking, spending alerts, fraud detection, and Chart.js visualizations for iOS/Android.",
      tech: ["React Native", "Node.js", "Express", "Chart.js", "RESTful API"]
    },
    {
      name: "Music Streaming Platform",
      description: "Full-featured music streaming app with playlist management, audio playback controls, search, and social features for sharing favorite tracks.",
      tech: ["React Native", "Node.js", "Audio APIs", "WebSocket", "REST API"]
    },
    {
      name: "Interactive Portfolio Website",
      description: "Modern Next.js portfolio with server-side rendering, embeddable projects, responsive design, and comprehensive test coverage using Vitest.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vitest"]
    },
    {
      name: "AUTOSAR ECU Diagnostics Validator",
      description: "Automated validation framework for AUTOSAR communication and diagnostics flows including SOME/IP, DoIP, UDS, and Ethernet stack testing.",
      tech: ["Python", "AUTOSAR", "CANoe", "CAN", "Ethernet", "CI/CD"]
    }
  ];

  return (
    <>
      <Header />
      
      <main id="main-content" className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section aria-labelledby="resume-heading" className="text-center mb-12">
            <h1 id="resume-heading" className="text-4xl font-bold theme-text-primary mb-4">Resume</h1>
              <p className="text-xl theme-text-secondary max-w-2xl mx-auto">
               Software Engineer - Full Stack specializing in mobile and web development with expertise in React, React Native, Node.js, and cloud technologies.
              </p>
          <div className="mt-6">
            <a
              href="/resume.pdf"
              className="btn-primary inline-flex items-center gap-2"
              download="Kevin_Delong_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={20} aria-hidden="true" />
              Download PDF Version
            </a>
          </div>          </section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Headshot */}
            <div className="surface-card rounded-xl shadow-lg p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/images/headshot.jpg"
                  alt="Kevin Delong - Software Engineer - Full Stack"
                  fill
                  className="rounded-full object-cover border-4 border-blue-500"
                  sizes="128px"
                />
              </div>
              <h2 className="text-xl font-bold theme-text-primary">Kevin Delong</h2>
              <p className="theme-accent-text font-medium">Software Engineer - Full Stack</p>
            </div>
          {/* Contact Info */}
              <section aria-labelledby="contact-heading" className="surface-card rounded-xl shadow-lg p-6">
                <h2 id="contact-heading" className="text-xl font-bold theme-text-primary mb-4">Contact</h2>
                <div className="space-y-3">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 theme-text-secondary hover:opacity-80 transition-colors"
                      aria-label={item.label}
                    >
                      <item.icon size={18} className="flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm">{item.text}</span>
                    </a>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section aria-labelledby="sidebar-skills-heading" className="surface-card rounded-xl shadow-lg p-6">
                <h2 id="sidebar-skills-heading" className="text-xl font-bold theme-text-primary mb-4">Skills</h2>
                <div className="space-y-4">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h3 className="font-semibold theme-text-primary mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skillList.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 theme-chip rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Summary */}
              <section aria-labelledby="summary-heading" className="surface-card rounded-xl shadow-lg p-6">
                <h2 id="summary-heading" className="text-2xl font-bold theme-text-primary mb-4">Professional Summary</h2>
                <p className="theme-text-secondary leading-relaxed">
                Full-Stack Software Engineer with 10+ years of experience spanning web, mobile, and embedded systems development. Expert in building cross-platform applications using React, React Native, Node.js, and TypeScript with proven success in iOS (Swift), Android (Kotlin), and cloud deployment. Strong background in both modern web technologies and automotive embedded systems (AUTOSAR, CAN, Ethernet). Demonstrated ability to deliver complete solutions from frontend UI to backend APIs, database design, and CI/CD automation. Combines software development expertise with rigorous testing and quality assurance practices to ensure robust, scalable applications.
                </p>
              </section>

              {/* Experience */}
              <section aria-labelledby="experience-heading" className="surface-card rounded-xl shadow-lg p-6">
                <h2 id="experience-heading" className="text-2xl font-bold theme-text-primary mb-6">Work Experience</h2>
                <div className="space-y-8">
                  {experience.map((job, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold theme-text-primary">{job.title}</h3>
                          <p className="theme-accent-text font-medium">{job.company}</p>
                        </div>
                        <span className="theme-text-tertiary text-sm mt-1 sm:mt-0">{job.period}</span>
                      </div>
                      <p className="theme-text-secondary mb-4">{job.description}</p>
                      <ul className="space-y-2">
                        {job.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            <span className="theme-text-secondary">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Projects */}
              <section aria-labelledby="projects-heading" className="surface-card rounded-xl shadow-lg p-6">
                <h2 id="projects-heading" className="text-2xl font-bold theme-text-primary mb-6">Featured Projects</h2>
                <div className="grid grid-cols-1 gap-6">
                  {projects.map((project, index) => (
                    <div key={index} className="border theme-border rounded-lg p-4 surface-subtle">
                      <h3 className="font-semibold theme-text-primary mb-2">{project.name}</h3>
                      <p className="theme-text-secondary text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 surface-card theme-text-secondary rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section aria-labelledby="education-heading" className="surface-card rounded-xl shadow-lg p-6">
                <h2 id="education-heading" className="text-2xl font-bold theme-text-primary mb-6">Education</h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-xl font-semibold theme-text-primary">{edu.degree}</h3>
                          <p className="text-green-600 font-medium">{edu.school}</p>
                          <p className="theme-text-secondary text-sm mt-1">{edu.details}</p>
                        </div>
                        <span className="theme-text-tertiary text-sm mt-2 sm:mt-0">{edu.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
