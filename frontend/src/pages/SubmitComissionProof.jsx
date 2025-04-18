import React, { useState } from "react";
import { submitComissionProof } from "@/store/slices/submitComissionProofSlice";
import { useDispatch, useSelector } from "react-redux";

const SubmitComissionProof = () => {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [paymentProof, setPaymentProof] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.submitComissionProof);

  const paymentProofImgHandler = (e) => {
    const file = e.target.files[0];
    setPaymentProof(file);
  };

  const handleSubmitComissionProof = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("amount", amount);
    formdata.append("comment", comment);
    formdata.append("paymentProof", paymentProof);
    dispatch(submitComissionProof(formdata))
    .then((response) => { // clearing form after successfull form submission
      if (response.status == 200) {
        setAmount("");
        setComment("");
        setPaymentProof("");
      }
    });
  };

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
      <div className="mb-5">
  <h1
    className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
  >
    Payment Methods
  </h1>
  <p className="text-xl">
    Please pay your unpaid commission to the Super Admin using the following payment methods.
  </p>

  <div className="mt-5 space-y-6">
    {/* Bank Transfer Details */}
    <div className="border p-4 rounded-md shadow-lg">
      <h2 className="text-xl font-bold text-[#d6482b] mb-2">Bank Transfer</h2>
      <p className="text-lg"><strong>Bank Account Number:</strong> 1234567890123456</p>
      <p className="text-lg"><strong>Bank Account Name:</strong> John Doe</p>
      <p className="text-lg"><strong>Bank Name:</strong> National Bank of XYZ</p>
    </div>

    {/* Easypaisa Details */}
    <div className="border p-4 rounded-md shadow-lg">
      <h2 className="text-xl font-bold text-[#d6482b] mb-2">Easypaisa</h2>
      <p className="text-lg"><strong>Easypaisa Account Number:</strong> 03001234567</p>
    </div>

    {/* PayPal Details */}
    <div className="border p-4 rounded-md shadow-lg">
      <h2 className="text-xl font-bold text-[#d6482b] mb-2">PayPal</h2>
      <p className="text-lg"><strong>PayPal Email:</strong> johndoe@example.com</p>
    </div>
  </div>
</div>
<h1
    className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl mt-5`}
  >
    Submit Comission Proof
  </h1>
  <p className="text-xl mb-5">
    Once the payment is made, kindly upload the payment proof for verification.
  </p>
        <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">

          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleSubmitComissionProof}
          >
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-stone-500">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-stone-500">
                Payment Proof (ScreenShot)
              </label>
              <input
                type="file"
                onChange={paymentProofImgHandler}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px] text-stone-500">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={7}
                className="text-[16px] py-2 bg-transparent border-[1px] rounded-md px-1 border-stone-500 focus:outline-none"
              />
            </div>
            <button
              className="bg-[#d6482b] mx-auto font-semibold hover:bg-[#b8381e] text-xl transition-all duration-300 py-2 px-4 rounded-md text-white my-4"
              type="submit"
            >
              {loading ? "Uploading..." : "Upload Payment Proof"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SubmitComissionProof;
