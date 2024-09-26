"use client";

import Loading from "@/app/loading";
import { deleteUser, getUsers, updateUserRole } from "@/services/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdDelete,
  MdErrorOutline,
  MdOutlineAdd,
  MdOutlineErrorOutline,
} from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";

export default function Clients() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const handleGetUsers = async () => {
    try {
      const users = await getUsers({ role: "admin" });
      if (users) {
        setUsers([...users]);
      }
      setIsLoading(false);
      return users;
    } catch (error) {
      setIsLoading(false);
      setError({ admins: true, Error: error.message });
    }
  };

  const handleUpdateUserRole = async ({ id }) => {
    try {
      setIsLoading(true);
      await updateUserRole({ id });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteUser = async ({ id }) => {
    try {
      setIsLoading(true);
      await deleteUser({ id });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetUsers();
    };
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
          {error?.admins ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error.Error}
            </div>
          ) : (
            <div className="p-5 w-full flex flex-col">
              <div className="flex items-center justify-end mb-2">
                {error && !error?.admins && (
                  <div className="mr-auto w-1/3">
                    <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/clients?role=client", { scroll: true})}
                  className="flex justify-center items-center w-fit self-end gap-2 capitalize text-sm font-medium bg-yellow px-4 py-2 rounded-md text-white cursor-pointer"
                >
                  <MdOutlineAdd className="size-4" />
                  add new admin
                </button>
              </div>
              <table className="w-full text-start table">
                <thead className="w-full">
                  <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 capitalize">
                    <th className="font-medium text-center hidden sm:table-cell w-10 text-sm text-[#8C8C8C] py-2">
                      #
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                      user
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 hidden sm:table-cell">
                      first name
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 hidden md:table-cell">
                      last name
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 hidden sm:table-cell">
                      orders
                    </th>
                    <th className="font-medium text-center w-fit sm:w-40 text-sm text-[#8C8C8C] py-2">
                      Admin
                    </th>
                    <th className="font-medium text-center w-fit sm:w-40 text-sm text-[#8C8C8C] py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user?._id}
                      className="text-xs h-10 border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40"
                    >
                      <td className="font-medium min-w-7 text-center hidden sm:table-cell">
                        {index}
                      </td>
                      <td className="font-semibold pr-4 min-w-10 w-72">
                        <Link href={`/dashboard/clients/${user?._id}`}>
                          {user?._id}
                        </Link>
                      </td>
                      <td className="font-medium hidden sm:table-cell min-w-fit w-40 capitalize">
                        {user?.firstName}
                      </td>
                      <td className="font-medium hidden md:table-cell min-w-fit w-44 capitalize">
                        {user?.lastName}
                      </td>
                      <td className="font-semibold hidden sm:table-cell min-w-fit w-44">
                        {user?.orders?.length}
                      </td>
                      <td className="flex justify-center items-center h-10 w-fit sm:w-40 px-2">
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              confirm(
                                `Are you sure you want to make this user ${
                                  user?.admin ? "a non admin" : "an admin"
                                }`
                              )
                            ) {
                              await handleUpdateUserRole({ id: user?._id });
                            }
                          }}
                          className={`text-base ${
                            user?.admin === true
                              ? "text-green-500"
                              : "text-red-400"
                          }`}
                        >
                          <RiAdminLine />
                        </button>
                      </td>
                      <td className="font-semibold table-cell md:w-[8%] min-w-14">
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              confirm(
                                "Are you sure you want to delete this user"
                              )
                            ) {
                              await handleDeleteUser({ id: user?._id });
                            }
                          }}
                          className="px-1"
                        >
                          <MdDelete className="size-[18px] text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      )}
    </>
  );
}
