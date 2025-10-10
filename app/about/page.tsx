import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Code2, Database, Smartphone, Cloud, GitBranch, Figma } from 'lucide-react';

export default function AboutPage() {
  const skills = {
    frontend: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Next.js', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'HTML/CSS', level: 98 }
    ],
    backend: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 82 },
      { name: 'MongoDB', level: 80 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'Firebase', level: 85 }
    ],
    tools: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Figma', level: 80 },
      { name: 'Jest', level: 85 }
    ]
  };

  const skillIcons = [
    { icon: Code2, label: 'Frontend', color: 'text-blue-600' },
    { icon: Database, label: 'Backend', color: 'text-green-600' },
    { icon: Smartphone, label: 'Mobile', color: 'text-purple-600' },
    { icon: Cloud, label: 'Cloud', color: 'text-orange-600' },
    { icon: GitBranch, label: 'DevOps', color: 'text-red-600' },
    { icon: Figma, label: 'Design', color: 'text-pink-600' }
  ];

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate full-stack developer with expertise in modern web technologies 
              and a focus on creating exceptional user experiences.
            </p>
          </div>

          {/* About Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Journey</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Hello! I'm Kevin Delong, a full-stack developer specializing in building 
                  exceptional digital experiences. My journey in web development started 
                  over 5 years ago, and I've been passionate about creating efficient, 
                  scalable solutions ever since.
                </p>
                <p>
                  I specialize in the React ecosystem, with extensive experience in Next.js, 
                  TypeScript, and modern CSS frameworks. On the backend, I work with Node.js, 
                  various databases, and cloud platforms to deliver complete solutions.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new technologies, 
                  contributing to open-source projects, or sharing knowledge with 
                  the developer community.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Technologies</h2>
              
              {/* Skill Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {skillIcons.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className={`bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${item.color}`}>
                      <item.icon size={32} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Skills */}
              <div className="space-y-6">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                      {category} Development
                    </h3>
                    <div className="space-y-3">
                      {skillList.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{skill.name}</span>
                            <span>{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
            <p className="mb-6 opacity-90">
              Interested in collaborating on a project? I'm always open to discussing 
              new opportunities and ideas.
            </p>
            <a href="/contact" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Get In Touch
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}