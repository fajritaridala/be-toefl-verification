enum ROLES {
  PESERTA = "peserta",
  ADMIN = "admin",
}

enum STATUS {
  ACTIVE = "aktif",
  INACTIVE = "tidak aktif",
}

enum ENROLLED_STATUS {
  PENDING = "menunggu",
  APPROVED = "disetujui",
  REJECTED = "ditolak",
}

enum GENDER {
  MALE = "laki-laki",
  FEMALE = "perempuan",
}

export { ENROLLED_STATUS, GENDER, ROLES, STATUS };
