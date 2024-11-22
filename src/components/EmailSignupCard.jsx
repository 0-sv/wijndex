import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function EmailSignupCard() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://emailoctopus.com/api/1.6/lists/YOUR_LIST_ID/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: import.meta.env.VITE_EMAILOCTOPUS_API_KEY,
          email_address: email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6 transition-transform hover:scale-[1.01]">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0 flex items-center justify-center h-full">
          <div className="w-20 sm:w-32 h-20 sm:h-32 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-grow w-full">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                #4
              </span>
              <h2 className="text-base sm:text-xl font-semibold mt-1">
                Weekly Wine Recommendations
              </h2>
            </div>
          </div>

          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Never wonder which wine to choose again - join our weekly recommendations
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                        placeholder-gray-500 dark:placeholder-gray-400 border border-transparent 
                        focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 
                        dark:focus:ring-blue-800 focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
                       transition-colors duration-200 disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Successfully subscribed! Check your email for confirmation.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Failed to subscribe. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
