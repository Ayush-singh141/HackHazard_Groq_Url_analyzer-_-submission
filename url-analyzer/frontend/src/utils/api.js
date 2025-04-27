import axios from 'axios';

const API_URL = 'https://hackhazard-groq-url-analyzer.onrender.com/api';

// Ensure auth token is included in requests
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  // Add basic token validation - don't send malformed tokens
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem('token'); // Clean up invalid tokens
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

// Check if an error is an auth error (401/403)
const isAuthError = (error) => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

// General error handler for API calls
const handleApiError = (error, errorMessage) => {
  console.error(`API Error - ${errorMessage}:`, error);
  
  // Check for auth errors
  if (isAuthError(error)) {
    return {
      success: false,
      error: 'Session expired. Please log in again.',
      authError: true
    };
  }
  
  return {
    success: false,
    error: error.response?.data?.message || errorMessage
  };
};

// URLs API
export const analyzeUrl = async (url) => {
  try {
    const response = await axios.post(
      `${API_URL}/urls/analyze`, 
      { url },
      { headers: getAuthHeader() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error, 'Error analyzing URL');
  }
};

export const getUrlById = async (urlId) => {
  try {
    const response = await axios.get(
      `${API_URL}/urls/${urlId}`,
      { headers: getAuthHeader() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error, 'Error fetching URL data');
  }
};

export const getUserUrls = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/urls`,
      { headers: getAuthHeader() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error, 'Error fetching URLs');
  }
};

export const searchUrls = async (query) => {
  try {
    const response = await axios.get(
      `${API_URL}/urls/search?query=${encodeURIComponent(query)}`,
      { headers: getAuthHeader() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error, 'Error searching URLs');
  }
};


// Chat API
export const askQuestion = async (urlId, question) => {
  try {
    console.log('Sending chat request with:', { urlId, question });
    const response = await axios.post(
      `${API_URL}/chat/ask`, 
      { urlId, question },
      { headers: getAuthHeader() }
    );
    console.log('Chat response received:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    // Check if error is related to token size
    const isTokenError = error.response?.data?.message?.includes('token') || 
                         error.response?.data?.message?.includes('too large');
    
    if (isTokenError) {
      return {
        success: false,
        error: 'The webpage content is too large for me to process completely.'
      };
    }
    
    return handleApiError(error, 'Error asking question');
  }
};

export const getChatHistory = async (urlId) => {
  try {
    console.log('Fetching chat history for URL:', urlId);
    const response = await axios.get(
      `${API_URL}/chat/history/${urlId}`,
      { headers: getAuthHeader() }
    );
    console.log('Chat history received:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error, 'Error fetching chat history');
  }
};

export const deleteUrl = async (urlId) => {
  // Debug tracking
  console.log("=== DELETE URL START ===");
  console.log(`Deleting URL: ${urlId}`);
  let retryCount = 0;
  const maxRetries = 2;
  
  const attemptDelete = async () => {
    try {
      // Get the token directly from localStorage for this critical operation
      const token = localStorage.getItem('token');
      
      // Verify token is valid
      if (!token || token === 'undefined' || token === 'null') {
        console.error('No valid token found for delete operation');
        return {
          success: false,
          error: 'Session expired. Please log in again.',
          authError: true
        };
      }
      
      console.log(`Attempt #${retryCount + 1} - Token exists: ${token.substring(0, 10)}...`);
      
      // Explicitly set the Authorization header
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Make sure we're using the correct URL format
      const finalUrl = `${API_URL}/urls/${urlId}`;
      console.log('Delete request URL:', finalUrl);
      
      console.log('Sending delete request...');
      // Use axios directly without interceptors for this critical operation
      const response = await axios({
        method: 'DELETE',
        url: finalUrl,
        headers,
        timeout: 15000,
        validateStatus: function (status) {
          // Consider any status less than 500 as not needing a retry
          // This way we don't retry on 401/403 which are auth errors
          return status < 500;
        }
      });
      
      console.log('Delete API response:', response.status, response.statusText);
      
      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        console.log('Response data:', response.data);
        console.log("=== DELETE URL SUCCESS ===");
        return { success: true, data: response.data };
      } else if (response.status === 401 || response.status === 403) {
        // Auth error
        console.error('Authentication error:', response.status, response.data);
        localStorage.removeItem('token'); // Clear invalid token
        return {
          success: false,
          error: 'Session expired. Please log in again.',
          authError: true
        };
      } else {
        // Other error
        console.error('Error response:', response.status, response.data);
        return {
          success: false,
          error: response.data?.message || `Server returned status ${response.status}`
        };
      }
    } catch (error) {
      console.error("=== DELETE URL ERROR ===");
      console.error('Delete API error:', error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Status:', error.response.status);
        console.error('Status text:', error.response.statusText);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        
        // Check for auth errors and provide clearer messages
        if (error.response.status === 401 || error.response.status === 403) {
          console.error('Authentication error - please log in again');
          // Force token refresh on auth error
          localStorage.removeItem('token');
          return {
            success: false,
            error: 'Session expired. Please log in again.',
            authError: true
          };
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
      }
      
      // Determine if error is retryable
      const isRetryable = !error.response || error.response.status >= 500;
      if (isRetryable && retryCount < maxRetries) {
        return null; // Signal for retry
      }
      
      return {
        success: false,
        error: error.response?.data?.message || `Error deleting URL: ${error.message}`
      };
    }
  };
  
  // Try with retries if needed
  while (retryCount <= maxRetries) {
    const result = await attemptDelete();
    
    if (result === null) {
      // Retry needed
      retryCount++;
      console.log(`Retrying delete operation (attempt ${retryCount} of ${maxRetries})`);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // Got a final result
      return result;
    }
  }
  
  // If we get here, all retries failed
  return {
    success: false,
    error: 'Failed to delete URL after multiple attempts'
  };
}; 