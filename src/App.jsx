import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://peakcoach-backend-production.railway.app';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/message`, {
        subscriber_id: 1,
        message: input,
        trainer_id: 1
      });

      const botMessage = {
        role: 'bot',
        content: response.data.response || 'No response from bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'bot',
        content: 'خطأ في الاتصال بالـ server: ' + error.message
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="header">
          <h1>🏋️ PeakCoach AI</h1>
          <p>مدربك الشخصي الذكي</p>
        </div>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="message bot"><div className="loading">جاري الكتابة...</div></div>}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="اكتب رسالتك هنا..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
