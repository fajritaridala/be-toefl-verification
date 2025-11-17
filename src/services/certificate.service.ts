import { CertificateDataDto, ScoreOutputDto } from "../dtos";
import { NotFoundException } from "../exceptions";
import { pinataService } from "../integrations";
import { generateHash } from "../utils/hash";

export class CertificateService {
  async generateAndUploadCertificate(
    participantData: {
      fullName: string;
      email: string;
      nim: string;
    },
    scores: ScoreOutputDto,
    examDate: Date,
    testType: string,
  ): Promise<{ cid: string; hash: string }> {
    const certificateData: CertificateDataDto = {
      participant: participantData,
      scores,
      examDate: examDate.toISOString(),
      testType,
    };

    const cid = await pinataService.uploadCertificateData(certificateData, {
      isPublic: false,
    });

    // For public upload (commented):
    // const cid = await pinataService.uploadCertificateData(certificateData, {
    //   isPublic: true,
    // });

    const hash = generateHash({ cid });

    return { cid, hash };
  }

  async verifyCertificate(hash: string, cid: string): Promise<boolean> {
    const computedHash = generateHash({ cid });
    return computedHash === hash;
  }

  async getCertificateData(cid: string): Promise<CertificateDataDto> {
    try {
      return await pinataService.getCertificateData(cid);
    } catch (error) {
      throw new NotFoundException("Certificate", cid);
    }
  }
}

export const certificateService = new CertificateService();
