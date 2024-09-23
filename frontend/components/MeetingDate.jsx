import { approveCustomOrder, rescheduleCustomOrder } from "@/services/message";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";

const MeetingDate = ({
  status,
  setopenMeetingDatePopUp,
  setopenMessage,
  setError,
  error = null,
  id,
  handler = async () => {},
}) => {
  const [date, setDate] = useState(null);
  console.log(date);

  const handleApproveCustomOrder = async () => {
    try {
      await approveCustomOrder({ id, meetingDate: date });
      await handler();
      setopenMeetingDatePopUp(false);
      setopenMessage(false);
    } catch (error) {
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleReschuduleCustomOrder = async () => {
    try {
      await rescheduleCustomOrder({ id, meetingDate: date });
      await handler();
      setopenMeetingDatePopUp(false);
      setopenMessage(false);
    } catch (error) {
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div
      className={`fixed z-20 bg-[#282828b1] top-0 left-0 flex items-center justify-center font-montserrat w-full h-screen pt-[60px] md:pl-[20%]`}
    >
      <div
        className={`dark:bg-darkBg  w-3/4 md:w-1/3 rounded-sm bg-white flex flex-col justify-center px-8 py-6`}
      >
        <label htmlFor={"date"} className="mb-2">
          Meeting Date:
        </label>
        {error && (
          <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
            <MdErrorOutline className="size-4" />
            {error?.Error}
          </div>
        )}
        <input
          type={"datetime-local"}
          name={"date"}
          id={"date"}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          className={`mt-2 h-10 bg-bg dark:bg-darkBody outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
        />
        <div className="flex items-center justify-start gap-4 my-4">
          {status === "approve" && (
            <button
              type="button"
              onClick={async () => {
                await handleApproveCustomOrder();
              }}
              className="px-3 py-1.5 capitalize rounded-full bg-yellow text-white"
            >
              approve
            </button>
          )}
          {status === "reschedule" && (
            <button
              type="button"
              onClick={async () => {
                await handleReschuduleCustomOrder();
              }}
              className="px-3 py-1.5 capitalize rounded-full bg-yellow text-white"
            >
              Reschedule
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setopenMeetingDatePopUp(false);
            }}
            className="flex justify-center items-center gap-2 capitalize text-sm font-medium px-4 h-10 rounded-md dark:text-white text-black cursor-pointer w-fit"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDate;
