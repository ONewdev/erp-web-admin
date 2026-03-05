import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const backendUrl = process.env.API_URL || "http://localhost:8000/backend";
    const targetUrl = `${backendUrl}/auth.php`;

    console.log("[/api/auth] Proxying to:", targetUrl);

    try {
        const body = await request.json();

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const text = await response.text();
        console.log("[/api/auth] Backend response:", text);

        try {
            const data = JSON.parse(text);
            return NextResponse.json(data);
        } catch {
            console.error("[/api/auth] Backend did not return valid JSON:", text);
            return NextResponse.json(
                { success: false, message: "Backend error: " + text.substring(0, 200) },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("[/api/auth] Fetch failed:", error);
        return NextResponse.json(
            { success: false, message: "Cannot connect to backend server at " + targetUrl },
            { status: 500 }
        );
    }
}
