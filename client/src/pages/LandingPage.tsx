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
  ChatBubbleBottomCenterTextIcon 
} from '@heroicons/react/24/outline';
import FinalsLogo from '../components/FinalsLogo';
import DarkModeToggle from '../components/DarkModeToggle';
import PremiumCarousel from '../components/PremiumCarousel';

const LandingPage: React.FC = () => {
  const [complaintId, setComplaintId] = useState('');
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Premium Header with Glass Morphism */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-xl' 
          : 'bg-transparent'
      }`}>
        <div className="container-premium">
          <div className="flex justify-between items-center py-4">
            {/* Animated Logo */}
            <div className="flex items-center group">
              <div className="relative">
                <FinalsLogo className="w-10 h-10 mr-3 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 w-10 h-10 bg-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-gradient">SecureDrop.AI</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 relative group">
                How it Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link to="/admin/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors duration-300">
                <UserIcon className="w-4 h-4 mr-1" />
                Admin
              </Link>
              <DarkModeToggle />
            </nav>
            
            {/* CTA Button */}
            <Link to="/organizations" className="btn-primary">
              Submit Feedback
            </Link>
          </div>
        </div>
      </header>

      {/* Premium Hero Section with 3D Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-bg opacity-10"></div>
        
        {/* Floating 3D Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400 to-teal-600 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
          
          {/* Geometric 3D Shapes */}
          <div className="absolute top-1/3 left-1/4 w-16 h-16 border-4 border-blue-400/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-12 h-12 border-4 border-purple-400/30 rotate-12 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        </div>

        <div className="relative z-10 container-premium text-center">
          <div className="animate-slide-down">
            <h1 className="heading-primary leading-tight mb-8">
              Your Voice,<br />
              <span className="text-gradient-accent">Heard Anonymously</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in">
              SecureDrop.AI is a revolutionary platform for anonymous feedback submission. 
              Share your thoughts freely and securely with advanced AI-powered insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            <Link to="/organizations" className="btn-primary group">
              <span className="flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Submit Feedback
              </span>
            </Link>
            <button
              onClick={() => setShowTrackForm(!showTrackForm)}
              className="btn-secondary group"
            >
              <span className="flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Track Complaint
              </span>
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Secure Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Track Complaint Form with Glass Morphism */}
      {showTrackForm && (
        <section className="relative py-8">
          <div className="container-premium">
            <div className="max-w-md mx-auto animate-scale-in">
              <div className="card-glass p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <MagnifyingGlassIcon className="w-6 h-6 mr-3 text-blue-600" />
                  Track Your Complaint
                </h3>
                <form onSubmit={handleTrackComplaint} className="space-y-6">
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
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="heading-secondary">Experience the Future</h2>
            <p className="text-body max-w-3xl mx-auto">
              Discover how SecureDrop.AI is revolutionizing anonymous feedback with cutting-edge technology and user-centric design.
            </p>
          </div>
          <PremiumCarousel />
        </div>
      </section>

      {/* About Section with Premium Cards */}
      <section id="about" className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="heading-secondary">About SecureDrop.AI</h2>
            <p className="text-body max-w-4xl mx-auto">
              SecureDrop.AI is an innovative platform designed to empower individuals to voice their concerns, 
              complaints, and feedback anonymously and securely. Our mission is to create a safe space where 
              everyone can speak up without fear of retaliation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-premium p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <GlobeAltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-body">
                To be the most trusted platform for anonymous reporting and feedback, driving positive change 
                in organizations and communities worldwide through transparency and empowerment.
              </p>
            </div>
            
            <div className="card-premium p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h3>
              <ul className="text-body space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Privacy & Anonymity
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Transparency
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Empowerment
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Responsiveness
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="heading-secondary">Why Choose SecureDrop.AI?</h2>
            <p className="text-body max-w-3xl mx-auto">
              Our platform is designed with your privacy and convenience in mind, featuring cutting-edge technology 
              and user-centric design principles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-premium p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Anonymous & Secure
              </h3>
              <p className="text-body">
                Your identity is always protected with enterprise-grade encryption. Submit feedback without 
                revealing your personal information.
              </p>
            </div>

            <div className="card-premium p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BoltIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Real-Time Feedback
              </h3>
              <p className="text-body">
                Receive immediate responses and updates on your submissions through our advanced 
                real-time communication system.
              </p>
            </div>

            <div className="card-premium p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Community Driven
              </h3>
              <p className="text-body">
                Join a global community of users shaping the future of products and services through 
                meaningful feedback and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works with Timeline */}
      <section id="how-it-works" className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="heading-secondary">How It Works</h2>
            <p className="text-body max-w-3xl mx-auto">
              Our streamlined process makes it easy to submit feedback and track your complaints 
              through every step of the journey.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full hidden md:block"></div>
            
            <div className="space-y-16">
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
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:pr-8">
                    <div className={`card-premium p-8 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`text-6xl font-bold text-gradient mb-4 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        {item.step}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {item.title}
                      </h3>
                      <p className="text-body">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="hidden md:flex w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center mx-8 z-10 shadow-xl">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1 md:pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container-premium text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of users who trust SecureDrop.AI for secure, anonymous feedback submission.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/organizations" className="btn-glass">
              <span className="flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Submit Feedback Now
              </span>
            </Link>
            <Link to="/admin/register" className="btn-glass">
              <span className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Register Organization
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white dark:bg-gray-800">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="heading-secondary">Get In Touch</h2>
            <p className="text-body max-w-2xl mx-auto">
              Have questions or need support? We're here to help you 24/7 with any inquiries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-premium p-8 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Email</h3>
              <a href="mailto:rautanhemu@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                rautanhemu@gmail.com
              </a>
            </div>
            
            <div className="card-premium p-8 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instagram</h3>
              <a href="https://instagram.com/hemu_rautan" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                @hemu_rautan
              </a>
            </div>
            
            <div className="card-premium p-8 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Phone</h3>
              <a href="tel:7017862900" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                +91 70178 62900
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-900 dark:bg-black py-12">
        <div className="container-premium">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <FinalsLogo className="w-8 h-8 mr-3" />
              <span className="text-xl font-bold text-white">SecureDrop.AI</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a>
              <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors duration-300">Admin Access</Link>
            </div>
            
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2024 SecureDrop.AI</p>
              <p className="text-sm">All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
