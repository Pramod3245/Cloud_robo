import { useState } from "react";
import { X, Video, Minimize2, CheckCircle2 } from "lucide-react";
import VideoModal from "./VideoModal";

interface SweepingModalProps {
  onClose: () => void;
}

const rooms = [
  { name: "Kitchen", lastCleaned: "3 hours ago", cleanliness: 85 },
  { name: "Living Room", lastCleaned: "1 day ago", cleanliness: 72 },
  { name: "Guest Room", lastCleaned: "2 days ago", cleanliness: 68 },
  { name: "Dining Hall", lastCleaned: "5 hours ago", cleanliness: 90 },
];

export const SweepingModal = ({ onClose }: SweepingModalProps) => {
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
            <h2 className="text-2xl font-extralight mb-2">Sweeping Floor</h2>
            <p className="text-sm font-light opacity-60 mb-8">Where should the robot sweep?</p>

            <div className="space-y-3">
              {rooms.map((room) => (
                <button key={room.name} onClick={() => handleSelect(room.name)} className="w-full glass-strong rounded-xl p-6 transition-smooth hover:bg-foreground/8 hover:scale-[1.01] flex items-center gap-6">
                  <div className="w-12 h-12 rounded-lg glass flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-normal mb-1">{room.name}</h3>
                    <p className="text-xs opacity-60">Last cleaned: {room.lastCleaned}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-foreground/10">
                      <div className="h-full rounded-full bg-foreground/40" style={{ width: `${room.cleanliness}%` }} />
                    </div>
                    <span className="text-xs opacity-60 w-8">{room.cleanliness}%</span>
                  </div>
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
            <h3 className="text-xl font-normal mb-2">Task Started</h3>
            <p className="text-sm font-light opacity-60 mb-2">Robot is now sweeping the {selected}</p>
            <p className="text-xs opacity-40 mb-8">Estimated time: 8-12 minutes</p>

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

      {showVideo && <VideoModal onClose={() => setShowVideo(false)} title={`${selected} Camera`} />}
    </div>
  );
};
