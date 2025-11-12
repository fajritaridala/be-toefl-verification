import { Types } from "mongoose";

// service interface
interface IService {
  name: string;
  description: string;
  price: number;
  duration: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IServiceSchedule {
  service_id: Types.ObjectId;
  schedule_date: Date;
  quota?: number;
  registrants?: IRegistrant[];
}

interface IRegistrant {
  register_date: Date;
  payment_receipt: string;
  payment_date: Date;
  status: string;
  peserta_id: Types.ObjectId;
  approved?: {
    by: string;
    date: Date;
  };
}



export { IService, IServiceSchedule };
