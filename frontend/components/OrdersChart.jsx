"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianAxis,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Sun", lastWeek: 1000, thisWeek: 1500 },
  { name: "Mon", lastWeek: 900, thisWeek: 1010 },
  { name: "Tue", lastWeek: 350, thisWeek: 600 },
  { name: "Wed", lastWeek: 1050, thisWeek: 450 },
  { name: "Thu", lastWeek: 800, thisWeek: 1200 },
  { name: "Fri", lastWeek: 950, thisWeek: 560 },
  { name: "Sat", lastWeek: 400, thisWeek: 1500 },
];

const OrdersChart = () => {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart width={1000} height={600} data={data}>
        <CartesianGrid
          vertical={false}
          strokeDasharray={"3 3"}
          stroke="#8C8C8C"
          opacity={0.4}
        />
        <XAxis
          dataKey={"name"}
          padding={{ left: 40, right: 40 }}
          stroke="#8C8C8C"
        />
        <YAxis stroke="#8C8C8C" width={30} />
        <Tooltip
        //   trigger="click"
          animationEasing="ease-in-out"
          animationDuration={400}
        />
        <Legend
          iconType="plainline"
          verticalAlign="top"
          align="right"
          height={30}
        />
        <Bar
          type={"monotone"}
          dataKey={"lastWeek"}
          name="Last Week"
          stroke="#3F497F"
          fill="#3F497F"
          opacity={0.9}
          animationEasing="ease-in-out"
          animationDuration={1500}
        />
        <Bar
          type={"monotone"}
          dataKey={"thisWeek"}
          name="This Week"
          stroke="#F7C04A"
          fill="#F7C04A"
          opacity={0.9}
          animationEasing="ease-in-out"
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrdersChart;
