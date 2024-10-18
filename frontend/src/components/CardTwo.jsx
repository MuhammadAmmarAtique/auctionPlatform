import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAuctionItem } from "../store/slices/auctionSlice";
import { republishAuctionItem } from "../store/slices/auctionSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CardTwo = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
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
    } else if (endDifference > 0) {
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

    // stopping setInterval() when CardTwo.jsx is unmounted or no longer used
    return () => clearInterval(timer);
  }, [startTime,endTime]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    let formattedTime = "";

    if (days) {
      formattedTime += `${days}d `;
    }
    if (hours) {
      formattedTime += `${hours}h `;
    }
    if (minutes) {
      formattedTime += `${minutes}m `;
    }
    if (seconds || (!days && !hours && !minutes)) {
      formattedTime += `${seconds}s`;
    }

    return formattedTime.trim();
  };

  // Delete auction
  const dispatch = useDispatch();
  const handleDeleteAuction = () => {
    dispatch(deleteAuctionItem(id));
  };

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <div className="basis-full bg-white rounded-md group sm:basis-56 lg:basis-60 2xl:basis-80">
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
          <div className="flex flex-col gap-2 mt-4">
            <Link
              className="bg-stone-700 text-center text-white text-xl px-4 py-2 rounded-md transition-all duration-300 hover:bg-black"
              to={`/auction/item/${id}`}
            >
              View Auction
            </Link>
            <button
              className="bg-red-400 text-center text-white text-xl px-4 py-2 rounded-md transition-all duration-300 hover:bg-red-600"
              onClick={handleDeleteAuction}
            >
              Delete Auction
            </button>
            <button
              disabled={new Date(endTime) > new Date()}
              onClick={() => setOpenDrawer(true)}
              className={`text-center text-xl px-4 py-2 rounded-md transition-all duration-300 ${
                new Date(endTime) > new Date()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-sky-400 text-white hover:bg-sky-700"
              }`}
            >
              Republish Auction
            </button>
          </div>
        </div>
      </div>
      <Drawer id={id} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
};

const Drawer = ({ setOpenDrawer, openDrawer, id }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { loading } = useSelector((state) => state.auction);

  const dispatch = useDispatch();

  const handleRepublishAuction = () => {
    const formData = new FormData();
    formData.append("newStartTime", startTime);
    formData.append("newEndTime", endTime);
    dispatch(republishAuctionItem(id, formData));
  };

  return (
    <section
      className={`fixed ${
        openDrawer && id ? "bottom-0" : "-bottom-full"
      }  left-0 w-full transition-all duration-300 h-full flex items-end`}
    >
      <div className="bg-white h-fit transition-all duration-300 w-full">
        <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto">
          <h3 className="text-[#D6482B]  text-3xl font-semibold text-center mb-1">
            Republish Auction
          </h3>
          <p className="text-stone-600">
            Let's republish auction with same details but new starting and
            ending time.
          </p>
          <form className="flex flex-col gap-5 my-5">
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-stone-600">
                Republish Auction Start Time
              </label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[16px] text-stone-600">
                Republish Auction End Time
              </label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none w-full"
              />
            </div>
            <div>
              <button
                type="button"
                className="bg-blue-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-blue-700"
                onClick={handleRepublishAuction}
              >
                {loading ? "Republishing" : "Republish"}
              </button>
            </div>
            <div>
              <button
                type="button"
                className="bg-yellow-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-yellow-700"
                onClick={() => setOpenDrawer(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
