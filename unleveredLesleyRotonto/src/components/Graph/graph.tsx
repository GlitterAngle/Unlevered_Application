import React from 'react';
import { ChartCanvas, Chart } from 'react-financial-charts';
import { CandlestickSeries } from 'react-financial-charts';
import { XAxis, YAxis } from 'react-financial-charts';
import { scaleTime } from 'd3-scale';

interface DataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface GraphProps {
  data: DataPoint[];
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format;

  const xAccessor = (d: DataPoint) => {
    if (!d || !d.date) {
      console.error("Invalid data point:", d);
      return new Date(); // Return current date as fallback
    }
    return new Date(d.date);
  };

  const validData = data.filter((d) => d && d.date && !isNaN(d.date.getTime()));
  if (validData.length === 0) {
    return <div>Invalid data for chart rendering</div>;
  }

  return (
    <ChartCanvas
      height={400}
      ratio={1}
      width={600}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      data={validData}
      seriesName="AAPL"
      xAccessor={xAccessor}
      xScale={scaleTime()}
      xExtents={[new Date(validData[validData.length - 1].date), new Date(validData[0].date)]}
    >
      <Chart id={0} yExtents={(d: DataPoint) => [d.high, d.low]}>
        <XAxis
          axisAt="bottom"
          orient="bottom"
          ticks={6}
          tickFormat={(date) => dateFormatter(new Date(date))}
        />
        <YAxis axisAt="left" orient="left" ticks={5} />
        <CandlestickSeries />
      </Chart>
    </ChartCanvas>
  );
};

export default Graph;
