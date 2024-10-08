"use client";

import { getEarnings } from "@/services/order";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// const data = [
//   { name: "Jan", lastYear: 1000, thisYear: 1500 },
//   { name: "Feb", lastYear: 900, thisYear: 1010 },
//   { name: "Mar", lastYear: 350, thisYear: 600 },
//   { name: "Apr", lastYear: 1050, thisYear: 450 },
//   { name: "May", lastYear: 800, thisYear: 1200 },
//   { name: "Jun", lastYear: 950, thisYear: 560 },
//   { name: "Jul", lastYear: 400, thisYear: 1500 },
//   { name: "Aug", lastYear: 100, thisYear: 600 },
//   { name: "Sep", lastYear: 120, thisYear: 410 },
//   { name: "Oct", lastYear: 670, thisYear: 900 },
//   { name: "Nov", lastYear: 980, thisYear: 1030 },
//   { name: "Dec", lastYear: 810, thisYear: 1000 },
// ];

const EarningsChart = () => {
  const [data, setData] = useState([
    { name: "Jan", lastYear: 0, thisYear: 0 },
    { name: "Feb", lastYear: 0, thisYear: 0 },
    { name: "Mar", lastYear: 0, thisYear: 0 },
    { name: "Apr", lastYear: 0, thisYear: 0 },
    { name: "May", lastYear: 0, thisYear: 0 },
    { name: "Jun", lastYear: 0, thisYear: 0 },
    { name: "Jul", lastYear: 0, thisYear: 0 },
    { name: "Aug", lastYear: 0, thisYear: 0 },
    { name: "Sep", lastYear: 0, thisYear: 0 },
    { name: "Oct", lastYear: 0, thisYear: 0 },
    { name: "Nov", lastYear: 0, thisYear: 0 },
    { name: "Dec", lastYear: 0, thisYear: 0 },
  ]);

  const handleGetData = async () => {
    try {
      const data = await getEarnings();
      if (data?.earnings) {
        setData(data.earnings);
      }
    } catch (error) {}
  };

  useEffect(() => {
    return async () => {
      await handleGetData();
    };
  }, []);

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <LineChart width={1000} height={600} data={data}>
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
        <YAxis stroke="#8C8C8C" width={50} />
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
        <Line
          type={"monotone"}
          dataKey={"lastYear"}
          name="Last Year"
          stroke="#3F497F"
          dot={false}
          animationEasing="ease-in-out"
          animationDuration={1500}
        />
        <Line
          type={"monotone"}
          dataKey={"thisYear"}
          name="This Year"
          stroke="#F7C04A"
          dot={false}
          animationEasing="ease-in-out"
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EarningsChart;
