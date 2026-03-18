import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';


const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        if (!targetDate) return null;

        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            // If the date has passed (within 2 hours), show as "Started"
            // If more than 2 hours passed, show as "Ended"
            const hoursPassed = Math.abs(difference) / (1000 * 60 * 60);
            return { status: hoursPassed < 2 ? 'Started' : 'Ended' };
        }

        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    // Status: Activity already started or ended
    if (timeLeft.status) {
        return (
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${timeLeft.status === 'Started' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>
                <Icon icon={timeLeft.status === 'Started' ? "mdi:run-fast" : "mdi:check-all"} />
                <span>{timeLeft.status.toUpperCase()}</span>
            </div>
        );
    }

    // Status: Counting down
    const { days, hours, minutes } = timeLeft;

    return (
        <div className="flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md animate-pulse">
            <Icon icon="mdi:clock-fast" className="text-xs" />
            <div className="flex gap-0.5">
                {days > 0 && <span>{days}d</span>}
                <span>{hours.toString().padStart(2, '0')}h</span>
                <span>{minutes.toString().padStart(2, '0')}m</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
