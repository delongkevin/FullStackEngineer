import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/kevin-delong-50726135b/', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/delongkevin1446', label: 'X' },
    { icon: Mail, href: 'mailto:delong.kevin@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-white">Kevin Delong</h3>
            <p className="text-gray-400 mt-2">Full Stack & Frontend Developer</p>
          </div>
          
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kevin Douglas Delong. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}