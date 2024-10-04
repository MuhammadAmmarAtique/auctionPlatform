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
    const file = e.target.files[0]
    setPaymentProof(file)
  }

  const handleSubmitComissionProof = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("amount", amount);
    formdata.append("comment", comment);
    formdata.append("paymentProof", paymentProof);
    dispatch(submitComissionProof(formdata));

    //clearing form after submission
    if (amount && comment && paymentProof ) {
      setAmount("")
      setComment("")
      setPaymentProof("")
    } 
  };

  return (
    <>
      <form
        style={{ marginLeft: "500px", marginTop: "100px" }}
        onSubmit={handleSubmitComissionProof}
      >
        <input
          type="number"
          name="amount"
          placeholder="write amount you send!"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />{" "}
        <br /> <br />
        <input
          type="text"
          name="comment"
          placeholder="write any comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />{" "}
        <br /> <br />
        <input
          type="file"
          name="paymentProof"
          onChange={paymentProofImgHandler}
        />{" "}
        <br /> <br />
        <button type="submit" disabled={loading}>
          {!loading ? "Submit Payment Proof" : "submitting"}
        </button>
      </form>
    </>
  );
};

export default SubmitComissionProof;
