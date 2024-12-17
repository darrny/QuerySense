import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface DataRow {
    [key: string]: any;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
    try {
        const { data, query } = await req.json()

        // Get column information
        const columns = Object.keys(data[0]);
        const numericColumns = columns.filter(col => {
            const values = data.map((row: DataRow) => row[col]);
            return values.some((val: string) => !isNaN(parseFloat(val)));
        });

        // Create dataset summary
        const summary = {
            totalRows: data.length,
            columns: columns,
            numericColumns: numericColumns,
            sampleData: data.slice(0, 3)
        };

        console.log('Dataset Summary:', summary);

        const prompt = `You are a data analysis assistant analyzing a dataset with the following structure:

    Total Records: ${summary.totalRows}
    Columns: ${columns.join(', ')}
    
    The user's question is: "${query}"
    
    Analyze the data and provide specific insights. Your response MUST:
    1. Include specific numbers and percentages where relevant
    2. Format the response with proper headers using "**Header**" format
    3. Use bullet points with hyphens (-)
    4. Be clear and concise
    
    Sample of the data for context:
    ${JSON.stringify(summary.sampleData, null, 2)}`;

        console.log('Sending prompt:', prompt);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        // in route.ts
        // ... rest of the code remains same ...

        const text = response.text();

        console.log('AI Response:', text);

        if (!text || text.trim().length < 10) {
            console.log('Error: Empty or short response');
            throw new Error('Generated analysis was too short or empty');
        }

        // Ensure the text is properly formatted with the required sections
        const formattedText = `**Analysis Results**\n${text}`; // Add a header if none exists

        return NextResponse.json({
            result: formattedText,
            success: true  // Add a success flag
        })

        // ... error handling remains same ...
    } catch (error) {
        console.error('Error in analysis:', error);
        return NextResponse.json(
            {
                error: 'I apologize, but I need to clarify something. Could you rephrase your question to be more specific? For example, try asking about specific patterns, trends, or statistics in the data.'
            },
            { status: 500 }
        )
    }
}