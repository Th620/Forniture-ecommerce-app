"use client";

import { deleteUser, getUsers, updateUserRole } from "@/services/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineDelete, MdOutlineModeEdit } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";

export default function Clients() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState({});

  const handelGetUsers = async () => {
    try {
      setIsLoading(true);
      const users = await getUsers();

      setIsLoading(false);
      return users;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handelUpdateUserRole = async ({ id }) => {
    try {
      setIsLoading(true);
      await updateUserRole({ id });

      setIsLoading(false);
      return products;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handelDeleteUser = async ({ id }) => {
    try {
      setIsLoading(true);
      await deleteUser({ id });
      setIsLoading(false);
      return products;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      try {
        const users = await handelGetUsers();
        if (users) {
          console.log(users);

          setUsers([...users]);
        }
      } catch (error) {
        setError(error.message);
        console.log(error);
      }
    };
  }, [users]);

  return (
    <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
      <div className="p-5 w-full">
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
                  <Link href={`/dashboard/clients/${user?._id}`}>{user?._id}</Link>
                </td>
                <td className="font-medium hidden sm:table-cell min-w-fit w-40 ">
                  {user?.firstName}
                </td>
                <td className="font-medium hidden md:table-cell min-w-fit w-44">
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
                        await handelUpdateUserRole({ id: user?._id });
                      }
                    }}
                    className={`text-base ${
                      user?.admin === true ? "text-green-500" : "text-red-400"
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
                        confirm("Are you sure you want to delete this user")
                      ) {
                        await handelDeleteUser({ id: user?._id });
                      }
                    }}
                    className="px-1"
                  >
                    <MdOutlineDelete className="size-[18px] text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
