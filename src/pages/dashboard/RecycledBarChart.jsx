import React from "react";
import {
  BarChart as RechartsBarChart,
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

const styleSets = {
  recycled: {
    bg: "#E5F8F7",
    title: "Kgs recycled",
    valueColor: "#012622",
    bar: "#E28D21",
    axis: "#012622",
    unit: "kg",
  },
  co2: {
    bg: "#FAF3EB",
    title: "CO₂ saved",
    valueColor: "#012622",
    bar: "#02322B",
    axis: "#012622",
    unit: "kg",
  },
};

export default function BarChartCard({
  type = "recycled",
  value = "0 kg",
  barData = [],
  categories = [],
  onDateChange = () => {},
  dateValue = dayjs(),
  min = 100,
  max = 2100,
  yStep = 300,
  pickerLabel = "",
  height = 260,
}) {
  const styles = styleSets[type] || styleSets.recycled;
  const chartData = categories.map((label, index) => ({
    name: label,
    value: barData[index] || 0,
  }));

  return (
    <Box
      sx={{
        background: styles.bg,
        borderRadius: "14px",
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3 },
        width: "100%",
        minHeight: height,
        boxSizing: "border-box",
        overflow: "hidden", //  ensures inner chart doesn’t overflow container
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            fontWeight={500}
            fontSize={{ xs: 15, sm: 16 }}
            color={styles.valueColor}
          >
            {styles.title}
          </Typography>
          <Typography
            fontWeight={700}
            fontSize={{ xs: 20, sm: 22 }}
            color={styles.valueColor}
          >
            {value}
            <Typography
              component="span"
              fontWeight={500}
              fontSize={{ xs: 15, sm: 17 }}
              color={styles.valueColor}
              ml={0.6}
            >
              {styles.unit}
            </Typography>
          </Typography>
        </Box>

        {/* Date picker container that shrinks on small screens */}
        <Box sx={{ width: { xs: "100%", sm: 200, md: 220 } }}>
          <DatePickerComp
            dateValue={dateValue}
            onChange={onDateChange}
            placeholder="Select range"
            width="100%"
          />
        </Box>
      </Stack>

      {/* Chart container */}
      <Box sx={{ width: "100%", height, overflow: "hidden" }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0} //  allows chart to shrink
        >
          <RechartsBarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
            barCategoryGap="15%" //  more flexible on mobile
          >
            <CartesianGrid stroke="transparent" />
            <XAxis
              dataKey="name"
              tick={{ fill: styles.axis, fontSize: 12 }}
              axisLine={{ stroke: styles.axis, strokeWidth: 2 }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              minTickGap={0}
              domain={[min, max]}
              tickCount={7}
              tick={{ fill: "#173331", fontSize: 12 }}
              axisLine={{ stroke: styles.axis, strokeWidth: 2 }}
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
              formatter={(value) => [`${value} Kg`, "Value"]}
            />
            <Bar
              dataKey="value"
              fill={styles.bar}
              radius={[4, 4, 0, 0]}
              barSize={30} //  smaller bars for narrow screens
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
