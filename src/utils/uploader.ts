import { PinataSDK } from 'pinata';
import { PINATA_GATEAWAY, PINATA_GROUP_PRIVATE, PINATA_JWT } from './env';

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
};
