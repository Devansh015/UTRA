"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Types
interface UltrasonicReading {
  timestamp: number;
  distanceCm: number;
}

type DetectedColor = "red" | "green" | "blue" | "black";

interface ColorStats {
  red: number;
  green: number;
  blue: number;
  black: number;
  total: number;
  currentColor: DetectedColor | null;
}

interface LogEntry {
  t: number;
  msg: string;
  type: "info" | "data" | "warn" | "error" | "color";
}

// Constants
const READING_WINDOW = 50;
const COLOR_BAR_COLORS: Record<DetectedColor, string> = {
  red: "#ff4444",
  green: "#00ff00",
  blue: "#4488ff",
  black: "#888888",
};

const initialLogs: LogEntry[] = [
  { t: Date.now() - 1000, msg: "[BOOT] System initialized", type: "info" },
  { t: Date.now() - 900, msg: "[SENSOR] HC-SR04 ready", type: "info" },
  { t: Date.now() - 800, msg: "[SENSOR] TCS34725 color sensor ready", type: "info" },
];

export default function SensorDashboard() {
  const [ultrasonicReadings, setUltrasonicReadings] = useState<UltrasonicReading[]>([]);
  const [colorStats, setColorStats] = useState<ColorStats>({
    red: 0,
    green: 0,
    blue: 0,
    black: 0,
    total: 0,
    currentColor: null,
  });
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const endRef = useRef<HTMLDivElement>(null);

  // Calculate stability from variance
  const calculateStability = useCallback((readings: UltrasonicReading[]): number => {
    if (readings.length < 2) return 100;
    const distances = readings.map((r) => r.distanceCm);
    const mean = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance =
      distances.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / distances.length;
    const coefficientOfVariation = (Math.sqrt(variance) / mean) * 100;
    return Math.max(0, Math.min(100, 100 - coefficientOfVariation));
  }, []);

  // Get current distance
  const currentDistance =
    ultrasonicReadings.length > 0
      ? ultrasonicReadings[ultrasonicReadings.length - 1].distanceCm
      : 0;

  // Get stability
  const stability = calculateStability(ultrasonicReadings);

  // Auto-scroll logs
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Simulate ultrasonic sensor
  useEffect(() => {
    const interval = setInterval(() => {
      const baseDistance = 40 + Math.sin(Date.now() / 5000) * 15;
      const noise = (Math.random() - 0.5) * 4;
      const distance = Math.max(5, Math.min(100, baseDistance + noise));
      const timestamp = Date.now();

      setUltrasonicReadings((prev) => {
        const updated = [...prev, { timestamp, distanceCm: distance }];
        return updated.slice(-READING_WINDOW);
      });

      setLogs((prev) => [
        ...prev.slice(-100),
        {
          t: timestamp,
          msg: `[SENSOR] Distance: ${distance.toFixed(1)}cm`,
          type: "data",
        },
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Simulate color sensor
  useEffect(() => {
    const colors: DetectedColor[] = ["red", "green", "blue", "black"];
    const interval = setInterval(() => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const timestamp = Date.now();

      setColorStats((prev) => ({
        ...prev,
        [color]: prev[color] + 1,
        total: prev.total + 1,
        currentColor: color,
      }));

      setLogs((prev) => [
        ...prev.slice(-100),
        {
          t: timestamp,
          msg: `[COLOR] Detected: ${color.toUpperCase()}`,
          type: "color",
        },
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type: string) => {
    switch (type) {
      case "warn":
        return "text-[#ffb000]";
      case "error":
        return "text-red-500";
      case "data":
        return "text-[#00ff00]/70";
      case "color":
        return "text-[#4488ff]";
      default:
        return "text-[#00ff00]";
    }
  };

  const formatTime = (t: number) => {
    const d = new Date(t);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  // Prepare chart data
  const chartData = ultrasonicReadings.map((r, i) => ({
    index: i,
    distance: r.distanceCm,
  }));

  const colorBarData = [
    { name: "R", count: colorStats.red, color: "red" as DetectedColor },
    { name: "G", count: colorStats.green, color: "green" as DetectedColor },
    { name: "B", count: colorStats.blue, color: "blue" as DetectedColor },
    { name: "K", count: colorStats.black, color: "black" as DetectedColor },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 text-[#00ff00]/50 text-sm">
        {">"} UTRA SENSOR DASHBOARD
      </div>

      {/* Top Row: Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Ultrasonic Card */}
        <div className="terminal-box p-4">
          <div className="text-[#ffb000] text-xs mb-3">[ULTRASONIC]</div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold tabular-nums">
                {currentDistance.toFixed(1)}
                <span className="text-lg text-[#00ff00]/50">cm</span>
              </div>
              <div className="text-xs text-[#00ff00]/50 mt-1">
                Distance Reading
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums">
                {stability.toFixed(1)}
                <span className="text-lg text-[#00ff00]/50">%</span>
              </div>
              <div className="text-xs text-[#00ff00]/50 mt-1">
                Stability
              </div>
            </div>
          </div>
          {/* Stability Bar */}
          <div className="mt-3">
            <div className="h-2 bg-[#001a00] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${stability}%`,
                  backgroundColor:
                    stability > 80
                      ? "#00ff00"
                      : stability > 50
                        ? "#ffb000"
                        : "#ff4444",
                }}
              />
            </div>
          </div>
        </div>

        {/* Color Detection Card */}
        <div className="terminal-box p-4">
          <div className="text-[#ffb000] text-xs mb-3">[COLOR DETECTION]</div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-[#00ff00]/50 mb-1">Current:</div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-[#00ff00]/30"
                  style={{
                    backgroundColor: colorStats.currentColor
                      ? COLOR_BAR_COLORS[colorStats.currentColor]
                      : "#333",
                  }}
                />
                <span className="text-xl font-bold uppercase">
                  {colorStats.currentColor || "---"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#00ff00]/50 mb-1">Total Detections:</div>
              <div className="text-2xl font-bold tabular-nums">
                {colorStats.total}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Distance Line Chart */}
        <div className="terminal-box p-4">
          <div className="text-[#ffb000] text-xs mb-3">[DISTANCE OVER TIME]</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="index"
                  stroke="#00ff00"
                  strokeOpacity={0.3}
                  tick={{ fill: "#00ff00", fontSize: 10, opacity: 0.5 }}
                  tickLine={{ stroke: "#00ff00", strokeOpacity: 0.3 }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#00ff00"
                  strokeOpacity={0.3}
                  tick={{ fill: "#00ff00", fontSize: 10, opacity: 0.5 }}
                  tickLine={{ stroke: "#00ff00", strokeOpacity: 0.3 }}
                  width={35}
                />
                <Line
                  type="monotone"
                  dataKey="distance"
                  stroke="#00ff00"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Color Bar Chart */}
        <div className="terminal-box p-4">
          <div className="text-[#ffb000] text-xs mb-3">[COLOR BAR GRAPH]</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={colorBarData} layout="vertical">
                <XAxis
                  type="number"
                  stroke="#00ff00"
                  strokeOpacity={0.3}
                  tick={{ fill: "#00ff00", fontSize: 10, opacity: 0.5 }}
                  tickLine={{ stroke: "#00ff00", strokeOpacity: 0.3 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#00ff00"
                  strokeOpacity={0.3}
                  tick={{ fill: "#00ff00", fontSize: 12, opacity: 0.7 }}
                  tickLine={{ stroke: "#00ff00", strokeOpacity: 0.3 }}
                  width={25}
                />
                <Bar dataKey="count" isAnimationActive={false}>
                  {colorBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_BAR_COLORS[entry.color]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Color Legend with counts */}
          <div className="flex justify-around mt-2 text-xs">
            {colorBarData.map((c) => (
              <div key={c.name} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLOR_BAR_COLORS[c.color] }}
                />
                <span className="text-[#00ff00]/70 tabular-nums">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Terminal Log */}
      <div className="terminal-box p-4">
        <div className="text-[#ffb000] text-xs mb-3">[TERMINAL LOG]</div>
        <div className="h-48 overflow-y-auto text-sm">
          {logs.map((log, i) => (
            <div key={i} className={`${getLogColor(log.type)} mb-1`}>
              <span className="text-[#00ff00]/40 mr-2 tabular-nums">
                {formatTime(log.t)}
              </span>
              {log.msg}
            </div>
          ))}
          <div ref={endRef} />
          <div className="flex items-center mt-2">
            <span className="text-[#00ff00]/50 mr-2">root@utra:~$</span>
            <span className="blink">_</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-[#00ff00]/40">
        Connected to /dev/tty.usbmodem14101 @ 9600 baud
      </div>
    </div>
  );
}
