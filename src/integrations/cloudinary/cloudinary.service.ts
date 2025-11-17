import { cloudinaryClient } from "./cloudinary.client";

export class CloudinaryService {
  async uploadPaymentProof(
    file: Express.Multer.File,
    fullName: string,
  ): Promise<string> {
    const dataUrl = cloudinaryClient.fileToDataUrl(file);
    const filenameOverride = `bukti-pembayanan-${fullName}`;

    const result = await cloudinaryClient.uploadDataUrl(dataUrl, {
      folder: "TOEFL/bukti-pembayaran",
      filenameOverride,
      resourceType: "auto",
    });

    return result.url;
  }

  async uploadCertificate(
    file: Express.Multer.File,
    participantName: string,
  ): Promise<string> {
    const dataUrl = cloudinaryClient.fileToDataUrl(file);
    const filenameOverride = `certificate-${participantName}`;

    const result = await cloudinaryClient.uploadDataUrl(dataUrl, {
      folder: "TOEFL/certificates",
      filenameOverride,
      resourceType: "auto",
    });

    return result.url;
  }

  async deleteFile(url: string): Promise<void> {
    await cloudinaryClient.deleteByUrl(url);
  }
}

export const cloudinaryService = new CloudinaryService();
