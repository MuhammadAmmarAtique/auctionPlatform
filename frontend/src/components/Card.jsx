import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Card = ({imgSrc,title,startingBid,startTime,endTime,id,}) => {
  const CalculateTimeLeft = () => {
    const currentTime = new Date();

    // Calculate the time difference between current time and start/end time in milliseconds
    const startDifference = new Date(startTime) - currentTime;
    const endDifference = new Date(endTime) - currentTime;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Auction Starts in:",
        // Here milliseconds are converted into days, hours, minutes, and seconds.
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    }

    if (endDifference > 0) {
      timeLeft = {
        type: "Auction Ends in:",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(CalculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(CalculateTimeLeft());
    }, 1000); // update timeLeft after every second

    // stopping setInterval() when Card.jsx is unmounted or no longer used
    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = ({days, hours, minutes, seconds}) => {
     const pad = (num) => String(num).padStart(2,0)
     return `${days}Days ${pad(hours)}:${pad(minutes)}:${pad(seconds)}:` 
  }

  return (
     <>
  <Link
    to={`/auction/item/${id}`}
    className="flex-grow basis-full bg-white rounded-md group sm:basis-56 lg:basis-60 2xl:basis-80"
  >
    <img
      src={imgSrc}
      alt={title}
      className="w-full aspect-[4/3] m-auto md:p-12"
    />
    <div className="px-2 pt-4 pb-2">
      <h5 className="font-semibold text-[18px] group-hover:text-[#d6482b] mb-2">
        {title}
      </h5>
      {startingBid && (
        <p className="text-stone-600 font-light">
          Starting Bid:{" "}
          <span className="text-[#fdba88] font-bold ml-1">
            {startingBid}
          </span>
        </p>
      )}
      <p className="text-stone-600 font-light">
        {timeLeft.type}
        {Object.keys(timeLeft).length > 1 ? (
          <span className="text-[#fdba88] font-bold ml-1">
            {formatTimeLeft(timeLeft)}
          </span>
        ) : (
          <span className="text-[#fdba88] font-bold ml-1">Time's up!</span>
        )}
      </p>
    </div>
  </Link>
</>
  );
};