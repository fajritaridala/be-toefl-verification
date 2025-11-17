import { v2 as cloudinary } from "cloudinary";
import { PinataSDK } from "pinata";
import { toDataURL } from "../config/cloudinary.config";
import { PINATA_GATEAWAY, PINATA_GROUP_PRIVATE, PINATA_JWT } from "./env";

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEAWAY,
});

export default {
  async uploadCertificate(file: Express.Multer.File) {
    try {
      const filePinata = new File([file.buffer], file.originalname, {
        type: file.mimetype,
      });
      const uploadPrivate = await pinata.upload.private
        .file(filePinata)
        .group(PINATA_GROUP_PRIVATE);

      // const uploadPublic = await pinata.upload.public.file(filePinata);

      const result = {
        cid: uploadPrivate.cid,
        url: `https://${PINATA_GATEAWAY}/ipfs/${uploadPrivate.cid}`,
        size: uploadPrivate.size,
      };
      return result;
    } catch (error) {
      const err = error as unknown as Error;
      throw new Error(`pinata upload failed: ${err.message}`);
    }
  },
  async uploadImage(file: Express.Multer.File, fullName: string) {
    const fileDataUrl = toDataURL(file);
    const filename_override = `bukti-pembayanan-${fullName}`;
    const image = await cloudinary.uploader.upload(fileDataUrl, {
      folder: "TOEFL/bukti-pembayaran",
      filename_override,
      resource_type: "auto",
    });
    const result = image.url;
    return result;
  },
};
