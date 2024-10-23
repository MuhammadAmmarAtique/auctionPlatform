import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContactForm =  (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send("service_h5gzbuw", "template_8yzs6et", {
        name,
        email,
        phone,
        subject,
        message,
      },"5vPFYBfQo5bu5UWeo")
      .then(() => {
        setLoading(false);
        toast.success("Email sent successfully!");
        // Clearing form after Successful Submission!
        setName("") 
        setEmail("")
        setPhone("")
        setSubject("")
        setMessage("")
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Cannot send Email, Please try again!");
      });
  };

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
      <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={handleContactForm}
        >
          <h3
            className={`text-[#D6482B] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
          >
            Contact Us
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-stone-500">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6482B]"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-stone-500">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6482B]"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-stone-500">Your Phone</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6482B]"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-stone-500">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6482B]"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-stone-500">Message</label>
            <textarea
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6482B]"
              required
            />
          </div>

          <button
            className="bg-[#d6482b] mx-auto font-semibold hover:bg-[#b8381e] text-xl transition-all duration-300 py-2 px-4 rounded-md text-white my-4"
            type="submit"
          >
            {loading ? "Sending Message..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
