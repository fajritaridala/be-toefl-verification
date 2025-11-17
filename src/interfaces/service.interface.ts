interface IService {
  name: string;
  description: string;
  price: number;
  duration: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export { IService };
