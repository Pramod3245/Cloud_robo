import { useState } from "react";
import { X, Video, Minimize2, CheckCircle2 } from "lucide-react";
import VideoModal from "./VideoModal";

interface FoldingModalProps {
  onClose: () => void;
}

const people = [
  { name: "Adam", avatar: "A", lastFolded: "2 days ago" },
  { name: "Susie", avatar: "S", lastFolded: "1 day ago" },
  { name: "Tony", avatar: "T", lastFolded: "5 days ago" },
  { name: "Guest", avatar: "G", lastFolded: "Never" },
];

export const FoldingModal = ({ onClose }: FoldingModalProps) => {
  const [step, setStep] = useState<"select" | "processing" | "confirm">("select");
  const [selected, setSelected] = useState<string>("");
  const [showVideo, setShowVideo] = useState(false);

  const handleSelect = (name: string) => {
    setSelected(name);
    setStep("processing");
    setTimeout(() => setStep("confirm"), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/30 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-elevated rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-lg glass-strong flex items-center justify-center transition-smooth hover:bg-foreground/10">
          <X className="w-5 h-5" />
        </button>

        {step === "select" && (
          <div>
            <h2 className="text-2xl font-extralight mb-2">Fold Clothes</h2>
            <p className="text-sm font-light opacity-60 mb-8">Select person</p>

            <div className="grid grid-cols-2 gap-4">
              {people.map((person) => (
                <button key={person.name} onClick={() => handleSelect(person.name)} className="glass-strong rounded-2xl p-6 transition-smooth hover:bg-foreground/8 hover:scale-[1.02] text-center">
                  <div className="w-20 h-20 rounded-full glass mx-auto mb-4 flex items-center justify-center text-2xl font-light">{person.avatar}</div>
                  <h3 className="text-lg font-normal mb-1">{person.name}</h3>
                  <p className="text-xs opacity-60">Last: {person.lastFolded}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-2 border-foreground/20" />
              <div className="absolute inset-0 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
            </div>
            <p className="text-lg font-light opacity-60">Processing request...</p>
          </div>
        )}

        {step === "confirm" && (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 opacity-60" />
            </div>
            <h3 className="text-xl font-normal mb-2">Task Assigned</h3>
            <p className="text-sm font-light opacity-60 mb-8">Robot is now folding {selected}'s clothes</p>

            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowVideo(true)} className="glass-strong px-6 py-3 rounded-xl transition-smooth hover:bg-foreground/10 flex items-center gap-2">
                <Video className="w-4 h-4" />
                View Live Camera
              </button>
              <button onClick={onClose} className="glass px-6 py-3 rounded-xl transition-smooth hover:bg-foreground/10 flex items-center gap-2">
                <Minimize2 className="w-4 h-4" />
                Minimize Task
              </button>
            </div>
          </div>
        )}
      </div>

      {showVideo && <VideoModal onClose={() => setShowVideo(false)} title={`${selected}'s Camera`} />}
    </div>
  );
};
