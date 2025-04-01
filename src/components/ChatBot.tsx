import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // mathisa
import { MdSend, MdMic, MdMicOff, MdFace } from "react-icons/md";
import { FaRobot } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { FaWindowClose } from "react-icons/fa";

export const ChatBot = ({ theme_card_color }) => {
  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GENAI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const chatContainerRef = useRef(null); // Create a reference to the chat container

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition. Please use Google Chrome.");
      return;
    }

    const recognitionInstance = new (window as any).webkitSpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (message = input) => {
    if (message.trim() === "") return;

    const userMessage = { text: message, user: true };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const botReply = await fetchAIResponse(message);
      setMessages((prev) => [...prev, { text: botReply, user: false }]);
      speakText(botReply); // Speak the bot's reply
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong.", user: false },
      ]);
      speakText("Sorry, something went wrong."); // Speak the error message
    }

    setLoading(false);
  };

  // Function to get AI response
  const fetchAIResponse = async (userInput) => {
    if (!userInput) return;

    const prompt = `
    You are the AI assistant for the Spam Shield platform. Your role is to provide accurate and user-friendly responses related to the platform’s features and functionalities.

    **Guidelines:**
    - Answer only queries related to the given data.
    - If a question is outside the provided information, politely state that you don't have the details.
    - Maintain a formal yet approachable tone.

    **Platform Information:**
    - **Name:** Spam Shield
    - **Purpose:** A comprehensive solution designed to detect and prevent call and email fraud, ensuring user security and privacy.
    - **Core Focus Areas:** Fraud Detection, Spam Prevention, User Security, and Privacy Protection.

    **Key Features:**
    - **Call Fraud Detection:** Monitors and analyzes incoming calls to identify and block fraudulent activities.
    - **Email Fraud Detection:** Scans emails for phishing attempts, malicious content, and spam, providing real-time alerts.
    - **AI-Powered Analysis:** Utilizes advanced artificial intelligence algorithms to detect patterns associated with fraudulent communications.
    - **User Alerts:** Notifies users immediately upon detecting suspicious calls or emails, enabling prompt action.
    - **Customizable Filters:** Allows users to set preferences for filtering and blocking unwanted communications.
    - **Detailed Reports:** Provides comprehensive reports on detected threats, helping users understand and manage their communication security.

    **User Dashboard Features:**
    - **Profile Management:** Update and manage personal information and security settings.
    - **Threat Overview:** View a summary of detected threats and blocked communications.
    - **Settings:** Customize filters, alerts, and other preferences to tailor the platform to individual needs.
    - **Support:** Access help resources and contact support for assistance with any issues.

    **User Testimonials:**
    - *"Spam Shield has significantly reduced the number of fraudulent calls I receive daily. I feel much safer now."*  
      — **Amit Verma**, Business Professional

    - *"The email scanning feature is a lifesaver. It caught a phishing attempt that I almost fell for."*  
      — **Priya Sharma**, Freelance Designer

    - *"I appreciate the detailed reports Spam Shield provides. It helps me stay informed about potential threats."*  
      — **Rahul Iyer**, IT Consultant

    **How It Works:**
    - **Real-Time Monitoring:** Continuously monitors incoming calls and emails for signs of fraud or spam.
    - **AI Analysis:** Applies machine learning algorithms to detect suspicious patterns and behaviors.
    - **Immediate Alerts:** Notifies users instantly when a potential threat is identified.
    - **User Action:** Provides recommendations for handling detected threats, such as blocking numbers or marking emails as spam.

    **User Query:** ${userInput}
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't process that request.";
      return responseText;
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I'm unable to process your request at the moment.";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // Scroll to bottom when messages are updated

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Animated Robot Icon */}
      <motion.div
        className="p-4 bg-gradient-to-r from-gray-800 to-black text-white rounded-full cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <TbMessageChatbotFilled className="text-3xl" />
      </motion.div>

      {/* Chat Sidebar */}
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className={`fixed bottom-0 right-0 w-800 h-96 ${theme_card_color} flex flex-col p-4 bg-gray-900 rounded-lg shadow-2xl`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-2 text-white">
            <h2 className="text-lg font-semibold">Your Friendly ChatBot</h2>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-red-400 transition duration-300"
            >
              <FaWindowClose className="text-xl" />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-2 p-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 max-w-xs text-sm ${
                  msg.user
                    ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white self-end rounded-l-xl rounded-tr-xl"
                    : "bg-gray-800 bg-opacity-75 text-gray-200 self-start rounded-r-xl rounded-tl-xl"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="p-2 max-w-xs bg-gray-800 bg-opacity-75 text-gray-200 self-start rounded-r-xl rounded-tl-xl">
                Typing...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center p-2 bg-gray-800 bg-opacity-75 rounded-lg">
            <input
              type="text"
              className="flex-1 p-2 bg-transparent text-white outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Add event listener for Enter key
              disabled={loading}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className="p-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white ml-2"
            >
              {isListening ? <MdMicOff className="text-xl" /> : <MdMic className="text-xl" />}
            </button>
            <button
              onClick={stopSpeaking}
              className="p-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white ml-2"
            >
              Stop
            </button>
            <button
              onClick={() => sendMessage()} // Add click functionality
              className="p-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white"
              disabled={loading}
            >
              <MdSend className="text-xl" />
            </button>
            
           
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default ChatBot;