import { readFile, stat } from "fs/promises";
import { resolve, join, extname } from "path";

const PORT = 3000;

// Get __dirname equivalent in ES modules
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const PUBLIC_DIR = join(__dirname, "public"); // Define the public folder

async function resolveFilePath(
  urlPathName: string
): Promise<{ content: string; contentType: string } | null> {
  let filePath;
  if (extname(urlPathName) === ".html") {
    filePath = join(PUBLIC_DIR, "html", urlPathName.replace(/^\/+/, ""));
  } else {
    filePath = join(PUBLIC_DIR, urlPathName.replace(/^\/+/, ""));
  }

  try {
    // Ensure file exists
    await stat(filePath);

    // Determine content type
    const ext = extname(filePath);

    const contentType = getContentType(ext);

    // Read and return file content
    const content = await readFile(filePath, "utf-8");
    return { content, contentType };
  } catch {
    return null;
  }
}

function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };
  return contentTypes[ext] || "application/octet-stream";
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Default to serving index.html
  if (url.pathname === "/") {
    url.pathname = "/index.html";
  }

  // Serve static files from the public folder
  const fileData = await resolveFilePath(url.pathname);
  if (fileData) {
    return new Response(fileData.content, {
      headers: { "Content-Type": fileData.contentType },
    });
  }

  return new Response("Not Found", { status: 404 });
}

// Start the Bun server
Bun.serve({
  port: PORT,
  fetch: handleRequest,
});

console.log(`⚡️ Server running at http://localhost:${PORT}`);
