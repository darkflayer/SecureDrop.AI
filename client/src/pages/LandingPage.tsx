import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  UserIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import FinalsLogo from '../components/FinalsLogo';
import DarkModeToggle from '../components/DarkModeToggle';
import PremiumCarousel from '../components/PremiumCarousel';

const LandingPage: React.FC = () => {
  const [complaintId, setComplaintId] = useState('');
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTrackComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintId.trim()) {
      window.location.href = `/track/${complaintId.trim()}`;
    }
  };

  const navigationItems = [
    { href: '#about', label: 'About' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it Works' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Professional Header with Mobile Menu */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-lg' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      }`}>
        <div className="container-premium">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center group">
              <div className="relative">
                <FinalsLogo className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 transform group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient">SecureDrop.AI</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
              {navigationItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 relative group font-medium"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <Link to="/admin/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors duration-300 font-medium">
                <UserIcon className="w-4 h-4 mr-1" />
                Admin
              </Link>
              <DarkModeToggle />
            </nav>
            
            {/* Mobile Menu Button & CTA */}
            <div className="flex items-center space-x-3">
              <Link 
                to="/organizations" 
                className="hidden sm:inline-block btn-primary text-sm lg:text-base px-4 py-2 lg:px-6 lg:py-3"
              >
                Submit Feedback
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-4">
              {navigationItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
                >
                  {item.label}
                </a>
              ))}
              <Link 
                to="/admin/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Admin Login
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</span>
                <DarkModeToggle />
              </div>
              <Link 
                to="/organizations" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block sm:hidden btn-primary text-center"
              >
                Submit Feedback
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Professional Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Subtle Professional Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-40"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full filter blur-3xl opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full filter blur-3xl opacity-30"></div>
          </div>
        </div>

        <div className="relative z-10 container-premium text-center px-4">
          <div className="animate-slide-down">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 lg:mb-8">
              <span className="text-gray-900 dark:text-white">Your Voice,</span><br />
              <span className="text-gradient-accent">Heard Anonymously</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in">
              SecureDrop.AI is a revolutionary platform for anonymous feedback submission. 
              Share your thoughts freely and securely with advanced AI-powered insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center animate-slide-up max-w-lg mx-auto sm:max-w-none">
            <Link to="/organizations" className="btn-primary group w-full sm:w-auto">
              <span className="flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Submit Feedback
              </span>
            </Link>
            <button
              onClick={() => setShowTrackForm(!showTrackForm)}
              className="btn-secondary group w-full sm:w-auto"
            >
              <span className="flex items-center justify-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Track Complaint
              </span>
            </button>
          </div>

          {/* Professional Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-12 lg:mt-16 animate-fade-in">
            {[
              { value: '100+', label: 'Secure Submissions' },
              { value: '10+', label: 'Organizations' },
              { value: '98%', label: 'Satisfaction Rate' },
              { value: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Track Complaint Form */}
      {showTrackForm && (
        <section className="relative py-8 px-4">
          <div className="container-premium">
            <div className="max-w-md mx-auto animate-scale-in">
              <div className="card-glass p-6 lg:p-8">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <MagnifyingGlassIcon className="w-5 lg:w-6 h-5 lg:h-6 mr-3 text-blue-600" />
                  Track Your Complaint
                </h3>
                <form onSubmit={handleTrackComplaint} className="space-y-4 lg:space-y-6">
                  <div>
                    <label htmlFor="complaintId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Complaint ID
                    </label>
                    <input
                      type="text"
                      id="complaintId"
                      value={complaintId}
                      onChange={(e) => setComplaintId(e.target.value)}
                      placeholder="Enter your complaint ID"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    Track Complaint
                  </button>
                </form>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                  Don't have a complaint ID? <Link to="/organizations" className="text-blue-600 dark:text-blue-400 hover:underline">Submit a new complaint</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Premium Carousel Section */}
      <section id="features" className="section-padding bg-white dark:bg-gray-800">
        <div className="container-premium px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-secondary">Experience the Future</h2>
            <p className="text-body max-w-3xl mx-auto">
              Discover how SecureDrop.AI is revolutionizing anonymous feedback with cutting-edge technology and user-centric design.
            </p>
          </div>
          <PremiumCarousel />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-premium px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-secondary">About SecureDrop.AI</h2>
            <p className="text-body max-w-4xl mx-auto">
              SecureDrop.AI is an innovative platform designed to empower individuals to voice their concerns, 
              complaints, and feedback anonymously and securely. Our mission is to create a safe space where 
              everyone can speak up without fear of retaliation.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="card-premium p-6 lg:p-8">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 lg:mb-6">
                <GlobeAltIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">Our Vision</h3>
              <p className="text-body">
                To be the most trusted platform for anonymous reporting and feedback, driving positive change 
                in organizations and communities worldwide through transparency and empowerment.
              </p>
            </div>
            
            <div className="card-premium p-6 lg:p-8">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 lg:mb-6">
                <SparklesIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">Our Values</h3>
              <div className="text-body space-y-2">
                {['Privacy & Anonymity', 'Transparency', 'Empowerment', 'Responsiveness'].map((value, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-purple-500' :
                      index === 2 ? 'bg-emerald-500' : 'bg-orange-500'
                    }`}></div>
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Features Grid */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-premium px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-secondary">Why Choose SecureDrop.AI?</h2>
            <p className="text-body max-w-3xl mx-auto">
              Our platform is designed with your privacy and convenience in mind, featuring cutting-edge technology 
              and user-centric design principles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: 'Anonymous & Secure',
                description: 'Your identity is always protected with enterprise-grade encryption. Submit feedback without revealing your personal information.',
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                icon: BoltIcon,
                title: 'Real-Time Feedback',
                description: 'Receive immediate responses and updates on your submissions through our advanced real-time communication system.',
                gradient: 'from-emerald-500 to-teal-600'
              },
              {
                icon: UserGroupIcon,
                title: 'Community Driven',
                description: 'Join a global community of users shaping the future of products and services through meaningful feedback and collaboration.',
                gradient: 'from-pink-500 to-red-600'
              }
            ].map((feature, index) => (
              <div key={index} className="card-premium p-6 lg:p-8 text-center group">
                <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
                  {feature.title}
                </h3>
                <p className="text-body text-sm lg:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-premium px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-secondary">How It Works</h2>
            <p className="text-body max-w-3xl mx-auto">
              Our streamlined process makes it easy to submit feedback and track your complaints 
              through every step of the journey.
            </p>
          </div>
          
          <div className="space-y-8 lg:space-y-16">
            {[
              {
                step: '01',
                title: 'Submit Your Feedback',
                description: 'Fill out our secure form with your complaint or feedback. Attach media files and provide detailed information.',
                icon: ChatBubbleBottomCenterTextIcon,
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                step: '02',
                title: 'Get Your Unique ID',
                description: 'Receive a unique complaint ID to track your submission and receive real-time updates on progress.',
                icon: ClockIcon,
                gradient: 'from-emerald-500 to-teal-600'
              },
              {
                step: '03',
                title: 'Track & Communicate',
                description: 'Monitor your complaint status and communicate with administrators through our secure messaging system.',
                icon: MagnifyingGlassIcon,
                gradient: 'from-pink-500 to-red-600'
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                <div className="flex-shrink-0 order-2 lg:order-1">
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center shadow-xl`}>
                    <item.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 order-1 lg:order-2">
                  <div className="card-premium p-6 lg:p-8 text-center lg:text-left">
                    <div className="text-4xl lg:text-6xl font-bold text-gradient mb-3 lg:mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-body">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container-premium text-center text-white px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 lg:mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of users who trust SecureDrop.AI for secure, anonymous feedback submission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center max-w-lg mx-auto sm:max-w-none">
            <Link to="/organizations" className="btn-glass w-full sm:w-auto">
              <span className="flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Submit Feedback Now
              </span>
            </Link>
            <Link to="/admin/register" className="btn-glass w-full sm:w-auto">
              <span className="flex items-center justify-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Register Organization
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white dark:bg-gray-800">
        <div className="container-premium px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="heading-secondary">Get In Touch</h2>
            <p className="text-body max-w-2xl mx-auto">
              Have questions or need support? We're here to help you 24/7 with any inquiries.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: '📧',
                title: 'Email',
                link: 'mailto:rautanhemu@gmail.com',
                value: 'rautanhemu@gmail.com',
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                icon: '📱',
                title: 'Instagram',
                link: 'https://instagram.com/hemu_rautan',
                value: '@hemu_rautan',
                gradient: 'from-pink-500 to-red-600'
              },
              {
                icon: '📞',
                title: 'Phone',
                link: 'tel:7017862900',
                value: '+91 70178 62900',
                gradient: 'from-emerald-500 to-teal-600'
              }
            ].map((contact, index) => (
              <div key={index} className="card-premium p-6 lg:p-8 text-center group">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${contact.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-2xl lg:text-3xl">{contact.icon}</span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3">{contact.title}</h3>
                <a 
                  href={contact.link} 
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm lg:text-base"
                  {...(contact.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {contact.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-900 dark:bg-black py-8 lg:py-12">
        <div className="container-premium px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex items-center">
              <FinalsLogo className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3" />
              <span className="text-lg lg:text-xl font-bold text-white">SecureDrop.AI</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Terms of Service</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Contact Us</a>
              <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Admin Access</Link>
            </div>
            
            <div className="text-gray-400 text-center lg:text-right text-sm lg:text-base">
              <p>© 2024 SecureDrop.AI</p>
              <p className="text-xs lg:text-sm">All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
