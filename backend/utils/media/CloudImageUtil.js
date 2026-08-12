import crypto from "node:crypto";

export class CloudImageUtil {
  static configured() { return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET); }
  static async upload(file, folder = "markgenexes/case-studies") {
    if (!this.configured()) throw new Error("Cloud image storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`).digest("hex");
    const form = new FormData();
    form.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
    form.append("api_key", process.env.CLOUDINARY_API_KEY);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Cloud image upload failed");
    return { url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height };
  }
}
