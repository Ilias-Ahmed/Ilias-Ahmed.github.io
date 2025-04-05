import { motion } from "framer-motion";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface RadarChartProps {
  data: DataPoint[];
  size?: number;
  maxValue?: number;
  levels?: number;
  animated?: boolean;
  className?: string;
  labelClassName?: string;
}

export const RadarChart = ({
  data,
  size = 300,
  maxValue = 100,
  levels = 5,
  animated = true,
  className = "",
  labelClassName = "",
}: RadarChartProps) => {
  const center = size / 2;
  const radius = center * 0.8;
  const angleSlice = (Math.PI * 2) / data.length;

  // Generate coordinates for radar chart points
  const generateCoordinates = (value: number, index: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const scaledValue = (value / maxValue) * radius;
    return {
      x: center + scaledValue * Math.cos(angle),
      y: center + scaledValue * Math.sin(angle),
    };
  };

  // Generate coordinates for radar grid
  const generateGridCoordinates = (level: number) => {
    const scaledRadius = (level / levels) * radius;
    const points = [];

    for (let i = 0; i <= data.length; i++) {
      const angle = angleSlice * i - Math.PI / 2;
      points.push({
        x: center + scaledRadius * Math.cos(angle),
        y: center + scaledRadius * Math.sin(angle),
      });
    }

    return points;
  };

  // Generate SVG path from coordinates
  const generatePath = (coordinates: { x: number; y: number }[]) => {
    return (
      coordinates
        .map((point, i) => `${i === 0 ? "M" : "L"}${point.x},${point.y}`)
        .join(" ") + "Z"
    );
  };

  // Generate coordinates for data
  const dataCoordinates = data.map((d, i) => generateCoordinates(d.value, i));

  // Default color if not provided
  const defaultColors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#6366f1",
    "#84cc16",
  ];

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {Array.from({ length: levels }).map((_, level) => {
          const opacity = 0.1 + (level / levels) * 0.15;
          const gridCoords = generateGridCoordinates(level + 1);

          return (
            <g key={`grid-${level}`} opacity={opacity}>
              <polygon
                points={gridCoords.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.5"
              />
            </g>
          );
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Data */}
        <motion.path
          initial={
            animated
              ? { pathLength: 0, opacity: 0 }
              : { pathLength: 1, opacity: 1 }
          }
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={generatePath(dataCoordinates)}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <motion.path
          initial={
            animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.2 }
          }
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          d={generatePath(dataCoordinates)}
          fill="url(#gradient)"
          strokeWidth="0"
        />

        {/* Data points */}
        {dataCoordinates.map((coord, i) => (
          <motion.circle
            key={`point-${i}`}
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            cx={coord.x}
            cy={coord.y}
            r={4}
            fill={data[i].color || defaultColors[i % defaultColors.length]}
            stroke="#000"
            strokeWidth="1"
          />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      {data.map((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const labelRadius = radius + 20;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);

        // Calculate text anchor based on position
        let textAnchor = "middle";
        if (x < center - 10) textAnchor = "end";
        if (x > center + 10) textAnchor = "start";

        return (
          <div
            key={`label-${i}`}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium ${labelClassName}`}
            style={{
              left: x,
              top: y,
              textAlign:
                textAnchor === "middle"
                  ? "center"
                  : textAnchor === "start"
                  ? "left"
                  : "right",
              width: "80px",
            }}
          >
            {d.name}
          </div>
        );
      })}
    </div>
  );
};
