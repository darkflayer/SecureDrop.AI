import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, ClockIcon, UserGroupIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import FinalsLogo from '../components/FinalsLogo';

const LandingPage: React.FC = () => {
  const [complaintId, setComplaintId] = useState('');
  const [showTrackForm, setShowTrackForm] = useState(false);

  const handleTrackComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintId.trim()) {
      window.location.href = `/track/${complaintId.trim()}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <FinalsLogo className="w-8 h-8 mr-2" />
              <span className="text-xl font-semibold text-black">SecureDrop.AI</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-black hover:text-gray-600">About</a>
              <a href="#how-it-works" className="text-black hover:text-gray-600">How it Works</a>
              <a href="#contact" className="text-black hover:text-gray-600">Contact</a>
              <Link to="/admin/login" className="text-black hover:text-gray-600 flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                Admin Login
              </Link>
            </nav>
            
            {/* CTA Button */}
            <Link 
              to="/organizations" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Feedback
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-100 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Voice, Heard Anonymously
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            SecureDrop.AI is a real-time, anonymous platform for submitting complaints and feedback. 
            Share your thoughts freely and securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/organizations" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Feedback
            </Link>
            <button
              onClick={() => setShowTrackForm(!showTrackForm)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Track Complaint
            </button>
          </div>
        </div>
      </section>
      
      {/* Track Complaint Form */}
      {showTrackForm && (
        <section className="bg-white py-8 border-b">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Track Your Complaint
              </h3>
              <form onSubmit={handleTrackComplaint} className="space-y-4">
                <div>
                  <label htmlFor="complaintId" className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint ID
                  </label>
                  <input
                    type="text"
                    id="complaintId"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    placeholder="Enter your complaint ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Track Complaint
                </button>
              </form>
              <p className="text-sm text-gray-600 mt-3">
                Don't have a complaint ID? <Link to="/organizations" className="text-blue-600 hover:underline">Submit a new complaint</Link>
              </p>
            </div>
          </div>
        </section>
      )}



      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About SecureDrop.AI</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            SecureDrop.AI is an innovative platform designed to empower individuals to voice their concerns, complaints, and feedback anonymously and securely. Our mission is to create a safe space where everyone can speak up without fear of retaliation, ensuring every voice is heard and acted upon. With real-time communication, robust privacy measures, and intelligent AI analysis, we bridge the gap between users and organizations, fostering transparency and trust in every interaction.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-8">
            <div className="flex-1 bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Vision</h3>
              <p className="text-gray-700">To be the most trusted platform for anonymous reporting and feedback, driving positive change in organizations and communities worldwide.</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Values</h3>
              <ul className="text-gray-700 list-disc ml-5 text-left">
                <li>Privacy & Anonymity</li>
                <li>Transparency</li>
                <li>Empowerment</li>
                <li>Responsiveness</li>
                <li>Community-driven improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SecureDrop.AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is designed with your privacy and convenience in mind.
            </p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Learn More
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Anonymous Submissions */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Anonymous Submissions
              </h3>
              <p className="text-gray-600">
                Your identity is always protected. Submit feedback without revealing your personal information.
              </p>
            </div>

            {/* Real-Time Feedback */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-Time Feedback
              </h3>
              <p className="text-gray-600">
                Receive immediate responses and updates on your submissions.
              </p>
            </div>

            {/* Community Driven */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Join a community of users shaping the future of products and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Submit Your Feedback</h3>
              <p className="text-gray-600">Fill out our simple form with your complaint or feedback. You can also attach media files.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Your ID</h3>
              <p className="text-gray-600">Receive a unique complaint ID to track your submission and receive updates.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track & Communicate</h3>
              <p className="text-gray-600">Monitor your complaint status and communicate with administrators in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Share Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Share Your Thoughts?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your feedback can make a difference. Start submitting anonymously today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/organizations" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Feedback
            </Link>
            <Link 
              to="/admin/register" 
              className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Register Organization
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gmail</h3>
              <a href="mailto:rautanhemu@gmail.com" className="text-blue-600 hover:underline">rautanhemu@gmail.com</a>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instagram</h3>
              <a href="https://instagram.com/hemu_rautan" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@hemu_rautan</a>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <a href="tel:7017862900" className="text-blue-600 hover:underline">7017862900</a>
            </div>
          </div>
          <div className="mt-10 text-center text-gray-600">
            For any queries, suggestions, or support, feel free to reach out to us. We are here to help you 24/7!
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 mb-4 md:mb-0">
              <a href="#privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact Us</a>
            </div>
            <div className="flex space-x-4">
              <Link to="/admin/login" className="text-gray-600 hover:text-gray-900 flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                Admin Access
              </Link>
            </div>
            <div className="text-gray-600 mt-4 md:mt-0">
              © 2024 SecureDrop.AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 