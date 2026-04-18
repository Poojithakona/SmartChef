import { Image as ImageIcon, Mic, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sendMessageToAI } from "../api/chat";

const AIAssistant = ({ recipe, currentStep }) => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! 👩🍳 I'm SmartChef AI! I'm here to help you cook **${recipe.name}** perfectly. Ask me anything — steps, tips, substitutes, or if something goes wrong!`,
    },
  ]);

  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const fileRef = useRef(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() && !pendingImage) return;

    const userContent = input || "📸 Please check my food in the image";
    const userMsg = { id: Date.now(), role: "user", content: userContent, image: pendingImage };

    setMessages((p) => [...p, userMsg]);
    setInput("");
    const imgToSend = pendingImage;
    setPendingImage(null);
    setLoading(true);

    try {
      // Build full conversation history for Groq (real chatbot memory)
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      history.push({ role: "user", content: userContent });

      const reply = await sendMessageToAI(history, {
        name: recipe.name,
        currentStep,
        ingredients: recipe.ingredients,
      });

      setMessages((p) => [...p, { id: Date.now() + 1, role: "assistant", content: reply }]);
    } catch {
      setMessages((p) => [...p, { id: Date.now() + 2, role: "assistant", content: "Oops! Something went wrong. Try again 😊" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported in this browser");
    if (recording) { recognitionRef.current?.stop(); setRecording(false); return; }
    const rec = new SR();
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setRecording(true);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-full border rounded-xl bg-white overflow-hidden shadow">

      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
        <div>
          <p className="font-bold text-sm">SmartChef AI</p>
          <p className="text-xs text-orange-100">Always here to help 👩🍳</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-orange-100">Online</span>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
            )}
            <div className={`px-4 py-2.5 rounded-2xl max-w-[78%] text-sm leading-relaxed shadow-sm ${
              m.role === "user"
                ? "bg-orange-500 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
            }`}>
              {m.image && <img src={m.image} alt="uploaded" className="mb-2 rounded-lg max-h-28 object-cover w-full" />}
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs flex-shrink-0">👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs">🤖</div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image preview */}
      {pendingImage && (
        <div className="px-3 py-2 bg-white border-t flex items-center gap-2">
          <img src={pendingImage} alt="preview" className="h-14 rounded-lg object-cover" />
          <button onClick={() => setPendingImage(null)} className="text-red-400 hover:text-red-600 ml-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-2 p-3 border-t bg-white items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
          placeholder="Ask anything about cooking..."
          disabled={loading}
        />
        <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleImage} />
        <button onClick={() => fileRef.current.click()} className="text-gray-400 hover:text-orange-500 transition p-1" title="Upload image">
          <ImageIcon size={18} />
        </button>
        <button
          onClick={toggleVoice}
          className={`p-1 transition ${recording ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-orange-500"}`}
          title="Voice input"
        >
          <Mic size={18} />
        </button>
        <button
          onClick={send}
          disabled={loading || (!input.trim() && !pendingImage)}
          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
