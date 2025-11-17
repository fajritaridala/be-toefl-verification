// kontrol akses user
enum ROLES {
  PESERTA = "peserta",
  ADMIN = "admin",
}

// jaringan pinata
enum PINATA {
  PRIVATE = "private",
  PUBLIC = "public",
}

enum STATUS {
  SELESAI = "selesai",
  BELUM_SELESAI = "belum selesai",
}

enum STATUS_KETERSEDIAAN {
  TERSEDIA = "tersedia",
  TIDAK_TERSEDIA = "tidak tersedia",
}

enum JENIS_KELAMIN {
  LAKI_LAKI = "laki-laki",
  PEREMPUAN = "perempuan",
}

enum STATUS_PENDAFTARAN {
  BELUM_DIVERIFIKASI = "belum diverifikasi",
  DIVERIFIKASI = "diverifikasi",
}

enum REGISTER_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export {
  ROLES,
  PINATA,
  STATUS,
  STATUS_KETERSEDIAAN,
  JENIS_KELAMIN,
  STATUS_PENDAFTARAN,
  REGISTER_STATUS,
};
