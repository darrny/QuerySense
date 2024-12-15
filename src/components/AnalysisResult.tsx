import DataVisualizations from './DataVisualizations'

export default function AnalysisResult({ result, data }: { result: string, data: any[] }) {
    const formatText = (text: string) => {
        return text.split('\n').map((line, index) => {
            const trimmedLine = line.trim();

            // Handle main titles
            if (trimmedLine.match(/^\*\*[^:]+\*\*$/)) {
                return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 mb-6 mt-16">
                        {trimmedLine.replace(/\*\*/g, '')}
                    </h2>
                );
            }

            // Handle subtitles (with colon)
            if (trimmedLine.match(/^\*\*[^:]+:\*\*$/)) {
                return (
                    <h3 key={index} className="text-xl font-semibold text-gray-800 mb-4 mt-8">
                        {trimmedLine.replace(/\*\*/g, '')}
                    </h3>
                );
            }

            // Handle bullet points
            if (trimmedLine.startsWith('-')) {
                return (
                    <li key={index} className="ml-6 mb-3 text-gray-700">
                        {trimmedLine.substring(1).trim()}
                    </li>
                );
            }

            // Handle regular paragraphs
            if (trimmedLine.length > 0) {
                return (
                    <p key={index} className="mb-4 text-gray-700">
                        {trimmedLine}
                    </p>
                );
            }

            // Handle empty lines
            return <div key={index} className="mb-2" />;
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="prose max-w-none">
                    <ul className="space-y-2 list-disc">
                        {formatText(result)}
                    </ul>
                </div>
            </div>

            <div className="mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Data Visualizations</h2>
                <div className="mt-4">
                    <DataVisualizations data={data} />
                </div>
            </div>
        </div>
    )
}