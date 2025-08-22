import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';

interface CountdownTimerProps {
  liveClass: any;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ liveClass }) => {
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isStarted: boolean;
    hasEnded: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, hasEnded: false });

  useEffect(() => {
    if (liveClass.isLive) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const startTime = new Date(liveClass.scheduledAt).getTime();
      const endTime = liveClass.endTime ? new Date(liveClass.endTime).getTime() : null;
      const distance = startTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds, isStarted: false, hasEnded: false });
      } else if (endTime && now > endTime) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, hasEnded: true });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true, hasEnded: false });
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    return () => clearInterval(interval);
  }, [liveClass.scheduledAt, liveClass.endTime, liveClass.isLive]);

  if (liveClass.isLive) return null;

  if (countdown.hasEnded) {
    return (
      <div className="bg-gray-600/20 border border-gray-600 rounded-lg p-3 mb-4">
        <div className="text-center">
          <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <div className="text-gray-400 font-medium text-sm">Class Ended</div>
        </div>
      </div>
    );
  }

  if (countdown.isStarted) {
    return (
      <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-3 mb-4 animate-pulse">
        <div className="text-center">
          <Zap className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-yellow-300 font-semibold text-sm">Ready to Start!</div>
          <div className="text-yellow-200 text-xs">Class can begin now</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-3 mb-4">
      <div className="text-center">
        <div className="text-xs text-blue-300 mb-2">Starts in:</div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <div>
            <div className="text-lg font-bold text-blue-400">{countdown.days}</div>
            <div className="text-xs text-blue-300">Days</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">{countdown.hours}</div>
            <div className="text-xs text-blue-300">Hours</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">{countdown.minutes}</div>
            <div className="text-xs text-blue-300">Min</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">{countdown.seconds}</div>
            <div className="text-xs text-blue-300">Sec</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;