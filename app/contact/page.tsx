'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, Loader2, Github, Twitter, Heart } from 'lucide-react';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newErrors: typeof errors = {};
    if (!formData.get('name')?.toString().trim()) newErrors.name = 'Name is required.';
    if (!formData.get('email')?.toString().trim()) newErrors.email = 'Email address is required.';
    if (!formData.get('subject')?.toString().trim()) newErrors.subject = 'Subject is required.';
    if (!formData.get('message')?.toString().trim()) newErrors.message = 'Message is required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });
      
      if (response.ok) {
        setMessage('Thank you! Your message has been sent successfully.');
        form.reset();
      } else {
        setMessage('Sorry, there was an error sending your message. Please try again.');
      }
    } catch (error) {
      setMessage('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <main id="main-content" className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold theme-text-primary mb-4">Get In Touch</h1>
            <p className="text-base sm:text-xl theme-text-secondary max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? I'd love to hear from you. 
              Send me a message and I'll respond as soon as possible.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold theme-text-primary mb-6">Contact Information</h2>
               
              <div className="space-y-6">
                                <div className="flex items-start">
                  <div className="p-3 rounded-full mr-4" aria-hidden="true" style={{ background: 'var(--accent-soft)' }}>
                    <Mail className="theme-accent-text" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">Email</h3>
                    <p className="theme-text-secondary">delong.kevin@gmail.com</p>
                    <p className="text-sm theme-text-tertiary">Typically replies within 24 hours</p>
                  </div>
                </div>

                                <div className="flex items-start">
                  <div className="p-3 rounded-full mr-4" aria-hidden="true" style={{ background: 'var(--accent-soft)' }}>
                    <Phone className="theme-accent-text" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">Phone</h3>
                    <p className="theme-text-secondary">(810) 287-7409</p>
                    <p className="text-sm theme-text-tertiary">Prefer texts, but available for calls</p>
                  </div>
                </div>

                                <div className="flex items-start">
                  <div className="p-3 rounded-full mr-4" aria-hidden="true" style={{ background: 'var(--accent-soft)' }}>
                    <MapPin className="theme-accent-text" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">Location</h3>
                    <p className="theme-text-secondary">United States</p>
                    <p className="text-sm theme-text-tertiary">Available for remote work worldwide</p>
                  </div>
                </div>
                            <div className="flex items-start">
                <div className="p-3 rounded-full mr-4" aria-hidden="true" style={{ background: 'var(--accent-soft)' }}>
                  <Heart className="theme-accent-text" size={28} />
                </div>
                <div>
                  <h3 className="font-semibold theme-text-primary">Support My Work</h3>
                  <p className="theme-text-secondary text-sm mb-2">
                    Support my open-source projects and development work!
                  </p>
                  <a
                    href="https://account.venmo.com/u/KDelong147"
                    className="inline-flex items-center gap-2 theme-accent-text hover:opacity-85 font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19.5 3C21.4 3 23 4.6 23 6.5S21.4 10 19.5 10H18v7.5c0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5V10H4.5C2.6 10 1 8.4 1 6.5S2.6 3 4.5 3h15zM6 10v7h12v-7H6z"/>
                    </svg>
                    Find me on Venmo
                  </a>
                </div>
          </div>
          </div>
          

              {/* Social Links */}
          
              <div className="mt-8">
                <h3 className="font-semibold theme-text-primary mb-4">Follow Me</h3>
          <div className="flex space-x-4">
                                    <a
                                      href="https://github.com/delongkevin"
                    className="surface-subtle theme-text-secondary hover:opacity-80 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                  >
                    <Github size={20} aria-hidden="true" />
                  </a>
                                    <a
                    href="https://x.com/delongkevin1446"
                    className="surface-subtle theme-text-secondary hover:opacity-80 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter profile"
                  >
                    <Twitter size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                name="contact"
                method="POST"
                data-netlify="true"
                noValidate
                className="surface-card rounded-2xl shadow-lg p-5 sm:p-8"
              >
                <input type="hidden" name="form-name" value="contact"/>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium theme-text-secondary mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      aria-required="true"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="w-full px-4 py-3 theme-input rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <span id="name-error" role="alert" className="text-red-600 text-sm mt-1 block">
                        {errors.name}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium theme-text-secondary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="w-full px-4 py-3 theme-input rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <span id="email-error" role="alert" className="text-red-600 text-sm mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium theme-text-secondary mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    aria-required="true"
                    aria-invalid={errors.subject ? "true" : "false"}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    className="w-full px-4 py-3 theme-input rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <span id="subject-error" role="alert" className="text-red-600 text-sm mt-1 block">
                      {errors.subject}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium theme-text-secondary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    rows={6}
                    className="w-full px-4 py-3 theme-input rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                    placeholder="Tell me about your project..."
                  ></textarea>
                  {errors.message && (
                    <span id="message-error" role="alert" className="text-red-600 text-sm mt-1 block">
                      {errors.message}
                    </span>
                  )}
                </div>

                                {/* Success/Error Message */}
                <div
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className={`mb-6 p-4 rounded-lg transition-opacity ${
                    message
                      ? (message.includes('Thank you')
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200')
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {message || '\u00A0'}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                                    {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2" size={18} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
