import { Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { DataPendaftaran } from "../../interfaces/auth.interface";
import { IPaginationQuery, IReqUser } from "../../interfaces/auth.interface";
import { ScheduleResult } from "../../interfaces/result.interface";
import {
  ISchedule,
  ScheduleQueryOptions,
} from "../../interfaces/schedule.interface";
import { IServiceSchedule } from "../../interfaces/toefl.interface";
import { ScheduleModel } from "../../models/toefl/schedule.model";
import { PesertaModel } from "../../models/user.model";
import { ROLES } from "../../utils/constants";
import time from "../../utils/date";
import response from "../../utils/response";
import uploader from "../../utils/uploader";
import {
  scheduleValidation,
  serviceValidation,
} from "../../validates/toefl.validate";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const body = await scheduleValidation.create.validate(req.body);
      const _schedule_date = time.stringToDate(body.schedule_date);

      const data = {
        service_id: body.service_id,
        schedule_date: _schedule_date,
      } as unknown as ISchedule;
      if (body.quota) {
        data.quota = body.quota;
      }

      const save = await ScheduleModel.create(data);
      const result = {
        _id: save._id,
        service_id: save.service_id,
        schedule_date: save.schedule_date,
        quota: save.quota,
        registrants: save.registrants,
        is_full: save.is_full,
      };
      response.success(res, result, "Jadwal berhasil dibuat");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async findAllSchedule(req: IReqUser, res: Response) {
    const user = req.user;
    const { page, limit, search, service_id } =
      req.query as unknown as IPaginationQuery;
    const options: ScheduleQueryOptions = {};

    try {
      if (service_id) {
        await scheduleValidation.findAll.validate({ service_id });
        const _service_id = isValidObjectId(service_id)
          ? new mongoose.Types.ObjectId(service_id)
          : undefined;
        options.service_id = _service_id;
      }
      if (user?.role === ROLES.ADMIN) {
        const skip = (page - 1) * limit;
        options.skip = skip;
        options.limit = limit;
        if (search) {
          options.search = search;
        }
      }

      const result =
        user?.role === ROLES.ADMIN
          ? await ScheduleModel.getSchedule(options)
          : await ScheduleModel.getScheduleRegister(options);

      response.success(res, result, "Jadwal berhasil ditemukan");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async findParticipantsByScheduleId(req: IReqUser, res: Response) {
    const { id } = req.params;
    try {
      await scheduleValidation.findAll.validate({ id });
      // const participants = await ScheduleModel.findById(id)
      const participants = await ScheduleModel.getAllParticipants(id);
      response.success(res, participants, "Peserta berhasil ditemukan");
    } catch (error) {}
  },
  async register(req: IReqUser, res: Response) {
    const register_date = Date.now();
    const { id } = req.params;
    const participant_id = req?.user?._id as unknown as string;
    const file = req.file as Express.Multer.File;
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
      const _birth_date = time.stringToDate(birth_date);
      // const payment_receipt = await uploader.uploadImage(file, fullName);
      const payment_receipt = "https://example.com/payment-receipt.jpg";
      const registration_data: DataPendaftaran = {
        fullName,
        gender,
        birth_date: _birth_date,
        phone_number,
        NIM,
        faculty,
        major,
      };

      await PesertaModel.findByIdAndUpdate(participant_id, {
        $set: {
          registration_data: {
            ...registration_data,
            register_date,
          },
        },
        new: true,
      }).exec();

      const schedule = await ScheduleModel.findById(id).lean();

      if (!schedule) return response.error(res, null, "Jadwal tidak ditemukan");

      const now = new Date();
      const minDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
      );
      minDate.setUTCDate(minDate.getUTCDate() + 7);

      if (schedule.schedule_date < minDate) {
        return response.error(
          res,
          null,
          "Pendaftaran hanya tersedia untuk jadwal minimal 7 hari ke depan",
        );
      }

      if (schedule.is_full) {
        return response.error(res, null, "Jadwal ini sudah penuh");
      }

      const registrants = {
        register_date,
        payment_receipt,
        payment_date,
        participant_id,
      };

      const result = await ScheduleModel.findByIdAndUpdate(
        id,
        {
          $push: {
            registrants: registrants,
          },
        },
        {
          new: true,
        },
      ).exec();

      response.success(res, result, "Registrasi Berhasil");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
};
