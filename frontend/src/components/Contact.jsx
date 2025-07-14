import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, User, MessageCircle, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const teamMembers = [
    {
      name: "Kseniia Vinogradova",
      role: "Backend Developer & AI Developer",
      bio: "Health Informatics student with a passion in machine learning. Aims to use AI to improve animal welfare.",
      email: "kseniia.vinogradova@stud.th-deg.de",
      github: "kseniiavi",
      linkedin: "kseniia-vinogradova-900468302",
      avatar: "/kseniia.png"
    },
    {
      name: "Maryem Mohamed",
      role: "Full-Stack Developer & Product Manager",
      bio: "Health Informatics student with a passion for web development. Focused on creating intuitive interfaces for complex technologies.",
      email: "maryem.abdellah@stud.th-deg.de",
      github: "Maryem29",
      linkedin: "maryemabdellah29",
      avatar: "maryem.jpeg"
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      details: "vealth@gmail.com",
      link: "mailto:support@vealth.ai"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Support",
      details: "Available 24/7 for technical assistance",
      link: "#"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location",
      details: "Remote Team - Global Support",
      link: "#"
    }
  ];

  const faqs = [
    {
      question: "How accurate is Vealth?",
      answer: "Our AI system provides age estimates with confidence scores. Our goal is to train out AI on data provided from top vet universities in Germany and from specialists for the most accurate results. While accurate, it should supplement, not replace, professional veterinary assessment."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we prioritize data security. Images are processed locally when possible, and any data transmitted is encrypted and not stored permanently."
    },
    {
      question: "Can I use this for official purposes?",
      answer: "Vealth is designed for preliminary assessment and educational purposes. For official documentation, always consult with a qualified veterinarian. Our suggestion is to download the report and send it to your vet for further inquiry."
    },
    {
      question: "What image quality do I need?",
      answer: "Clear, well-lit photos of the horse's front teeth work best. Avoid shadows and ensure the teeth are clearly visible and in focus."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about Vealth? We'd love to hear from you. 
          Get in touch with our team and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-teal-600">
                      {info.icon}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{info.title}</p>
                    <p className="text-gray-600 text-sm">{info.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-2">Response Time</h3>
            <p className="text-teal-700 text-sm">
              We typically respond to all inquiries within 24 hours. 
              For urgent technical issues, please use our support email for faster assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <div className="flex items-start space-x-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-teal-600 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  
                  {/* Contact Links */}
                  <div className="flex space-x-3">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-teal-600 transition-colors"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://github.com/${member.github}`}
                      className="text-gray-400 hover:text-teal-600 transition-colors"
                      title="GitHub"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://linkedin.com/in/${member.linkedin}`}
                      className="text-gray-400 hover:text-teal-600 transition-colors"
                      title="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Experience the power of AI-driven equine health assessment. 
            Join thousands of horse owners who trust Vealth for accurate age estimation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Try Vealth Now
            </Link>
            <Link
              to="/how-it-works"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors inline-flex items-center justify-center"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Contact Options */}
      <div className="mt-16 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Connect</h3>
        <div className="flex justify-center space-x-6">
          <a
            href="mailto:support@vealth.ai"
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Email Support
          </a>
          <a
            href="https://github.com/vealth"
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5 mr-2" />
            GitHub
          </a>
          <a
            href="#"
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Live Chat
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;