import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAuctionItemDetails } from "../store/slices/auctionSlice";
import { placeBid } from "../store/slices/bidSlice";
import Spinner from "../components/Spinner";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionItemDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );

  const { isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const [amount, setAmount] = useState("");

  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionItemDetails(id));
    setAmount("")
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionItemDetails(id));
    }
  }, [isAuthenticated]);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        {/* a) Auction item Detail */}
        <div className="text-[16px] flex flex-wrap gap-2 items-center">
          <Link
            to="/"
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Home
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <Link
            to={"/auctions"}
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Auctions
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <p className="text-stone-600">{auctionItemDetail.title}</p>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="bg-white w-[100%] lg:w-40 lg:h-40 flex justify-center items-center p-5">
                  <img
                    src={auctionItemDetail.image?.url}
                    alt={auctionItemDetail.title}
                  />
                </div>
                <div className="flex flex-col justify-around pb-4">
                  <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                    {auctionItemDetail.title}
                  </h3>
                  <p className="text-xl font-semibold">
                    Condition:{" "}
                    <span className="text-[#D6482B]">
                      {auctionItemDetail.condition}
                    </span>
                  </p>
                  <p className="text-xl font-semibold">
                    Starting Bid:{" "}
                    <span className="text-[#D6482B]">
                      Rs.{auctionItemDetail.startingBid}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-xl w-fit font-bold">
                Auction Item Description
              </p>
              <hr className="my-2 border-t-[1px] border-t-stone-700" />
              {auctionItemDetail.description &&
                auctionItemDetail.description
                  .split(". ")
                  .map((element, index) => {
                    return (
                      <li key={index} className="text-[18px] my-2">
                        {element}
                      </li>
                    );
                  })}
            </div>
            {/* b) Bidds */}
            <div className="flex-1">
              <header className="bg-stone-200 py-4 text-[24px] font-semibold px-4">
                BIDS
              </header>
              <div className="bg-white px-4 min-h-fit lg:min-h-[500px]">
                {auctionBidders &&
                new Date(auctionItemDetail.startTime) < Date.now() &&
                new Date(auctionItemDetail.endTime) > Date.now() ? (
                  auctionBidders.length > 0 ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full my-2 hidden md:block"
                            />
                            <p className="text-[18px] font-semibold">
                              {element.userName}
                            </p>
                          </div>
                          {index === 0 ? (
                            <>
                              <p>{`${element.amount} PKR`}</p>
                              <p className="text-[20px] font-semibold text-green-600">
                                1st
                              </p>
                            </>
                          ) : index === 1 ? (
                            <>
                              <p>{`${element.amount} PKR`}</p>
                              <p className="text-[20px] font-semibold text-blue-600">
                                2nd
                              </p>
                            </>
                          ) : index === 2 ? (
                            <>
                              <p>{`${element.amount} PKR`}</p>
                              <p className="text-[20px] font-semibold text-yellow-600">
                                3rd
                              </p>
                            </>
                          ) : (
                            <p className="text-[20px] font-semibold text-gray-600">
                              {index + 1}th
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No bids for this auction
                    </p>
                  )
                ) : Date.now() < new Date(auctionItemDetail.startTime) ? (
                  <img
                    src="/notStarted.png"
                    alt="not-started"
                    className="w-full max-h-[650px]"
                  />
                ) : (
                  <img
                    src="/auctionEnded.png"
                    alt="ended"
                    className="w-full max-h-[650px]"
                  />
                )}
              </div>

              <div className="bg-[#D6482B] py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between">
                {Date.now() >= new Date(auctionItemDetail.startTime) &&
                Date.now() <= new Date(auctionItemDetail.endTime) ? (
                  <>
                    <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                      <p className="text-white">Place Bid</p>
                      <input
                        type="number"
                        className="w-32 focus:outline-none md:text-[20px] p-1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <button
                      className="p-4 text-white bg-black rounded-full transition-all duration-300 hover:bg-[#222]"
                      onClick={handleBid}
                    >
                      <RiAuctionFill />
                    </button>
                  </>
                ) : new Date(auctionItemDetail.startTime) > Date.now() ? (
                  <p className="text-white font-semibold text-xl">
                    Auction has not started yet!
                  </p>
                ) : (
                  <p className="text-white font-semibold text-xl">
                    Auction has ended!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AuctionItem;
