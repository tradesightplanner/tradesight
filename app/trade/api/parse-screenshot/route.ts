// app/trade/api/parse-screenshot/route.ts
import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as Blob | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data } = await Tesseract.recognize(buffer, "eng");
    const text = data.text || "";

    const tickerMatch = text.match(/\b[A-Z]{1,6}(?:\:[A-Z]{1,6})?\b/);
    const numberMatches = text.match(/\d{1,6}(?:[.,]\d+)?/g) || [];
    const sideMatch = text.match(/\b(long|short)\b/i);
    const timeframeMatch = text.match(/\b(1m|5m|15m|30m|1H|4H|1D|1W)\b/i);

    const nums = numberMatches.map(s => Number(s.replace(/,/g, "")));
    const entry = nums.length > 0 ? nums[0] : null;
    const exit = nums.length > 1 ? nums[1] : null;
    const stop_loss = nums.length > 2 ? nums[2] : null;

    const parsed = {
      text,
      ticker: tickerMatch ? tickerMatch[0] : null,
      side: sideMatch ? sideMatch[0].toLowerCase() : null,
      timeframe: timeframeMatch ? timeframeMatch[0] : null,
      entry,
      exit,
      stop_loss
    };

    return NextResponse.json({ parsed });
  } catch (err) {
    console.error("OCR parse error:", err);
    return NextResponse.json({ error: "Failed to parse" }, { status: 500 });
  }
}
