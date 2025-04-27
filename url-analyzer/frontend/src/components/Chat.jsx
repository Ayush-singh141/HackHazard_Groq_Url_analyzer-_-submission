import { useState, useRef, useEffect } from 'react';
import { askQuestion, getChatHistory } from '../utils/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

const Chat = ({ urlId, urlData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [contentTruncated, setContentTruncated] = useState(false);
  const messageEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsFetchingHistory(true);
        const result = await getChatHistory(urlId);
        if (result.success) {
          setMessages(result.data.messages || []);
          
          // Check if any previous responses mentioned content truncation
          const truncationMentioned = result.data.messages?.some(msg => 
            msg.role === 'assistant' && 
            msg.content.includes('Content truncated due to token limit')
          );
          setContentTruncated(truncationMentioned);
        } else {
          toast.error(result.error || 'Failed to load chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast.error('An error occurred while loading chat history');
      } finally {
        setIsFetchingHistory(false);
      }
    };
    fetchChatHistory();
  }, [urlId, toast]);

  // useEffect(() => {
  //   if (messageEndRef.current) {
  //     messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    inputRef.current?.focus();
    setIsLoading(true);

    const loadingMsgId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: '', id: loadingMsgId, isLoading: true }
    ]);

    try {
      const result = await askQuestion(urlId, input);
      if (result.success) {
        // Check if the response mentions content truncation
        if (result.data.answer.includes('Content truncated due to token limit')) {
          setContentTruncated(true);
        }
        
        setMessages(prev =>
          prev.map(msg =>
            msg.id === loadingMsgId
              ? { role: 'assistant', content: result.data.answer }
              : msg
          )
        );
      } else {
        // Check if error is related to token size
        const isTokenError = result.error?.includes('token') || result.error?.includes('too large');
        
        let errorMsg = 'Sorry, I encountered an error processing your request.';
        if (isTokenError) {
          errorMsg = 'The webpage content is too large for me to process completely. I can only analyze a portion of it. Please ask about specific sections or keep your questions focused on the main content.';
          setContentTruncated(true);
        }
        
        setMessages(prev =>
          prev.map(msg =>
            msg.id === loadingMsgId
              ? { role: 'assistant', content: errorMsg }
              : msg
          )
        );
        
        toast.error(result.error || 'Failed to get response from AI');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('An unexpected error occurred');
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsLoading(false);
    }
  };

  // Format message content with basic markdown
  const formatMessageContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bullet points
      if (line.trim().startsWith('*')) {
        return <li key={i}>{line.replace(/^\*\s*/, '')}</li>;
      }
      // Truncation notice - highlight it
      if (line.includes('Content truncated due to token limit')) {
        return <p key={i} className="text-amber-600 italic text-xs mt-2">{line}</p>;
      }
      // Line breaks
      return <p key={i} className="mb-1">{line}</p>;
    });
  };

  return (
    <div 
      ref={chatContainerRef}
      className="flex flex-col h-full lg:h-[78vh] bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-primary text-white p-4" style={{ backgroundColor: '#5b21b6' }}>
        <h3 className="font-semibold">Chat about: {urlData?.title.slice(0, 30)+'.....' || 'Website'}</h3>
        <p className="text-sm text-primary-light truncate">
          {urlData?.originalUrl || 'Loading...'}
        </p>
        {contentTruncated && (
          <div className="mt-2 text-xs bg-amber-100 text-amber-800 p-2 rounded">
            <span className="font-bold">Note:</span> This webpage is very large. Only a portion of its content can be analyzed. 
            For best results, ask specific questions about the main content.
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isFetchingHistory ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner size="large" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-center">Ask any question about this webpage!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-[80%] shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                  style={{ backgroundColor: message.role === 'user' ? '#5b21b6' : '#ffffff' }}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <span>Thinking</span>
                      <LoadingSpinner size="small" color="gray" thickness="thin" />
                    </div>
                  ) : (
                    <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-black'} whitespace-pre-wrap`}>
                      {formatMessageContent(message.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </>
        )}
      </div>

      <form 
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this webpage..."
            className="input flex-1"
            disabled={isLoading || isFetchingHistory}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || isFetchingHistory || !input.trim()}
            style={{ backgroundColor: '#5b21b6', color: 'white' }}
          >
            {isLoading ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
