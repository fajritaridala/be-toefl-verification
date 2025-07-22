interface IUser {
  address: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface IPeserta extends IUser {
  hash_toefl: string;
  cid_certificate: string;
  isActivated: boolean;
}

export { IUser, IPeserta };
