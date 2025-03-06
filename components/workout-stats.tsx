"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Workout } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2Icon, DumbbellIcon } from "lucide-react";
import { getWorkouts } from "@/lib/storage";

export default function WorkoutStats() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const fetchedWorkouts = await getWorkouts();
      setWorkouts(fetchedWorkouts);
      setLoading(false);
    };
    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2Icon className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading workout statistics...</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-lg">
        <DumbbellIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground mb-2">No workout data available</p>
        <p className="text-muted-foreground">
          Start tracking your workouts to see statistics!
        </p>
      </div>
    );
  }

  // Get workout types and count
  const workoutTypes = workouts.reduce(
    (acc: Record<string, number>, workout) => {
      acc[workout.title] = (acc[workout.title] || 0) + 1;
      return acc;
    },
    {}
  );

  const pieData = Object.entries(workoutTypes).map(([name, value]) => ({
    name,
    value,
  }));

  // Get workout count by day of week
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const workoutsByDay = workouts.reduce(
    (acc: Record<string, number>, workout) => {
      const date = new Date(workout.date);
      const day = dayNames[date.getDay()];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {}
  );

  const barData = dayNames.map((day) => ({
    name: day.substring(0, 3),
    workouts: workoutsByDay[day] || 0,
  }));

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#6B66FF",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Workouts by Type</CardTitle>
          <CardDescription>Distribution of your workout types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workouts by Day</CardTitle>
          <CardDescription>Which days you work out most</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="workouts" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
