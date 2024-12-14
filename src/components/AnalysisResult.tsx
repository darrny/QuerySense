import DataVisualizations from './DataVisualizations'

export default function AnalysisResult({ result, data }: { result: string, data: any[] }) {
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle section headers (text between **)
      if (line.includes('**')) {
        const cleanText = line.replace(/\*\*/g, '').trim();
        return (
          <h3 key={index} className="text-xl font-semibold text-gray-900 mb-4">
            {cleanText}
          </h3>
        );
      }
      // Handle numbered sections
      else if (/^\d+\./.test(line.trim())) {
        const cleanText = line.replace(/\*\*/g, '').trim();
        return (
          <h4 key={index} className="text-lg font-semibold text-gray-800 mt-6 mb-3">
            {cleanText}
          </h4>
        );
      }
      // Handle bullet points
      else if (line.trim().startsWith('*')) {
        return (
          <li key={index} className="ml-6 mb-2">
            {line.trim().replace('*', '').trim()}
          </li>
        );
      }
      // Regular text
      return <p key={index} className="mb-4">{line.trim()}</p>;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="prose max-w-none">
          <div className="space-y-2">
            {formatText(result)}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Data Visualizations</h2>
        <div className="mt-4">
          <DataVisualizations data={data} />
        </div>
      </div>
    </div>
  )
}