export enum STATUS {
  SELESAI = "selesai",
  BELUM_SELESAI = "belum selesai",
}

export enum STATUS_KETERSEDIAAN {
  TERSEDIA = "tersedia",
  TIDAK_TERSEDIA = "tidak tersedia",
}

export enum STATUS_PENDAFTARAN {
  BELUM_DIVERIFIKASI = "belum diverifikasi",
  DIVERIFIKASI = "diverifikasi",
}

export enum REGISTER_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type RegistrationStatus =
  (typeof REGISTER_STATUS)[keyof typeof REGISTER_STATUS];
