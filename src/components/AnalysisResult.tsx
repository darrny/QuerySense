import DataVisualizations from './DataVisualizations'

export default function AnalysisResult({ result, data }: { result: string, data: any[] }) {
    const formatBoldText = (text: string) => {
        // Replace bold text patterns (**text**) with styled spans
        return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Remove the asterisks and wrap in bold span
                return (
                    <span key={index} className="font-semibold">
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return part;
        });
    };

    const formatText = (text: string) => {
        const sections = text.split('\n').reduce((acc: string[][], line) => {
            const trimmedLine = line.trim();
            if (trimmedLine.match(/^\*\*[^*]+:\*\*$/)) {
                // Start new section when encountering a header with colon
                acc.push([trimmedLine]);
            } else if (acc.length > 0 && trimmedLine) {
                // Add content to current section
                acc[acc.length - 1].push(trimmedLine);
            }
            return acc;
        }, []);

        return sections.map((section, sectionIndex) => {
            return (
                <div key={sectionIndex} className="mb-12">
                    {section.map((line, lineIndex) => {
                        const trimmedLine = line.trim();

                        // Handle section headers
                        if (trimmedLine.match(/^\*\*[^*]+:\*\*$/)) {
                            return (
                                <h3 key={lineIndex} className="text-xl font-semibold text-gray-900 mb-6">
                                    {trimmedLine.replace(/\*\*/g, '')}
                                </h3>
                            );
                        }

                        // Handle bullet points
                        if (trimmedLine.startsWith('-')) {
                            return (
                                <li key={lineIndex} className="ml-6 mb-3 text-gray-700">
                                    {formatBoldText(trimmedLine.substring(1).trim())}
                                </li>
                            );
                        }

                        // Handle regular paragraphs
                        return (
                            <p key={lineIndex} className="mb-4 text-gray-700">
                                {formatBoldText(trimmedLine)}
                            </p>
                        );
                    })}
                </div>
            );
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="prose max-w-none bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
                    <ul className="space-y-2 list-disc">
                        {formatText(result)}
                    </ul>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-blue-900 mb-8">Data Visualizations</h2>
                <div className="mt-4">
                    <DataVisualizations data={data} />
                </div>
            </div>
        </div>
    );
}