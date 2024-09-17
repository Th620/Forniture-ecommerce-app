import Image from "next/image";

export default function Customize() {
  return (
    <main className="flex flex-col justify-start px-10 md:px-75 lg:px-150 font-lato text-black bg-white pb-14 mt-[150px] min-h-screen">
      {/* <h2 className="text-[32px] font-semibold w-full mb-8 capitalize text-center text-navyHover">
        Personalize your living space
      </h2> */}
      {/* <div className="p-10">
        <div className="bg-blueBg w-full h-[70vh] relative ">
          <Image
            src={"/custom.jpg"}
            layout="fill"
            objectFit="cover"
            alt="customize"
            className="blur-[1.5px]"
          />
        </div>
      </div> */}
      <div className="w-full font-lato text-opacity-95 text-black">
        <h5 className="text-xl font-semibold text-center mb-3">
          Personalize your living space
        </h5>
        <p className="text-[15px] text-justify px-28">
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
      <form className="grid grid-cols-4 w-full px-28 gap-3 mt-16">
        <h6 className="col-span-4 font-medium text-center uppercase">
          Schedule a session
        </h6>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="md:col-span-2 h-11 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3"
        />
        <input
          type="email"
          name="email"
          placeholder="You email"
          className="md:col-span-2 h-11 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3"
        />
        <input
          type="number"
          name="phone"
          placeholder="Your phone"
          className="md:col-span-4 h-11 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3"
        />
        <textarea
          name="desc"
          rows="3"
          placeholder="Tell us about your custom needs"
          className="md:col-span-4 bg-white border border-black border-opacity-25 placeholder:text-black placeholder:text-opacity-30 placeholder:text-sm px-3 py-2 resize-none outline-none"
        />
        <button type="submit" className="uppercase col-start-4 col-span-1 py-2 bg-navy text-white hover:bg-navyHover transition-all duration-200">
          Send Message
        </button>
      </form>
    </main>
  );
}
