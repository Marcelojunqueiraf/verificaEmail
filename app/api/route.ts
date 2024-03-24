// api > hello > route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const range = "cadastros!A2:E2";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: range,
  });
  if (response.status !== 200) {
    return NextResponse.error();
  }

  if (!response.data.values) {
    return NextResponse.error();
  }

  return NextResponse.json(response.data.values);
}
