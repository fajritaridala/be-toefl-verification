import { Response } from "express";
import { Types } from "mongoose";
import { DataPendaftaran } from "../../interfaces/auth.interface";
import {
  IPaginationQuery,
  IReqUser,
  IUserToken,
} from "../../interfaces/auth.interface";
import { IServiceSchedule } from "../../interfaces/toefl.interface";
import { ScheduleModel } from "../../models/toefl/schedule.model";
import { convertToDate } from "../../utils/date";
import response from "../../utils/response";
import uploader from "../../utils/uploader";
import {
  scheduleValidation,
  serviceValidation,
} from "../../validates/toefl.validate";

export default {
  async create(req: IReqUser, res: Response) {
    const { service_id } = req.params as unknown as {
      service_id: Types.ObjectId;
    };
    req.body.service_id = service_id;
    try {
      const body = await scheduleValidation.create.validate(req.body);
      const _schedule_date = convertToDate(body.schedule_date);

      const data = {
        service_id: body.service_id,
        schedule_date: _schedule_date,
      } as unknown as IServiceSchedule;
      if (body.quota) {
        data.quota = body.quota;
      }

      const result = await ScheduleModel.create(data);
      response.success(res, result, "Jadwal berhasil dibuat");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async findAll(req: IReqUser, res: Response) {
    const { page, limit, search } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};
      if (search) {
        Object.assign(query, {
          schedule_date: { $regex: search, $options: "i" },
        });
      }

      const result = await ScheduleModel.find(query)
        .populate({
          path: "service_id",
          select: "name price",
        })
        .select("-__v -createdAt -updatedAt")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      response.success(res, result, "Jadwal berhasil ditemukan");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async findAllByService(req: IReqUser, res: Response) {
    const { service_id } = req.params as unknown as {
      service_id: Types.ObjectId;
    };
    try {
      const result = await ScheduleModel.find({ service_id })
        .select("_id schedule_date quota")
        .exec();

      response.success(res, result, "Jadwal berhasil ditemukan");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async register(req: IReqUser, res: Response) {
    const { id } = req.params;
    const participant_id = req?.user?._id as unknown as IUserToken;
    const file = req.file as Express.Multer.File;
    console.log(file);
    const {
      fullName,
      gender,
      birth_date,
      phone_number,
      NIM,
      faculty,
      major,
      payment_date,
    } = await serviceValidation.register.validate(req.body);
    try {
      const _birth_date = convertToDate(birth_date);
      const payment_receipt = await uploader.uploadImage(file, fullName);
      const registration_data: DataPendaftaran = {
        fullName,
        gender,
        birth_date: _birth_date,
        phone_number,
        NIM,
        faculty,
        major,
      };
      
      const participant = await 
      
      
    } catch (err) {}
  },
};
