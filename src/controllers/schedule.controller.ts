import { Response } from "express";
import mongoose, { FilterQuery, isValidObjectId } from "mongoose";
import { ConflictException } from "../exceptions";
import {
  DataPendaftaran,
  IPaginationQuery,
  IReqUser,
  IUserToken,
} from "../interfaces/auth.interface";
import {
  ISchedule,
  ScheduleQueryOptions,
} from "../interfaces/schedule.interface";
import { ScheduleModel } from "../models/schedule.model";
import { PesertaModel } from "../models/user.model";
import { registrantService } from "../services";
import { ROLES } from "../utils/constants";
import time from "../utils/date";
import { getUserData } from "../utils/jwt";
import response from "../utils/response";
import {
  scheduleValidation,
  serviceValidation,
} from "../validates/schedule.validate";

export default {
  async createSchedule(req: IReqUser, res: Response) {
    try {
      const body = await scheduleValidation.create.validate(req.body);
      const scheduleDate = new Date(time.stringToDate(body.schedule_date));

      const isDuplicate = await ScheduleModel.exists({
        service_id: body.service_id,
        schedule_date: scheduleDate,
      });

      if (isDuplicate) {
        throw new ConflictException(
          "Jadwal dengan layanan dan tanggal tersebut sudah ada",
          {
            serviceId: body.service_id,
            scheduleDate: scheduleDate.toISOString(),
          },
        );
      }

      const data: Partial<ISchedule> = {
        service_id: body.service_id as unknown as mongoose.Types.ObjectId,
        schedule_date: scheduleDate,
      };

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
  async listSchedules(req: IReqUser, res: Response) {
    const user = req.user;
    const {
      service_id,
      page = 1,
      limit = 10,
      month,
    } = req.query as unknown as ScheduleQueryOptions;
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
        options.page = page;
        options.skip = skip;
        options.limit = limit;
        options.role = user.role;
        if (month) {
          options.month = Number(month);
        }

        const schedules = await ScheduleModel.getSchedule(options);
        return response.pagination({
          res,
          data: schedules[0].data,
          pagination: {
            current: schedules[0].pagination.current,
            total: schedules[0].pagination.total,
            totalPages: schedules[0].pagination.totalPages,
          },
          message: "Jadwal berhasil ditemukan",
        });
      }

      if (!service_id) {
        const error = new Error("Harus menyertakan ID layanan");
        return response.error(res, error, error.message);
      }

      const now = new Date();
      const minDate = new Date(now);
      minDate.setHours(0, 0, 0, 0);
      minDate.setDate(minDate.getDate() + 4);
      options.minDate = minDate;

      const schedules = await ScheduleModel.getSchedule(options);
      response.success(res, schedules, "berhasil");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async updateParticipantScore(req: IReqUser, res: Response) {
    try {
      const { scheduleId, participantId } =
        await scheduleValidation.scoreParams.validate(req.params);
      const { listening, reading, writing } =
        await scheduleValidation.scoreInput.validate(req.body);

      const result = await registrantService.inputScores(
        scheduleId,
        participantId,
        { listening, reading, writing },
      );

      response.success(res, result, "Nilai berhasil disimpan");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async listScheduleParticipants(req: IReqUser, res: Response) {
    const { scheduleId } = req.params as { scheduleId: string };
    try {
      const query = await scheduleValidation.participants.validate(req.query);
      const participants = await registrantService.getScheduleParticipants(
        scheduleId,
        query,
      );
      response.pagination({
        res,
        data: participants.data,
        pagination: {
          current: participants.meta.page,
          totalPages: participants.meta.totalPages,
          total: participants.meta.total,
        },
        message: "Peserta berhasil ditemukan",
      });
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async registerParticipant(req: IReqUser, res: Response) {
    const register_date = Date.now();
    const { scheduleId } = req.params as { scheduleId: string };
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

      const participantRecord = await PesertaModel.findByIdAndUpdate(
        participant_id,
        {
          $set: {
            registration_data: {
              ...registration_data,
              register_date,
            },
          },
        },
        { new: true },
      )
        .select("email")
        .lean();

      const schedule = await ScheduleModel.findById(scheduleId).lean();

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

      const participantProfile = {
        fullName,
        gender,
        birthDate: _birth_date,
        phoneNumber: phone_number,
        nim: NIM,
        faculty,
        major,
        email: participantRecord?.email ?? undefined,
      };

      const registrants = {
        register_date,
        payment_receipt,
        payment_date,
        participant_id,
        participantProfile,
      };

      const result = await ScheduleModel.findByIdAndUpdate(
        scheduleId,
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
