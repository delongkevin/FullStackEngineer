import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function ResumePage() {
  const contactInfo = [
    { icon: Mail, text: 'delong.kevin@gmail.com', href: 'mailto:delong.kevin@gmail.com' },
    { icon: Phone, text: '(810) 287-7409', href: 'tel:810-287-7409' },
    { icon: MapPin, text: 'Grand Blanc, Michigan, United States', href: '#' },
    { icon: ExternalLink, text: 'kevindouglasdelong.net', href: 'https://kevindouglasdelong.net' }
  ];

  const skills = {
    "Frontend Development": ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Next.js", "Tailwind CSS", "Redux"],
    "Backend Development": ["Node.js", "Express", "Python", "REST APIs", "MongoDB"],
    "Mobile Development": ["React Native", "iOS", "Android"],
    "Tools & Technologies": ["Git", "Docker", "AWS", "Webpack", "Figma", "Agile/Scrum", "CI/CD"]
  };

  const experience = [
    {
      title: "Software Test Lead",
      company: "Magna Electronics",
      period: "Jan 2023 - Present",
      description: "Engineered and maintained Python-based autonomous testing solutions for ADAS camera systems, increasing test coverage by 40% and reducing manual testing efforts.",
      achievements: [
        "Led a team in diagnosing and resolving critical software defects, collaborating with development teams to implement robust fixes and improve overall software quality",
        "Act as the primary technical liaison for customer accounts, ensuring successful software deliverables and managing relationships to align with project milestones",
        "Implemented CI/CD pipelines reducing deployment time by 60%"
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
      description: "Led cross functional teams for software testing department to reduce overall defects exposure in field for infotainment systems (Automotive)",
      achievements: [
         "Automated Over-the-Air (OTA) update validation processes for automotive infotainment systems, ensuring 99.9% reliability for remote deployments.",
          "Led defect resolution for AUTOSAR implementations on System-on-Chip (SoC) and I/O controllers, improving system performance and reliability.",
          "Mentored and trained new engineers on the infotainment software architecture, Vector tools, and automation best practices",
      ]
    },
    {
      title: "Senior Software Test Engineer",
      company: "Harman International",
      period: "Jan 2013 - Jan 2018",
      description: "Software Test Engineer for performing validation and verification tasks towards customer specifications before releasing to End-user.",
      achievements: [
          "Developed and debugged automation scripts using Python and Vector tools to simulate vehicle ECU behavior, increasing the accuracy of pre-deployment testing.",
          "Created custom user interfaces in CANoe to simulate CAN bus messaging for feature validation, allowing for early-stage bug detection.",
          "Wrote and optimized over 500 test cases for manual and automated execution, establishing a comprehensive regression suite that became the standard for the department. "
      ]
    }

  ];

  const education = [
    {
      degree: "Bachelor of Science in Computer Engineering",
      school: "Lawrence Technological University",
      period: "2008 - 2013",
      details: "Focus on Embedded Systems, Languages: C, C++, Python"
    }
  ];

  const projects = [
    {
      name: "CANoe Application Tester",
      description: "Real-time CAN-Bus data logger.",
      tech: ["Python"]
    },
    {
      name: "Image Capture Comparison App",
      description: "OpenCV libraries used for object detection with camera feeds",
      tech: ["Node.js", "OpenCV", "Python", "Embedded C"]
    },
    {
      name: "Report Parser",
      description: "Report parser using recursive functions based on keyword selection",
      tech: ["Python", "Jenkins", "CD/CI Pipeline"]
    }
  ];

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Full Stack Developer specializing in modern web technologies and scalable solutions.
            </p>
          <div className="mt-6">
            <a
              href="/resume.pdf"
              className="btn-primary inline-flex items-center gap-2"
              download="Kevin_Delong_Resume.pdf"  // Add this line
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={20} />
              Download PDF Version
            </a>
          </div>          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Headshot */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/images/headshot.jpg"
                  alt="Kevin Delong - Full Stack Developer"
                  fill
                  className="rounded-full object-cover border-4 border-blue-500"
                  sizes="128px"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Kevin Delong</h2>
              <p className="text-blue-600 font-medium">Full Stack Developer</p>
            </div>
          {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
                <div className="space-y-3">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="space-y-4">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skillList.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed">
                Results-oriented Software Engineer with 10+ years in automotive infotainment systems, specializing in backend automation, frontend UI development, and full-stack integration for web, mobile, and embedded applications. Proven track record in C++, Python, and AutoSAR architecture, collaborating on CI/CD pipelines to deliver high-quality, secure software. Excel at debugging complex SOC/IOC issues, fuzz testing protocols (CAN/Ethernet), and leading cross-functional teams to exceed milestones—reducing defects by 25% through optimized test automation. Eager to drive innovative solutions in scalable software environments.                </p>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
                <div className="space-y-8">
                  {experience.map((job, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-blue-600 font-medium">{job.company}</p>
                        </div>
                        <span className="text-gray-500 text-sm mt-1 sm:mt-0">{job.period}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      <ul className="space-y-2">
                        {job.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-green-600 font-medium">{edu.school}</p>
                          <p className="text-gray-600 text-sm mt-1">{edu.details}</p>
                        </div>
                        <span className="text-gray-500 text-sm mt-2 sm:mt-0">{edu.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
