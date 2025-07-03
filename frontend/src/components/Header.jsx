import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Info } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand - Clickable to go home */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/horse-logo.png" 
                alt="Vealth Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg items-center justify-center text-white font-bold text-lg hidden">
                V
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Vealth</h1>
              <p className="text-xs text-gray-500">AI Equine Health Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/how-it-works"
              className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors"
            >
              How it Works
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/how-it-works"
                className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}

        {/* Beta Notice */}
        <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-teal-800 font-medium">Beta Version</p>
              <p className="text-teal-700">
                This is a demonstration version. Results are for educational purposes only. 
                Always consult with a qualified equine veterinarian for professional diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;