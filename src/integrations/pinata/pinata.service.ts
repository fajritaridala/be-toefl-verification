import { CertificateDataDto } from "../../dtos";
import { pinataClient } from "./pinata.client";

export class PinataService {
  async uploadCertificateFile(
    file: Express.Multer.File,
    options?: { isPublic?: boolean },
  ): Promise<{ cid: string; url: string; size: number }> {
    const result = await pinataClient.uploadFile(file, {
      isPublic: options?.isPublic || false,
    });

    return {
      cid: result.cid,
      url: pinataClient.getGatewayUrl(result.cid),
      size: result.size,
    };
  }

  async uploadCertificateData(
    certificateData: CertificateDataDto,
    options?: { isPublic?: boolean },
  ): Promise<string> {
    const cid = await pinataClient.uploadJson(
      certificateData as unknown as Record<string, unknown>,
      {
        isPublic: options?.isPublic || false,
      },
    );

    return cid;
  }

  async getCertificateData(cid: string): Promise<CertificateDataDto> {
    const data = await pinataClient.getJson(cid);
    return data as CertificateDataDto;
  }

  getCertificateUrl(cid: string): string {
    return pinataClient.getGatewayUrl(cid);
  }
}

export const pinataService = new PinataService();
