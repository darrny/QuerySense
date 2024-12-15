import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { data, query } = await req.json()

    // Extract and analyze CSV structure
    const columns = Object.keys(data[0]);
    const rowCount = data.length;
    const fileInfo = {
      columns,
      rowCount,
      sampleData: data.slice(0, 2) // Show first 2 rows
    };

    // Create a description of the data structure
    const dataDescription = `This dataset contains the following columns: ${columns.join(', ')}
    Sample of the data: ${JSON.stringify(data)}`

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze this data and format your response exactly as follows:

    Use these formatting rules:
    - Main titles: wrapped in "**Title**" (no extra spaces)
    - Subtitles: wrapped in "**Subtitle:**" (no extra spaces)
    - Bullet points: start with single hyphen (-)
    - Regular paragraphs: no special formatting
    
    Example:
    **Main Title**
    - Bullet point
    Regular paragraph text
    
    **Subtitle:**
    - Bullet point
    
    Be as insightful as possible and provide a detailed analysis of the data.
                
    Data: ${dataDescription}
    Question: ${query}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return both the analysis and file information
    return NextResponse.json({ 
      result: text,
      fileInfo: {
        numberOfColumns: columns.length,
        numberOfRows: rowCount,
        columnNames: columns,
        sampleData: fileInfo.sampleData
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}