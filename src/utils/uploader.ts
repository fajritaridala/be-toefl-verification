import { PinataSDK } from 'pinata';
import { PINATA_GATEAWAY_BASE, PINATA_GROUP, PINATA_JWT } from './env';

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEAWAY_BASE,
});

export default {
  async uploadCertificate(file: Express.Multer.File) {
    try {
      const upload = await pinata.upload.private
        .file(
          new File([file.buffer], file.originalname, { type: file.mimetype })
        )
        .group(PINATA_GROUP);

      const result = {
        cid: upload.cid,
        url: `https://${PINATA_GATEAWAY_BASE}/ipfs/${upload.cid}`,
        size: upload.size,
      };
      return result;
    } catch (error) {
      const err = error as unknown as Error;
      throw new Error(`pinata upload failed: ${err.message}`);
    }
  },
};
