import React from "react";
import { deleteAuctionItem } from "../../store/slices/auctionSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DeleteAuctionItem = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  const handleAuctionDelete = (id) => {
    dispatch(deleteAuctionItem(id));
  };

  return (
    <>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-2 text-center">Image</th>
              <th className="w-1/4 py-2 text-center">Title</th>
              <th className="w-1/4 py-2 text-center">Highest Bid</th>
              <th className="w-1/4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {allAuctions.length > 0 ? (
              allAuctions.map((element) => {
                return (
                  <tr key={element._id}>
                    <td className="py-2 px-4 flex justify-center items-center">
                      <img
                        src={element.image?.url}
                        alt={element.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">{element.title}</td>
                    <td className="py-2 px-4 text-center">
                      {element.currentBid}
                    </td>
                    <td className="py-2 px-4 text-center flex justify-center space-x-2">
                      <Link
                        to={`/auction/item/${element._id}`}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-all duration-300"
                      >
                        View
                      </Link>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-all duration-300"
                        onClick={() => handleAuctionDelete(element._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center text-xl text-sky-600 py-3">
                <td colSpan="4">No Auctions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DeleteAuctionItem;
