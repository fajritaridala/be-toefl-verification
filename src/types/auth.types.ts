type TLogin = {
  address: string;
};

type TRegister = {
  address: string;
  fullName: string;
  email: string;
  roleToken?: string;
};


export { TRegister, TLogin };
