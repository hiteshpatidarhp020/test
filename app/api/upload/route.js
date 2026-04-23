import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();
    const files = data.getAll("files");

    if (!files || files.length === 0) {
      return Response.json({ error: "No files uploaded" }, { status: 400 });
    }

    const urls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = Date.now() + "-" + file.name;
      const filePath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(filePath, buffer);

      urls.push("/uploads/" + filename);
    }

    return Response.json({ urls });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}