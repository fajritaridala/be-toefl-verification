export interface ScoreInputParamsDto {
  scheduleId: string;
  participantId: string;
}

export interface ScoreInputBodyDto {
  listening: number;
  reading: number;
  writing: number;
}

export interface ScoreOutputDto {
  listening: number;
  reading: number;
  writing: number;
  total: number;
}

export interface CertificateDataDto {
  participant: {
    fullName: string;
    email: string;
    nim: string;
  };
  scores: ScoreOutputDto;
  examDate: string;
  testType: string;
}

export interface ScoreInputResponseDto {
  hash: string;
  certificateData: CertificateDataDto;
}
