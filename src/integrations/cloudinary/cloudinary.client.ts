import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

export class CloudinaryClient {
  private static instance: CloudinaryClient;

  private constructor() {
    // Already configured in config/cloudinary.config.ts
  }

  public static getInstance(): CloudinaryClient {
    if (!CloudinaryClient.instance) {
      CloudinaryClient.instance = new CloudinaryClient();
    }
    return CloudinaryClient.instance;
  }

  async uploadDataUrl(
    dataUrl: string,
    options?: {
      folder?: string;
      filenameOverride?: string;
      resourceType?: "image" | "video" | "raw" | "auto";
    },
  ): Promise<UploadApiResponse> {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: options?.folder || "certificates",
      filename_override: options?.filenameOverride,
      resource_type: options?.resourceType || "auto",
    });

    return result;
  }

  async uploadBuffer(
    buffer: Buffer,
    options?: {
      folder?: string;
      filenameOverride?: string;
      resourceType?: "image" | "video" | "raw" | "auto";
    },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || "certificates",
          filename_override: options?.filenameOverride,
          resource_type: options?.resourceType || "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        },
      );

      uploadStream.end(buffer);
    });
  }

  async deleteByUrl(url: string): Promise<void> {
    const publicId = this.extractPublicId(url);
    await cloudinary.uploader.destroy(publicId);
  }

  async deleteByPublicId(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  private extractPublicId(url: string): string {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  }

  fileToDataUrl(file: Express.Multer.File): string {
    const b64 = Buffer.from(file.buffer).toString("base64");
    return `data:${file.mimetype};base64,${b64}`;
  }

  getPublicIdFromUrl(fileUrl: string): string {
    const fileNameUsingSubstring = fileUrl.substring(
      fileUrl.lastIndexOf("/") + 1,
    );
    const publicID = fileNameUsingSubstring.substring(
      0,
      fileNameUsingSubstring.lastIndexOf("."),
    );
    return publicID;
  }
}

export const cloudinaryClient = CloudinaryClient.getInstance();
