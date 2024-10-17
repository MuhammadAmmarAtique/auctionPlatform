import React, { useEffect } from "react";
import { useState } from "react";
import { addNewAuctionItem } from "../store/slices/auctionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState(0);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [auctionItemImage, setAuctionItemImage] = useState("");
  const [auctionItemImgPreview, setAuctionItemImgPreview] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auction);

  function handleCreateAuction(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startingBid", startingBid);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("auctionItemImage", auctionItemImage);
    dispatch(addNewAuctionItem(formData))
    .then((response) => { // Resetting the form fields upon receiving a successful response
      if (response.status === 200) {
        setTitle("");
        setDescription("");
        setStartingBid(0);
        setCategory("");
        setCondition("");
        setStartTime("");
        setEndTime("");
        setAuctionItemImage("");
        setAuctionItemImgPreview("");
      }
    });
  }

  function auctionImgHandler(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAuctionItemImage(file);
      setAuctionItemImgPreview(reader.result);
    };
  }

  // Redirecting Bidder to the Home page if they attempt to access the /create-auction route in the browser
  const navigateTo = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antiques",
    "Jewelry & Watches",
    "Automobiles",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Books & Manuscripts",
  ];

  return (
    <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <div className="mb-5">
        <h1
          className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
        >
          Create Auction
        </h1>
        <p className="text-xl">
          Provide the necessary details to launch your auction and attract
          potential bidders.
        </p>
      </div>
      <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={handleCreateAuction}
        >
          <p className="font-semibold text-xl md:text-2xl">Auction Detail</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-stone-600">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-stone-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
              >
                <option value="">Select Category</option>
                {auctionCategories.map((element) => {
                  return (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-stone-600">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-stone-600">Starting Bid</label>
              <input
                type="number"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-stone-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-2 border-stone-500 focus:outline-none px-2 rounded-md"
                rows={10}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-stone-600">
                Auction Starting Time
              </label>
              <DatePicker
                selected={startTime} //value
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeFormat="hh:mm aa" // Set time format to 12-hour with am/pm
                timeIntervals={15} // time gap between time will be 15 minutes
                dateFormat="MMMM d, yyyy h:mm aa" // Display date and time in 12-hour format with am/pm
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-stone-600">
                Auction End Time
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
          </div>
          <div className="flex flex-col gap-4">
            <label className="font-semibold text-xl md:text-2xl">
              Auction Item Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {auctionItemImgPreview ? (
                    <img
                      src={auctionItemImgPreview}
                      alt={title}
                      className="w-44 h-auto"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                    </>
                  )}

                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={auctionImgHandler}
                />
              </label>
            </div>
          </div>
          <button className="bg-[#D6482B] font-semibold hover:bg-[#b8381e] text-xl transition-all duration-300 py-2 px-4 rounded-md text-white w-[280px] mx-auto lg:w-[640px] my-4">
            {loading ? "Creating Auction..." : "Create Auction"}
          </button>
        </form>
      </div>
    </article>
  );
};

export default CreateAuction;
