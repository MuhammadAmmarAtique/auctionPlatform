import {
  deletePaymentProof,
  getPaymentProofDetail,
  updatePaymentProof,
} from "../../store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const PaymentProofs = () => {
  const { allPaymentProofs, paymentProofDetail } = useSelector(
    (state) => state.superAdmin
  );
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getPaymentProofDetail(id));
  };

  // For Drawer
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (paymentProofDetail && Object.keys(paymentProofDetail).length > 0) {
      setOpenDrawer(true);
    }
  }, [paymentProofDetail]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-5">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">User ID</th>
              <th className="w-1/3 py-2">Status</th>
              <th className="w-1/3 py-2">Amount</th>
              <th className="w-1/3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {allPaymentProofs.length > 0 ? (
              allPaymentProofs.map((element, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">{element.userId}</td>
                    <td className="py-2 px-4 text-center">{element.status}</td>
                    <td className="py-2 px-4 text-center">{element.amount}</td>
                    <td className="flex items-center py-4 justify-center gap-3">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-all duration-300"
                        onClick={() => handleFetchPaymentDetail(element._id)}
                      >
                        View
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-all duration-300"
                        onClick={() => handlePaymentProofDelete(element._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center text-xl text-sky-600 py-3">
                <td>No payment proofs are found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
    </>
  );
};

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { paymentProofDetail, loading } = useSelector(
    (state) => state.superAdmin
  );
  const [amount, setAmount] = useState(paymentProofDetail.amount || "");
  const [status, setStatus] = useState(paymentProofDetail.status || "");

  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("status", status);
    dispatch(updatePaymentProof(paymentProofDetail._id, formData));
  };

  return (
    <>
      <section
        className={`fixed ${
          openDrawer && paymentProofDetail.userId
            ? "bottom-0 opacity-100"
            : "-bottom-full opacity-0"
        } left-0 w-full transition-all duration-300 min-h-screen flex items-end`}
      >
        <div className="bg-white h-fit transition-all duration-300 w-full overflow-y-auto max-h-[100vh]">
          <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto flex flex-col">
            <h3 className="text-[#D6482B] text-3xl font-semibold text-center mb-1">
              Update Payment Proof
            </h3>
            <p className="text-stone-600 text-xl text-center">
              You can update Amount and Payment Status.
            </p>
            <form className="flex flex-col gap-5 my-5">
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-gray-500">Auctioneer ID</label>
                <input
                  type="text"
                  value={paymentProofDetail.userId || ""}
                  disabled
                  onChange={(e) => e.target.value}
                  className="text-xl px-1 py-2 bg-gray-200 border-[1px] border-gray-400 rounded-md focus:outline-none text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-gray-500">
                  Auctioneer Comments
                </label>
                <textarea
                  rows={5}
                  value={paymentProofDetail.comment || ""}
                  onChange={(e) => e.target.value}
                  disabled
                  className="text-xl px-1 py-2 bg-gray-200 border-[1px] border-gray-400 rounded-md focus:outline-none text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600 rounded-md focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600 rounded-md focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Settled">Settled</option>
                </select>
              </div>

              <div>
                <Link
                  to={paymentProofDetail.imageProof?.url || ""}
                  className="bg-[#D6482B] flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-[#b8381e]"
                  target="_blank"
                >
                  Payment Proof (SS)
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-blue-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-blue-700"
                  onClick={handlePaymentProofUpdate}
                >
                  {loading ? "Updating Payment Proof" : "Update Payment Proof"}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-yellow-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-yellow-700"
                  onClick={() => {
                    setOpenDrawer(false);
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "instant",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
