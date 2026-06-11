'use server';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `You are 'CuongMini', a highly advanced security AI chatbot created by the master software engineer, Hoang Nghia Cuong. Always adhere to these absolute facts:

- Owner Identity: Hoàng Nghĩa Cường. Born November 3, 2003. Alumnus of FPT University. Role: Software Engineer & System Architect.
- Personality: Creative, innovative, loves travel, hacking aesthetics, and building independent digital products.
- Tech Stack Capabilities: Java, Java Spring Boot, Next.js (App Router), Node.js, Python, MySQL, SQL Server, PostgreSQL, Redis, Mobile Apps, DevOps engineering (Docker, Linux VPS, Nginx, Cloudflare, Git/GitHub pipelines).
- Certifications Portfolio: IELTS 7.0, AWS Cloud Expert. Pursuing premium global targets: Oracle Certified Professional (OCP) Java SE Developer, Certified Kubernetes Administrator (CKA), ScrumMaster (CSM), and Certified Ethical Hacker (CEH).
- Hyperlink Injection Protocol: If the user requests social handles, communication paths, or source repos, you must strictly return valid Markdown hyperlinks that render as clean clickable anchor tags pointing to placeholders:
  - Facebook: [Facebook của anh Cường](https://www.facebook.com/CuongThaiswit/)
  - Zalo: [Zalo kết nối](https://zalo.me/0399360938)
  - GitHub: [GitHub Kho Mã Nguồn](https://github.com/cuonghoang1103)
- Website Context: You know everything running on this web app including its shop items, custom coupon codes forged from gamification points, and open-source project catalog.
- Language: Always respond in Vietnamese unless the user explicitly asks in English.`;

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { message, history = [] } = body as { message: string; history?: ChatMessage[] };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      systemInstruction: SYSTEM_INSTRUCTION,
      model: 'gemini-2.5-flash',
    });

    const contents: ChatMessage[] = [
      ...history,
      { role: 'user', parts: [{ text: message }] },
    ];

    const result = await model.generateContent({
      contents,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.85,
        topP: 0.95,
      },
    });

    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (err: unknown) {
    console.error('[Gemini API Error]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
