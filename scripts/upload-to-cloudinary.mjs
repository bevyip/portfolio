import { v2 as cloudinary } from "cloudinary";
import { readdirSync, statSync } from "fs";
import { resolve, join, extname, basename } from "path";

cloudinary.config({
  cloud_name: "djldar8hj",
  api_key: "898776481785573",
  api_secret: "Px5WqPrAokYe_de5j2pBhyXhqC8",
});

const PUBLIC_DIR = resolve(process.cwd(), "public/projects");

async function uploadAll() {
  const folders = readdirSync(PUBLIC_DIR);
  for (const folder of folders) {
    const folderPath = join(PUBLIC_DIR, folder);
    if (!statSync(folderPath).isDirectory()) continue;
    const files = readdirSync(folderPath);
    for (const file of files) {
      const ext = extname(file).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".mp4"].includes(ext)) continue;
      const filePath = join(folderPath, file);
      const publicId = `projects/${folder}/${basename(file, ext)}`;
      const resourceType = ext === ".mp4" ? "video" : "image";
      console.log(`Uploading ${publicId}...`);
      await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
      });
      console.log(`  ✓ done`);
    }
  }
  console.log("\nAll done!");
}

uploadAll().catch(console.error);
