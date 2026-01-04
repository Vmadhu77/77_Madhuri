import React, { useState } from 'react';
import axios from 'axios';
import MedSchedule from './components/MedSchedule';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [newMedName, setNewMedName] = useState(""); // State for the right-side input
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hello! I can help you with FDA-approved medication information. Ask me about dosage or side effects.' }
  ]);
  const [meds, setMeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // New function for the Inline Add Medication
  const handleInlineAdd = async () => {
    if (!newMedName.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/add-medication`, { name: newMedName });
      setMeds(prev => [...prev, response.data.medication]);
      setNewMedName(""); // Clear the small input
      setChatHistory(prev => [...prev, { role: 'ai', text: `Added ${newMedName} to your schedule.` }]);
    } catch (error) {
      alert("Could not find FDA data for that medication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', { message: input });
      setChatHistory(prev => [...prev, { role: 'ai', text: response.data.answer }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Server is offline. Start the backend to chat.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Left Panel: Chat */}
      <section className="chat-panel">
        <div className="chat-header">Medication Assistant</div>
        <div className="messages-display">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="bubble ai-bubble">...</div>}
        </div>
        <div className="input-container">
          <input 
            type="text" 
            placeholder="Ask about medications, side effects..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-btn">Send</button>
        </div>
      </section>

      {/* Right Panel: Schedule Manager */}
      <section className="schedule-panel">
        <div className="schedule-header">
          <div className="tab-container">
            <span className="active-tab">Reminders</span>
          </div>
        </div>

        {/* Inline Add Medication Search Bar */}
        <div className="add-med-inline">
          <input 
            type="text" 
            placeholder="Add new medication..." 
            value={newMedName}
            onChange={(e) => setNewMedName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleInlineAdd()}
          />
          <button onClick={handleInlineAdd} className="plus-btn">+</button>
        </div>

        <div className="schedule-date">Today's Schedule</div>
        <MedSchedule medications={meds} />
      </section>
    </div>
  );
}

export default App;