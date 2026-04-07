'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, Loader2, Linkedin, Github, Twitter, Heart, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      onStatusChange?: (status: string) => void;
      maximize?: () => void;
      popup?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});
  const [chatStatus, setChatStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  // Fallback IDs ensure chat still works for static export workflows where runtime env is unavailable.
  const defaultTawkPropertyId = '69d51cf32bcfb31c3daa3057';
  const defaultTawkWidgetId = '1jlk7i5ot';

  const tawkPropertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || defaultTawkPropertyId;
  const tawkWidgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || defaultTawkWidgetId;
  const chatEnabled = Boolean(tawkPropertyId && tawkWidgetId);

  useEffect(() => {
    if (!chatEnabled) {
      setChatStatus('offline');
      return;
    }

    const scriptId = 'tawkto-chat-script';

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    window.Tawk_API.onStatusChange = (status: string) => {
      if (status === 'online') {
        setChatStatus('online');
        return;
      }
      setChatStatus('offline');
    };

    window.Tawk_API.onLoad = () => {
      // Keep loading state until first status callback arrives.
      setChatStatus((prev) => (prev === 'loading' ? 'offline' : prev));
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.body.appendChild(script);
    }
  }, [chatEnabled, tawkPropertyId, tawkWidgetId]);

  const handleStartChat = () => {
    if (!chatEnabled) {
      return;
    }
    if (window.Tawk_API?.maximize) {
      window.Tawk_API.maximize();
      return;
    }
    window.Tawk_API?.popup?.();
  };

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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? I'd love to hear from you. 
              Send me a message and I'll respond as soon as possible.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="text-blue-600" size={18} aria-hidden="true" />
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                      chatStatus === 'online'
                        ? 'bg-green-100 text-green-700'
                        : chatStatus === 'loading'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        chatStatus === 'online'
                          ? 'bg-green-500'
                          : chatStatus === 'loading'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      aria-hidden="true"
                    />
                    {chatStatus === 'online' ? 'Online' : chatStatus === 'loading' ? 'Checking' : 'Offline'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {chatStatus === 'online'
                    ? 'I am online now. Start a live chat for the fastest response.'
                    : 'If I am offline, please use the form below and I will get back to you quickly.'}
                </p>
                <button
                  type="button"
                  onClick={handleStartChat}
                  disabled={!chatEnabled}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Start Live Chat
                </button>
                {!chatEnabled && (
                  <p className="text-xs text-gray-500 mt-2">
                    Live chat is disabled. Add Netlify env vars NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID.
                  </p>
                )}
              </div>
              
              <div className="space-y-6">
                                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4" aria-hidden="true">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">delong.kevin@gmail.com</p>
                    <p className="text-sm text-gray-500">Typically replies within 24 hours</p>
                  </div>
                </div>

                                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4" aria-hidden="true">
                    <Phone className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">(810) 287-7409</p>
                    <p className="text-sm text-gray-500">Prefer texts, but available for calls</p>
                  </div>
                </div>

                                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4" aria-hidden="true">
                    <MapPin className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">United States</p>
                    <p className="text-sm text-gray-500">Available for remote work worldwide</p>
                  </div>
                </div>
                            <div className="flex items-start">
                <div className="bg-pink-100 p-3 rounded-full mr-4" aria-hidden="true">
                  <Heart className="text-pink-600" size={30} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Support My Work</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Support my open-source projects and development work!
                  </p>
                  <a
                    href="https://account.venmo.com/u/KDelong147"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
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
                <h3 className="font-semibold text-gray-900 mb-4">Follow Me</h3>
          <div className="flex space-x-4">
                                    <a
                    href="https://www.linkedin.com/in/kevin-delong-50726135b/"
                    className="bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin size={20} aria-hidden="true" />
                  </a>
                                    <a
                                      href="https://github.com/delongkevin"
                    className="bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                  >
                    <Github size={20} aria-hidden="true" />
                  </a>
                                    <a
                    href="https://x.com/delongkevin1446"
                    className="bg-gray-100 text-gray-600 hover:bg-black hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
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
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <input type="hidden" name="form-name" value="contact"/>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <span id="name-error" role="alert" className="text-red-600 text-sm mt-1 block">
                        {errors.name}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <span id="subject-error" role="alert" className="text-red-600 text-sm mt-1 block">
                      {errors.subject}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
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
