import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlipClockCountdownProps {
  targetDate: Date;
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const displayValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Flip card container */}
        <div className="flex gap-0.5">
          {displayValue.split('').map((digit, i) => (
            <div
              key={i}
              className="relative w-7 h-9 sm:w-8 sm:h-10 bg-gradient-to-b from-gray-800 to-gray-900 rounded-md overflow-hidden border border-orange-500/20 shadow-lg"
            >
              {/* Top half */}
              <div className="absolute inset-0 h-1/2 bg-gradient-to-b from-gray-700 to-gray-800 border-b border-gray-900/50 flex items-end justify-center overflow-hidden">
                <span className="text-orange-400 text-lg sm:text-xl font-mono font-bold translate-y-1/2">
                  {digit}
                </span>
              </div>
              {/* Bottom half */}
              <div className="absolute inset-0 top-1/2 bg-gradient-to-b from-gray-800 to-gray-900 flex items-start justify-center overflow-hidden">
                <span className="text-orange-400 text-lg sm:text-xl font-mono font-bold -translate-y-1/2">
                  {digit}
                </span>
              </div>
              {/* Center line highlight */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-gray-900/80" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
      <span className="mt-1.5 text-[10px] sm:text-xs text-orange-400/60 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export function FlipClockCountdown({ targetDate }: FlipClockCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-orange-400/70 font-medium">Launching in</p>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <FlipUnit value={timeLeft.days} label="Days" />
        <span className="text-orange-500/50 text-lg font-bold self-start mt-2">:</span>
        <FlipUnit value={timeLeft.hours} label="Hrs" />
        <span className="text-orange-500/50 text-lg font-bold self-start mt-2">:</span>
        <FlipUnit value={timeLeft.minutes} label="Min" />
        <span className="text-orange-500/50 text-lg font-bold self-start mt-2">:</span>
        <FlipUnit value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}
