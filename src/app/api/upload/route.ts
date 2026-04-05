import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}");
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
}

export async function POST(request: NextRequest) {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      return NextResponse.json(
        { error: "Google Drive not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    const results = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `wedding-${timestamp}-${file.name}`;

      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: file.type,
          body: stream,
        },
        fields: "id,name",
      });

      results.push({ id: response.data.id, name: response.data.name });
    }

    return NextResponse.json({
      message: `${results.length} file(s) uploaded successfully`,
      files: results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
