import { useState } from "react";
import MeetingDate from "./MeetingDate";
import { rejectCustomOrder } from "@/services/message";

const MessagePopUp = ({
  message,
  setOpenMessage,
  handler = async () => {},
}) => {
  const [openMeetingDatePopUp, setOpenMeetingDatePopUp] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  const handleRejectCustomOrder = async () => {
    try {
      if (confirm("Are you sure you want to reject this order?")) {
        await rejectCustomOrder({ id: message?._id });
        await handler();
        setOpenMessage(false);
      }
    } catch (error) {
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div
      className={`fixed z-20 bg-[#282828b1] top-0 left-0 flex items-center justify-center font-montserrat w-full min-h-screen pt-[60px] md:pl-[20%]`}
    >
      {!message && (
        <div
          className={`dark:bg-darkBg w-3/4 md:w-2/3 items-center justify-center text-lg font-semibold text-grayHover rounded-sm gap-y-2 bg-white flex flex-col max-h-[80vh] h-fit px-8 py-14`}
        >
          Message Not Found
        </div>
      )}
      {message && (
        <div
          className={`dark:bg-darkBg w-3/4 md:w-2/3 rounded-sm gap-y-2 bg-white flex flex-col max-h-[80vh] h-fit overflow-y-scroll px-8 py-6`}
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm">Name:</p>
            <div className="h-10 bg-input dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
              <p> {message?.name}</p>
              {message?.user && <button type="butoon"></button>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm">Email:</p>
            <div className="h-10 bg-input dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
              {message?.email}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm">Phone:</p>
            <div className="h-10 bg-input dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
              {message?.phone}
            </div>
          </div>

          {message?.accept && (
            <div className="flex flex-col gap-2">
              <p className="text-sm">Meeting Date:</p>
              <div className="bg-input py-2 dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                {new Date(message?.meetingDate).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(message?.meetingDate).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-sm">Message:</p>
            <div className="bg-input min-h-10 py-2 dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
              {message?.content}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2 self-end">
            {message?.accept === null && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("approve");
                    setOpenMeetingDatePopUp(true);
                  }}
                  className="px-4 py-1.5 capitalize rounded-full bg-navy text-white"
                >
                  approve
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleRejectCustomOrder();
                  }}
                  className="px-4 py-1.5 capitalize rounded-full bg-red-400 text-white"
                >
                  Reject
                </button>
              </>
            )}
            {message?.accept && (
              <button
                type="button"
                onClick={() => {
                  setStatus("reschedule");
                  setOpenMeetingDatePopUp(true);
                }}
                className="px-4 py-1.5 capitalize rounded-full bg-navy text-white"
              >
                Reschedule
              </button>
            )}
            <button
              type="button"
              className="px-4 py-1.5 capitalize rounded-full bg-gray text-white"
              onClick={() => setOpenMessage(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {openMeetingDatePopUp && (
        <MeetingDate
          label={"set meeting date"}
          id={message?._id}
          error={error}
          setError={setError}
          setopenMeetingDatePopUp={setOpenMeetingDatePopUp}
          status={status}
          setopenMessage={setOpenMessage}
          handler={handler}
        />
      )}
    </div>
  );
};

export default MessagePopUp;
