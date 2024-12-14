'use client'

import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer
} from 'recharts'

interface DataVisualizationsProps {
  data: any[]
}

export default function DataVisualizations({ data }: DataVisualizationsProps) {
  if (!data || data.length === 0 || !data[0]) {
    return <div>No data available for visualization</div>
  }

  const safeToString = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  const formatColumnName = (name: string): string => {
    // Convert camelCase or snake_case to spaces
    const formatted = name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim();
    
    // Capitalize first letter of each word
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const isDate = (str: string): boolean => {
    if (!str) return false;
    const date = new Date(str);
    return date instanceof Date && !isNaN(date.getTime());
  }

  const isNumeric = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  const analyzeColumns = () => {
    const columns = Object.keys(data[0]);
    return columns.map(column => {
      const values = data.map(row => row[column]).filter(v => v !== null && v !== undefined);
      const uniqueValues = new Set(values);
      
      const distribution = values.reduce((acc: {[key: string]: number}, val) => {
        const key = safeToString(val);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return {
        name: column,
        displayName: formatColumnName(column),
        uniqueCount: uniqueValues.size,
        totalCount: values.length,
        isNumeric: values.every(v => isNumeric(v)),
        isDate: values.every(v => isDate(safeToString(v))),
        hasLowCardinality: uniqueValues.size <= 10,
        distribution
      };
    });
  };

  const createVisualizations = () => {
    const analysis = analyzeColumns();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return analysis.map((col, index) => {
      if (col.name.toLowerCase().includes('id') || 
          (!col.hasLowCardinality && !col.isNumeric) ||
          col.uniqueCount <= 1) {
        return null;
      }

      // Format data labels
      const formatLabel = (label: string) => {
        if (label.length <= 20) return label;
        return label.substring(0, 17) + '...';
      };

      const chartData = Object.entries(col.distribution)
        .map(([key, value]) => ({
          name: formatLabel(key),
          fullName: key, // Keep full name for tooltip
          value: (value / col.totalCount) * 100
        }))
        .sort((a, b) => b.value - a.value);

      const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white p-2 border rounded shadow">
              <p className="text-sm">{payload[0].payload.fullName}</p>
              <p className="text-sm font-semibold">{`${payload[0].value.toFixed(1)}%`}</p>
            </div>
          );
        }
        return null;
      };

      if (col.hasLowCardinality && !col.isNumeric) {
        return (
          <div key={index} className="mb-12 p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-6">{col.displayName}</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name} (${value.toFixed(1)}%)`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      return (
        <div key={index} className="mb-12 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-6">{col.displayName}</h3>
          <div className="h-96"> {/* Keep height consistent */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                // Add proper margins on all sides
                margin={{ 
                  top: 20,    // Add top margin
                  right: 30,  // Space for potential overflow on right
                  bottom: 90, // Keep space for rotated labels
                  left: 60    // Increased left margin for y-axis label
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -40  // Adjusted offset to move label closer to axis
                  }} 
                />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const visualizations = createVisualizations();

  return (
    <div className="space-y-8">
      {visualizations.length > 0 ? (
        visualizations
      ) : (
        <div>No suitable data found for visualization</div>
      )}
    </div>
  );
}