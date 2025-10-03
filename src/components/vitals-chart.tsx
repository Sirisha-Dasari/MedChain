'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { time: '00:00', heartRate: 72, spo2: 98, temp: 36.5 },
  { time: '03:00', heartRate: 68, spo2: 97, temp: 36.4 },
  { time: '06:00', heartRate: 65, spo2: 98, temp: 36.3 },
  { time: '09:00', heartRate: 75, spo2: 99, temp: 36.6 },
  { time: '12:00', heartRate: 80, spo2: 98, temp: 36.8 },
  { time: '15:00', heartRate: 78, spo2: 98, temp: 37.0 },
  { time: '18:00', heartRate: 82, spo2: 97, temp: 36.9 },
  { time: '21:00', heartRate: 74, spo2: 98, temp: 36.6 },
];

const chartConfig = {
  heartRate: {
    label: 'Heart Rate (BPM)',
    color: 'hsl(var(--chart-1))',
  },
  spo2: {
    label: 'SpO₂ (%)',
    color: 'hsl(var(--chart-2))',
  },
  temp: {
    label: "Temp (°C)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const VitalsChart = () => {
  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[35, 40]}
              hide
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Legend />
            <Line
              yAxisId="left"
              dataKey="heartRate"
              type="monotone"
              stroke="var(--color-heartRate)"
              strokeWidth={2}
              dot={false}
              name="Heart Rate"
            />
            <Line
              yAxisId="left"
              dataKey="spo2"
              type="monotone"
              stroke="var(--color-spo2)"
              strokeWidth={2}
              dot={false}
              name="SpO₂"
            />
             <Line
              yAxisId="right"
              dataKey="temp"
              type="monotone"
              stroke="var(--color-temp)"
              strokeWidth={2}
              dot={false}
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default VitalsChart;
