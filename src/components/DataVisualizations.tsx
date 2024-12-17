'use client'

import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer
} from 'recharts'

interface DataVisualizationsProps {
  data: any[]
}

interface ChartData {
  name: string;
  value: number;
}

interface ColumnAnalysis {
  name: string;
  displayName: string;
  uniqueCount: number;
  totalCount: number;
  isNumeric: boolean;
  isDate: boolean;
  distribution: ChartData[];
}

export default function DataVisualizations({ data }: DataVisualizationsProps) {
  if (!data || data.length === 0 || !data[0]) {
    return <div className="text-white">No data available for visualization</div>
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const determineChartType = (column: ColumnAnalysis): 'pie' | 'bar' | null => {
    if (column.name.toLowerCase().includes('id')) return null;
    if (column.isNumeric) {
      return column.uniqueCount <= 10 ? 'bar' : null;
    }
    return column.uniqueCount <= 8 ? 'pie' : 'bar';
  };

  const createHistogramData = (values: number[]): ChartData[] => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    // For 1-10 scale, use 2-point intervals
    if (max <= 10 && min >= 0) {
      const bins = [0, 2, 4, 6, 8, 10];
      const result = Array(bins.length - 1).fill(0);
      values.forEach(value => {
        for (let i = 0; i < bins.length - 1; i++) {
          if (value >= bins[i] && value <= bins[i + 1]) {
            result[i]++;
            break;
          }
        }
      });
      return result.map((count, i) => ({
        name: `${bins[i]}-${bins[i + 1]}`,
        value: (count / values.length) * 100
      }));
    }

    // For other ranges, use automatic binning
    const binCount = 5; // Reduced number of bins
    const binWidth = (max - min) / binCount;
    const bins = Array(binCount).fill(0);

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
      bins[binIndex]++;
    });

    return bins.map((count, i) => ({
      name: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`,
      value: (count / values.length) * 100
    }));
  };

  const analyzeColumns = (): ColumnAnalysis[] => {
    const columns = Object.keys(data[0]);
    return columns.map(column => {
      const values = data.map(row => row[column])
        .filter(v => v !== null && v !== undefined);
      const uniqueValues = new Set(values);

      const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
      const isNumeric = numericValues.length === values.length;

      let distribution: ChartData[];
      if (isNumeric) {
        distribution = createHistogramData(numericValues);
      } else {
        const tempDist: { [key: string]: number } = {};
        values.forEach(val => {
          const key = String(val);
          tempDist[key] = (tempDist[key] || 0) + 1;
        });
        distribution = Object.entries(tempDist).map(([key, value]) => ({
          name: key,
          value: (value / values.length) * 100
        })).sort((a, b) => b.value - a.value);
      }

      return {
        name: column,
        displayName: column.replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        uniqueCount: uniqueValues.size,
        totalCount: values.length,
        isNumeric,
        isDate: values.every(v => !isNaN(Date.parse(String(v)))),
        distribution
      };
    });
  };

  const createVisualizations = () => {
    const analysis = analyzeColumns();

    return analysis.map((col, index) => {
      const chartType = determineChartType(col);
      if (!chartType) return null;

      return (
        <div key={index} className="mb-12 p-6 bg-white rounded-lg shadow">
          {/* Remove truncation of title, let it wrap naturally */}
          <h3 className="text-lg font-semibold text-gray-900 mb-6 whitespace-normal">
            {col.displayName}
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={col.distribution}
                    cx="50%"
                    cy="40%" // Moved up more to make room for legend
                    outerRadius={90} // Slightly smaller to accommodate legend
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) => `${value.toFixed(0)}%`} // Simplified label to just percentage
                  >
                    {col.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={100} // Increased height for legend
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '12px'
                    }}
                    formatter={(value) => (
                      <span className="text-gray-900 whitespace-normal" style={{
                        display: 'inline-block',
                        maxWidth: '150px', // Limit width and allow wrapping
                        wordBreak: 'break-word'
                      }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              ) : (
                <BarChart
                  data={col.distribution}
                  margin={{ top: 20, right: 30, bottom: 70, left: 60 }} // Increased bottom margin
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70} // Increased height for labels
                    tick={{
                      fill: 'rgb(17, 24, 39)',
                      fontSize: 12,
                      dy: 25 // Adjusted vertical position of labels
                    }}
                  />
                  <YAxis
                    tick={{ fill: 'rgb(17, 24, 39)' }}
                    label={{
                      value: '%',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -5,
                      fill: 'rgb(17, 24, 39)'
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                  />
                  <Bar
                    dataKey="value"
                    fill={COLORS[0]}
                    maxBarSize={60}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="space-y-8">
      {createVisualizations()}
    </div>
  );
}