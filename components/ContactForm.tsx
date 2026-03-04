'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      const { [name as keyof typeof errors]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    setStatusMessage('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Accessible Status Message */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`p-4 rounded-lg transition-opacity ${
          statusMessage
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {statusMessage || '\u00A0'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="cf-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your name"
          />
          {errors.name && (
            <span id="cf-name-error" role="alert" className="text-red-600 text-sm mt-1 block">
              {errors.name}
            </span>
          )}
        </div>
        
        <div>
          <label htmlFor="cf-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="cf-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your email"
          />
          {errors.email && (
            <span id="cf-email-error" role="alert" className="text-red-600 text-sm mt-1 block">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="cf-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          aria-required="true"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="What's this about?"
        />
        {errors.subject && (
          <span id="cf-subject-error" role="alert" className="text-red-600 text-sm mt-1 block">
            {errors.subject}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="cf-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          aria-required="true"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
          placeholder="Tell me about your project..."
        ></textarea>
        {errors.message && (
          <span id="cf-message-error" role="alert" className="text-red-600 text-sm mt-1 block">
            {errors.message}
          </span>
        )}
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
  );
}