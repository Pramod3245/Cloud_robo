import { useState } from "react";
import { X, Send, Video, Minimize2 } from "lucide-react";
import VideoModal from "./VideoModal";

interface CustomWorkflowModalProps {
  onClose: () => void;
}

interface Message {
  type: "user" | "system";
  text: string;
}

export const CustomWorkflowModal = ({ onClose }: CustomWorkflowModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { type: "system", text: "Hello! Describe what you want the robot to do, and I'll create a workflow for you." },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflow, setWorkflow] = useState<string[] | null>(null);
  const [deployed, setDeployed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");
    setIsProcessing(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "system", text: "Processing your workflow definition..." }]);
      setTimeout(() => {
        const steps = [
          "1. Navigate to kitchen area",
          "2. Identify and pick up dishes from counter",
          "3. Load dishwasher with sorted items",
          "4. Start dishwasher cycle",
          "5. Return to standby position",
        ];
        setWorkflow(steps);
        setMessages((prev) => [...prev, { type: "system", text: "I've created this workflow based on your request:" }]);
        setIsProcessing(false);
      }, 2000);
    }, 1000);
  };

  const handleDeploy = () => {
    setDeployed(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "system", text: "Workflow deployed successfully! Robot is now executing the tasks." }]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/30 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-elevated rounded-3xl max-w-3xl w-full h-[80vh] flex flex-col animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border/10">
          <div>
            <h2 className="text-2xl font-extralight">Custom Workflow</h2>
            <p className="text-xs font-light opacity-60">Define custom task sequences</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass-strong flex items-center justify-center transition-smooth hover:bg-foreground/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] glass-strong rounded-2xl px-5 py-3 ${msg.type === "user" ? "bg-foreground/8" : ""}`}>
                <p className="text-sm font-light">{msg.text}</p>
              </div>
            </div>
          ))}

          {workflow && !deployed && (
            <div className="glass-strong rounded-2xl p-6 space-y-3">
              {workflow.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full glass flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm font-light flex-1">{step.substring(3)}</p>
                </div>
              ))}
              <button onClick={handleDeploy} className="w-full glass-strong mt-4 py-3 rounded-xl transition-smooth hover:bg-foreground/10 text-sm font-normal">Deploy Workflow</button>
            </div>
          )}

          {deployed && (
            <div className="glass rounded-2xl p-6 text-center space-y-4">
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowVideo(true)} className="glass-strong px-6 py-3 rounded-xl transition-smooth hover:bg-foreground/10 flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4" />
                  View Live Camera
                </button>
                <button onClick={onClose} className="glass px-6 py-3 rounded-xl transition-smooth hover:bg-foreground/10 flex items-center gap-2 text-sm">
                  <Minimize2 className="w-4 h-4" />
                  Minimize
                </button>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="glass-strong rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border/10">
          <div className="glass-strong rounded-xl flex items-center gap-3 px-4">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSend()} placeholder="Describe what you want the robot to do..." className="flex-1 bg-transparent py-4 text-sm font-light focus:outline-none" />
            <button onClick={handleSend} disabled={!input.trim() || isProcessing} className="w-10 h-10 rounded-lg glass flex items-center justify-center transition-smooth hover:bg-foreground/10 disabled:opacity-30">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showVideo && <VideoModal onClose={() => setShowVideo(false)} title="Workflow Camera" />}
    </div>
  );
};
