"use client";

import { addMessage } from "@/services/message";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { isMobilePhone } from "validator";
import isEmail from "validator/lib/isEmail";

export default function Customize() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [content, setcontent] = useState("");
  const [message, setmessage] = useState("");
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMessage = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!name) throw new Error("Name is required");
      if (!isEmail(email)) throw new Error("Enter a valid email");
      if (!isMobilePhone(phone, "ar-DZ"))
        throw new Error("Enter a valid phone number");
      if (!content) throw new Error("Enter a message");
      if (content.length < 20) throw new Error("Your message is so short");
      await addMessage({ content, name, email, phone });
      setmessage("Message sent successfully");
      setTimeout(() => {
        setmessage("");
      }, 4000);
      setname("");
      setemail("");
      setphone("");
      setcontent("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <main className="flex flex-col justify-start px-10 md:px-75 lg:px-150 font-lato text-black bg-white pb-14 mt-[150px] min-h-screen">
      <div className="w-full font-lato text-opacity-95 text-black">
        <h5 className="text-xl font-semibold text-center mb-3">
          Personalize your living space
        </h5>
        <p className="text-[15px] text-justify px-0 md:px-28">
          Transform your living space with our bespoke furniture customization
          service. Choose from a wide range of materials, colors, and finishes
          to create pieces that are uniquely yours. Our intuitive 3D visualizer
          lets you experiment with different designs and see how they fit into
          your home in real-time. Whether you’re looking for a statement piece
          or something that blends seamlessly with your existing decor, our
          customization options ensure your furniture is a perfect match.
          Experience the satisfaction of owning furniture that is tailored to
          your taste and lifestyle.
        </p>
      </div>
      <form
        onSubmit={handleAddMessage}
        className="grid grid-cols-4 w-full px-0 md:px-28 gap-3 mt-16"
      >
        <h6 className="col-span-4 font-medium text-center uppercase">
          Schedule a session
        </h6>
        <p
          className={`col-span-4 flex items-center gap-2 text-[13px] ${
            error ? "text-red-400" : "text-navy"
          }`}
        >
          {(message || error) && <MdErrorOutline className="text-base" />}
          {message && !error && message}
          {error && error.Error}
        </p>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
          placeholder="Your name"
          className="md:col-span-2 col-span-4 outline-none h-11 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          placeholder="You email"
          className="md:col-span-2 col-span-4 outline-none h-11 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3"
        />
        <input
          type="number"
          name="phone"
          value={phone}
          onChange={(e) => {
            setphone(e.target.value);
          }}
          placeholder="Your phone"
          className="col-span-4 outline-none h-11 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3"
        />
        <textarea
          name="desc"
          rows="3"
          value={content}
          onChange={(e) => {
            setcontent(e.target.value);
          }}
          placeholder="Tell us about your custom needs"
          className="col-span-4 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3 py-2 resize-none outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="uppercase disabled:opacity-50 disabled:cursor-not-allowed  md:col-start-4 col-span-4  md:col-span-1 py-2 bg-navy text-white hover:bg-navyHover transition-all duration-200"
        >
          Send Message
        </button>
      </form>
    </main>
  );
}
