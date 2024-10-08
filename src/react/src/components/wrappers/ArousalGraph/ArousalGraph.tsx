import { ArousalGraphDataPoint } from "@/models/Graph";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IArousalGraph {
  /**
   * List of data to plot on the arousal graph in format described by
   * {@link ArousalGraphDataPoint}
   */
  data: ArousalGraphDataPoint[];
  /**
   * The timestep that should be used for each of the arousal points
   */
  deltaT?: number;
  /**
   * The current point in time which is being actuated
   */
  currentTimestamp?: number;
}

/**
 * Colour for line on arousal graph
 */
const STROKE_COLOUR = "#8ED081" as const;

/**
 * Graph which displays a **single** time series of arousal values
 */
const ArousalGraph = ({ data, currentTimestamp }: IArousalGraph) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis
          dataKey={"time"}
          unit={"s"}
          interval={"equidistantPreserveStart"}
        >
          <Label value={"Time"} />
        </XAxis>
        <Legend verticalAlign="top" height={36} />
        <Tooltip />
        <YAxis />
        {currentTimestamp && (
          <ReferenceLine
            ifOverflow="visible"
            x={currentTimestamp}
            stroke="red"
          />
        )}
        <ReferenceLine
          stroke="black"
          y={0}
          ifOverflow="visible"
          strokeWidth={2}
        />

        <CartesianGrid stroke="#f5f5f5" />
        <Line
          name="Arousal Value"
          type="stepAfter"
          dataKey={"value"}
          stroke={STROKE_COLOUR}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ArousalGraph;
