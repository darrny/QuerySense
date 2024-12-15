import DataVisualizations from './DataVisualizations'

export default function AnalysisResult({ result, data }: { result: string, data: any[] }) {
    const formatText = (text: string) => {
        // Split text into sections for better spacing control
        const sections = text.split('\n').reduce((acc: string[][], line) => {
            const trimmedLine = line.trim();
            if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
                // Start new section when encountering a header
                acc.push([trimmedLine]);
            } else if (acc.length > 0 && trimmedLine) {
                // Add content to current section
                acc[acc.length - 1].push(trimmedLine);
            }
            return acc;
        }, []);

        return sections.map((section, sectionIndex) => {
            return (
                <div key={sectionIndex} className="mb-12"> {/* Consistent bottom spacing for sections */}
                    {section.map((line, lineIndex) => {
                        const trimmedLine = line.trim();

                        // Handle section headers
                        if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
                            return (
                                <h3 key={lineIndex} className="text-xl font-semibold text-gray-900 mb-6">
                                    {trimmedLine.replace(/\*\*/g, '')}
                                </h3>
                            );
                        }

                        // Handle bullet points
                        if (trimmedLine.startsWith('*')) {
                            return (
                                <li key={lineIndex} className="ml-6 mb-3 text-gray-700">
                                    {trimmedLine.substring(1).trim()}
                                </li>
                            );
                        }

                        // Handle regular paragraphs
                        return (
                            <p key={lineIndex} className="mb-4 text-gray-700">
                                {trimmedLine}
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
                <div className="prose max-w-none">
                    <ul className="space-y-2 list-disc">
                        {formatText(result)}
                    </ul>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Data Visualizations</h2>
                <div className="mt-4">
                    <DataVisualizations data={data} />
                </div>
            </div>
        </div>
    )
}