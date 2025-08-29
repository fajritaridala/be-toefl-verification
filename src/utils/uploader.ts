import axios from "axios";
import FormData from "form-data";
import { PINATA_GATEAWAY_BASE, PINATA_JWT, PINATA_URL } from "./env";
import { PINATA } from "./constant";

export type TPinataResult = {
  cidFile: string;
  url: string;
};

export default {
  async uploadToPdf(
    fileBuffer: Buffer,
    fileName: string,
    metadata: Record<string, any> = {},
    network: string = PINATA.PRIVATE
  ): Promise<TPinataResult> {
    if (!PINATA_JWT) {
      throw new Error("pinata jwt not found");
    }

    const form = new FormData();
    form.append("file", fileBuffer, { filename: fileName });
    form.append("network", network);

    const pinataMetadata: any = { name: fileName, keyvalues: metadata };
    form.append("pinataMetadata", JSON.stringify(pinataMetadata));

    const request = await axios.post(PINATA_URL, form, {
      headers: { Authorization: `Bearer ${PINATA_JWT}`, ...form.getHeaders() },
      maxBodyLength: Infinity,
    });
    const cidFile = request?.data?.IpfsHash;
    if (!cidFile) {
      throw new Error("failed upload to pinata (IpfsHash not found)");
    }

    return {
      cidFile,
      url: `${PINATA_GATEAWAY_BASE}/${cidFile}`,
    };
  },
};
