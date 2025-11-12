import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box, Typography, Stack } from "@mui/material";
import DatePickerComp from "../../components/reusableComps/DatePickerComp";
import dayjs from "dayjs";

const BAR_COLOR = "#E28D21";
const AXIS_COLOR = "#012622";
const BG_COLOR = "#E5F8F7";

export default function BarChart({
  value = "2250 kg",
  barData = [],
  categories = [],
  dateValue,
  onDateChange,
  height = 260,
}) {
  // Prepare data for Recharts
  const chartData = categories.map((label, index) => ({
    name: label,
    value: barData[index] || 0,
  }));

  return (
    <Box
      sx={{
        background: BG_COLOR,
        borderRadius: "14px",
        px: { xs: 1.5, sm: 3 },
        pt: { xs: 2.2, sm: 3 },
        pb: { xs: 1.2, sm: 2 },
        width: "100%",
        minWidth: 330,
        minHeight: height,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            fontWeight={500}
            fontSize={16}
            color={AXIS_COLOR}
            letterSpacing={0.2}
          >
            Kgs recycled
          </Typography>
          <Typography
            fontWeight={700}
            fontSize={22}
            color={AXIS_COLOR}
            mt={0.1}
          >
            {value}
          </Typography>
        </Box>

        {/* Date Picker (reusable) */}
        <Box sx={{ width: 220 }}>
          <DatePickerComp
            dateValue={dayjs()}
            onChange={onDateChange}
            placeholder="Select range"
            width="100%"
          />
        </Box>
      </Stack>

      {/* Chart */}
      <Box sx={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 10, bottom: 10 }}
            barCategoryGap="25%"
          >
            <CartesianGrid stroke="transparent" />
            <XAxis
              dataKey="name"
              tick={{ fill: AXIS_COLOR, fontSize: 13 }}
              axisLine={{ stroke: AXIS_COLOR, strokeWidth: 2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#173331", fontSize: 13 }}
              axisLine={{ stroke: AXIS_COLOR, strokeWidth: 2 }}
              tickLine={false}
              tickFormatter={(val) => `${val} Kg`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#012622", fontWeight: 500 }}
              formatter={(value) => [`${value} Kg`, "Weight"]}
            />
            <Bar
              dataKey="value"
              fill={BAR_COLOR}
              radius={[4, 4, 0, 0]} // rounded top corners
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
