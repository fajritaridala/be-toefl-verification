type TLogin = {
  address: string;
};

type TRegister = {
  address: string;
  fullName: string;
  email: string;
  roleToken?: string;
};

type TPesertaModelStatics = {
  getAllParticipant: () => Promise<
    Array<{
      address: string;
      fullName: string;
      email: string;
      isActivated: boolean;
    }>
  >;
  getProcessedParticipant: () => Promise<
    Array<{
      address: string;
      fullName: string;
      email: string;
      createdAt: Date;
    }>
  >;
  getUnprocessedParticipants: () => Promise<
    Array<{
      address: string;
      fullName: string;
      email: string;
      createdAt: Date;
    }>
  >;
  getOverview: () => Promise<TOverview>;
};

type TOverview = {
  statistics: {
    participants: number;
    activatedParticipant: number;
    notActivatedParticipant: number;
  };
  latestNotActivatedParticipant: Array<{
    address: string;
    fullname: string;
    email: string;
    createdAt: Date;
  }>;
};

export { TRegister, TLogin, TPesertaModelStatics, TOverview };
