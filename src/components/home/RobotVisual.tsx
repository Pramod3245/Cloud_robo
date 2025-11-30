import robotImage from "@/assets/robot.png";

export const RobotVisual = () => {
  return (
    <div className="relative h-full flex items-center justify-center p-6 sm:p-8">
      {/* Circular platform - centered and responsive */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 md:w-80 h-2">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent blur-sm" />
      </div>

      {/* Robot image - fill available height while preserving aspect ratio */}
      <div className="relative animate-float w-full h-full flex items-center justify-center">
        <img
          src={robotImage}
          alt="Nimbus Robot"
          className="w-auto h-auto max-h-[36vh] sm:max-h-[44vh] md:max-h-[56vh] lg:max-h-[68vh] object-contain filter drop-shadow-2xl"
          style={{ maxWidth: '100%', width: 'auto' }}
        />

        {/* Subtle glow effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-foreground/5 to-transparent blur-3xl" />
      </div>

      {/* Status indicator */}
      <div className="absolute top-8 right-8 glass px-4 py-2 rounded-full text-xs font-light tracking-wide">
        READY
      </div>
    </div>
  );
};
