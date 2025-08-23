import React, { useState } from 'react';
import FinalsLogo from '../components/FinalsLogo';
import DarkModeToggle from '../components/DarkModeToggle';
import { API_URL } from '../config';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  PhotoIcon, 
  PaperAirplaneIcon, 
  HomeIcon, 
  SparklesIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const SubmitFeedback: React.FC = () => {
  const { orgCode } = useParams<{ orgCode: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    media: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: 'Security Breach', icon: '🛡️', color: 'from-red-500 to-pink-600' },
    { value: 'User Feedback', icon: '💬', color: 'from-blue-500 to-purple-600' },
    { value: 'System Error', icon: '⚠️', color: 'from-orange-500 to-red-500' },
    { value: 'Feature Request', icon: '💡', color: 'from-yellow-500 to-orange-500' },
    { value: 'Performance Issue', icon: '⚡', color: 'from-emerald-500 to-teal-600' },
    { value: 'Other', icon: '📝', color: 'from-gray-500 to-gray-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        media: e.target.files[0]
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({
        ...formData,
        media: e.dataTransfer.files[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('message', `${formData.title}\n\n${formData.description}`);
      formDataToSend.append('orgCode', orgCode || 'demo');
      if (formData.media) {
        formDataToSend.append('media', formData.media);
      }

      const response = await fetch(`${API_URL}/api/complaint/submit`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        navigate(`/track/${result.complaintId}`);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Premium Header */}
      <header className="glass backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-lg sticky top-0 z-50">
        <div className="container-premium">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="relative">
                <FinalsLogo className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 transform group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient">SecureDrop.AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Link 
                to="/" 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                <HomeIcon className="w-4 h-4 mr-1" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Professional Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-40"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full filter blur-3xl opacity-40"></div>
          </div>
        </div>

        <div className="relative z-10 container-premium px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-12 lg:mb-16 animate-slide-down">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8">
                <span className="text-gray-900 dark:text-white">Submit Your</span><br />
                <span className="text-gradient-accent">Anonymous Feedback</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Share your thoughts, concerns, or suggestions securely and anonymously to <span className="font-semibold text-blue-600 dark:text-blue-400">{orgCode}</span>.
              </p>
            </div>

            {/* Main Form */}
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
                {/* Title Field */}
                <div className="card-premium p-6 lg:p-8">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief summary of your feedback"
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="card-premium p-6 lg:p-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setFormData({...formData, category: category.value})}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.category === category.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.value}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Field */}
                <div className="card-premium p-6 lg:p-8">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed explanation of your feedback. The more specific you are, the better we can address your concerns."
                    rows={6}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    required
                  />
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <ExclamationCircleIcon className="w-4 h-4 inline mr-1" />
                    Your identity remains completely anonymous. Do not include personal information.
                  </div>
                </div>

                {/* Media Upload */}
                <div className="card-premium p-6 lg:p-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Upload Supporting Media (Optional)
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {formData.media ? (
                      <div className="space-y-4">
                        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">File Selected</p>
                          <p className="text-gray-600 dark:text-gray-400">{formData.media.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(formData.media.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, media: null})}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <label
                            htmlFor="media"
                            className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                          >
                            Choose a file
                          </label>
                          <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                          <input
                            id="media"
                            name="media"
                            type="file"
                            className="hidden"
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF, MP4, PDF, DOC up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <ExclamationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>All media uploads are automatically anonymized to protect your identity. Metadata is stripped from files.</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.category}
                    className="btn-primary group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                          Submit Feedback
                        </>
                      )}
                    </span>
                  </button>
                  
                  <Link to="/organizations" className="btn-secondary">
                    Back to Organization Select
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Assurance Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-premium px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Privacy is Our Priority
            </h2>
            <p className="text-body mb-8">
              We use advanced encryption and anonymization techniques to ensure your feedback cannot be traced back to you.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🔐',
                  title: 'End-to-End Encryption',
                  description: 'All data is encrypted before transmission and storage'
                },
                {
                  icon: '🚫',
                  title: 'No Personal Data',
                  description: 'We never collect or store personally identifiable information'
                },
                {
                  icon: '🛡️',
                  title: 'Secure Infrastructure',
                  description: 'Enterprise-grade security with regular audits and monitoring'
                }
              ].map((feature, index) => (
                <div key={index} className="card-premium p-6 text-center">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
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
              <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Home</Link>
              <a href="/#about" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">About</a>
              <a href="/#contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Contact</a>
              <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Admin</Link>
            </div>
            
            <div className="text-gray-400 text-center lg:text-right text-sm lg:text-base">
              <p>© 2024 SecureDrop.AI</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubmitFeedback;
