import { Github, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { 
      icon: Github, 
      href: 'https://github.com/delongkevin', 
      label: 'GitHub' 
    },
    { 
      icon: Twitter, 
      href: 'https://x.com/delongkevin1446', 
      label: 'Twitter' 
    },
    { 
      icon: Mail, 
      href: 'mailto:delong.kevin@gmail.com', 
      label: 'Email' 
    },
  ];

  return (
    <footer className="py-12" aria-label="Site footer" style={{ background: 'var(--surface-1)', color: 'var(--text-1)', borderTop: '1px solid var(--border-soft)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold theme-text-primary">Kevin Delong</h3>
            <p className="theme-text-secondary mt-2">Full Stack & Frontend Developer</p>
          </div>
          
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="theme-text-secondary hover:opacity-80 transition-colors"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon size={24} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="border-t theme-border mt-8 pt-8 text-center theme-text-secondary">
          <p>&copy; {new Date().getFullYear()} Kevin Douglas Delong. All rights reserved.</p>
          <p className="mt-2 text-sm">Phone: (810) 287-7409 | Email: delong.kevin@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
