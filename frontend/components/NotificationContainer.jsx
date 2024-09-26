import { useRouter } from "next/navigation";

const NotificationsContainer = ({
  className,
  setOpenNotification,
  notifications,
}) => {
  const router = useRouter();

  return (
    <div
      onMouseOver={() => setOpenNotification(true)}
      onMouseLeave={() => setOpenNotification(false)}
      className={`${className} font-montserrat w-[60vw] sm:w-[40vw] md:w-[20vw] text-sm bg-white dark:bg-darkBg text-black dark:text-white  border border-gray dark:border-opacity-10 border-opacity-40 rounded-md shadow-md`}
    >
      <h5 className="px-3 py-3 font-semibold border-b border-gray dark:border-opacity-10 border-opacity-40 text-start">
        Notifications
      </h5>
      <div>
        {(!notifications || notifications?.length === 0) && (
          <div className="w-full py-4 text-gray text-opacity-70 dark:text-opacity-60 text-center">
            No Notifications
          </div>
        )}
        {notifications?.map((notification, index) => (
          <div
            onClick={() => {
              if (notification?.state === "meetings") {
                router.push(
                  `/dashboard/custom-orders/meetings?d=${
                    new Date().toISOString().split("T")[0]
                  }`, { scroll: true}
                );
                return;
              }
              if (notification?.state === "shipping") {
                router.push(
                  `/dashboard/orders/shipping?d=${
                    new Date().toISOString().split("T")[0]
                  }`
                  , { scroll: true});
                return;
              }
              if (notification?.state === "orders") {
                router.push(`/dashboard/orders?period=today`, { scroll: true});
                return;
              }
            }}
            className={`text-xs w-full py-4 text-start flex items-center px-5 ${
              index === notifications.length - 1
                ? "border-0"
                : "border-b border-gray dark:border-opacity-10 border-opacity-40"
            } hover:bg-bg hover:dark:bg-darkHover`}
          >
            <span className="h-1.5 w-1.5 inline-block rounded-full bg-yellow mr-4"></span>
            <span className="">{notification.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsContainer;
