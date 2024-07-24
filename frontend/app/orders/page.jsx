import Link from "next/link";

const orders = [
  {
    id: "00c64832-8fae-492f-a535-5d8f169cc947",
    date: "20/07/2024",
    price: "$25.00",
    status: "canceled",
  },
  {
    id: "fb04fb35-590d-4375-8bfc-a84c823cadc9",
    date: "22/07/2024",
    price: "$25.00",
    status: "dilevered",
  },
];

export default function Orders() {
  return (
    <main className="flex flex-col justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen mb-14">
      <h2 className="text-[32px] font-semibold capitalize">Orders</h2>
      <table className="w-full text-start table">
        <thead className="w-full">
          <tr className="border-b-2 border-[#E8E9EB] capitalize">
            <th className="font-medium text-center w-10 text-sm text-[#5E5E5E] py-2">
              #
            </th>
            <th className="font-medium text-start text-sm text-[#5E5E5E] py-2">
              order
            </th>
            <th className="font-medium text-start text-sm text-[#5E5E5E] py-2 hidden sm:table-cell">
              date
            </th>
            <th className="font-medium text-start text-sm text-[#5E5E5E] py-2 hidden sm:table-cell">
              price
            </th>
            <th className="font-medium text-center w-fit sm:w-40 text-sm text-[#5E5E5E] py-2">
              status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className="text-xs h-10 border-b-2 border-[#E8E9EB]"
            >
              <td className="font-medium min-w-7 text-center">{index}</td>
              <td className="font-semibold pr-4 min-w-10">
                <Link href={""}>{order.id}</Link>
              </td>
              <td className="font-medium hidden sm:table-cell min-w-fit w-44">
                {order.date}
              </td>
              <td className="font-semibold hidden sm:table-cell min-w-fit w-44">
                {order.price}
              </td>
              <td className="flex justify-center items-center h-10 w-fit sm:w-40">
                <div
                  className={`font-semibold py-1.5 w-20 sm:w-24 rounded-full text-[10px] sm:text-xs text-center capitalize ${
                    order.status === "canceled" && "bg-red-200 text-red-500"
                  } ${
                    order.status === "dilevered" &&
                    "bg-green-200 text-green-600"
                  }`}
                >
                  {order.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
