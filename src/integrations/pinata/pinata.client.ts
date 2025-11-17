import { PinataSDK } from "pinata";
import {
  PINATA_GATEAWAY,
  PINATA_GROUP_PRIVATE,
  PINATA_JWT,
} from "../../utils/env";

export class PinataClient {
  private static instance: PinataClient;
  private pinata: PinataSDK;

  private constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: PINATA_JWT,
      pinataGateway: PINATA_GATEAWAY,
    });
  }

  public static getInstance(): PinataClient {
    if (!PinataClient.instance) {
      PinataClient.instance = new PinataClient();
    }
    return PinataClient.instance;
  }

  async uploadFile(
    file: Express.Multer.File,
    options?: {
      isPublic?: boolean;
      groupId?: string;
    },
  ): Promise<{ cid: string; size: number }> {
    try {
      const filePinata = new File([file.buffer], file.originalname, {
        type: file.mimetype,
      });

      const groupId = options?.groupId || PINATA_GROUP_PRIVATE;

      let upload;
      if (options?.isPublic) {
        upload = await this.pinata.upload.public.file(filePinata);
      } else {
        upload = await this.pinata.upload.private
          .file(filePinata)
          .group(groupId);
      }

      return {
        cid: upload.cid,
        size: upload.size,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Pinata file upload failed: ${err.message}`);
    }
  }

  async uploadJson(
    data: Record<string, unknown>,
    options?: {
      isPublic?: boolean;
      groupId?: string;
    },
  ): Promise<string> {
    try {
      const groupId = options?.groupId || PINATA_GROUP_PRIVATE;

      let upload;
      if (options?.isPublic) {
        upload = await this.pinata.upload.public.json(data);
      } else {
        upload = await this.pinata.upload.private.json(data).group(groupId);
      }

      return upload.cid;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Pinata JSON upload failed: ${err.message}`);
    }
  }

  async getJson(cid: string): Promise<unknown> {
    try {
      // Note: Pinata SDK may not have direct get method,
      // typically you'd fetch from gateway URL
      const url = this.getGatewayUrl(cid);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      const err = error as Error;
      throw new Error(`Pinata fetch failed: ${err.message}`);
    }
  }

  getGatewayUrl(cid: string): string {
    return `https://${PINATA_GATEAWAY}/ipfs/${cid}`;
  }
}

export const pinataClient = PinataClient.getInstance();
