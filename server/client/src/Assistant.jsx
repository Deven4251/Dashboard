import { Bot, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "./api/axios.js";

const examples = [
  "What projects are in maintenance?",
  "Show all MERN projects.",
  "Which project has the highest completion percentage?",
  "What upgrades were added?"
];

export default function Assistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Ask me about project status, upgrades, technologies, or maintenance." }]);
  const [loading, setLoading] = useState(false);

  const ask = async (event, suggested) => {
    event?.preventDefault();
    const text = suggested || question;
    if (!text.trim()) return;
    setMessages((current) => [...current, { role: "user", text }]);
    setQuestion("");
    setLoading(true);
    try {
      const { data } = await api.post("/assistant/ask", { question: text });
      setMessages((current) => [...current, { role: "assistant", text: data.answer }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Assistant unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="assistant-page">
      <div className="assistant-header"><Bot size={28} /><div><h2>AI Project Assistant</h2><p>Local project-context engine</p></div></div>
      <div className="suggestion-row">{examples.map((example) => <button className="secondary-button" key={example} onClick={(event) => ask(event, example)}>{example}</button>)}</div>
      <div className="chat-panel">
        {messages.map((message, index) => <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</article>)}
        {loading && <article className="chat-message assistant">Thinking...</article>}
      </div>
      <form className="chat-input" onSubmit={ask}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your projects" />
        <button className="primary-button" aria-label="Send"><Send size={18} /></button>
      </form>
    </section>
  );
}
