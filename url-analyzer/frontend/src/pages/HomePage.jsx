import { useRef } from 'react';
import { Link } from 'react-router-dom';
import UrlInput from '../components/UrlInput';
import './HomePage.css'; // Ensure this CSS file is linked

const HomePage = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const featureRefs = useRef([]);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 bg-background">
        <div className="absolute inset-0" style={{ zIndex: -10, opacity: 0.1 }}>
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full filter blur-3xl floating-blob-1"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl floating-blob-2"></div>
        </div>

        {/* Content with animations */}
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center bg-background p-6 rounded-xl">
            <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 pop-up">
              Analyze Any Website with<br />
              <span className="text-primary">AI-Powered Chat</span>
            </h1>
            
            <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-600 mb-10 pop-up animation-delay-300">
              Paste any URL and instantly analyze its content.<br />
              Then chat with GROQ AI to understand it better.
            </p>

            <div className="pop-up animation-delay-600">
              <UrlInput autoFocus={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 slide-in-left">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-stagger">
            {/* Feature 1 */}
            <div ref={el => featureRefs.current[0] = el} className="card flex flex-col items-center text-center bg-white pop-up animation-delay-150 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-light mb-6 pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Analysis</h3>
              <p className="text-gray-600">
                Extract and analyze website content in seconds. Get summaries, meta information, and key insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div ref={el => featureRefs.current[1] = el} className="card flex flex-col items-center text-center bg-white pop-up animation-delay-300 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary-light mb-6 pulse animation-delay-150">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">GROQ AI Chat</h3>
              <p className="text-gray-600">
                Ask questions and get answers about any webpage using the powerful GROQ Claude 3.7 Sonnet model.
              </p>
            </div>

            {/* Feature 3 */}
            <div ref={el => featureRefs.current[2] = el} className="card flex flex-col items-center text-center bg-white pop-up animation-delay-450 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 mb-6 pulse animation-delay-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Save & Review</h3>
              <p className="text-gray-600">
                Create an account to save analyzed URLs and chat history for future reference and easy access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-white slide-in-bottom">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Analyze Your First Website?
          </h2>
          <p className="text-xl mb-8 text-white">
            Paste any URL and start chatting with AI about the content.
          </p>
          <div className="flex justify-center">
            <Link to="/analyze" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
