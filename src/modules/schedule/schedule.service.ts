import type { FilterDto } from "../../common/dtos/query.dto";
import time from "../../common/utils/time";
import ScheduleModel from "./models/schedule.model";
import {
  CreateScheduleDto,
  ScheduleAdminQueryDto,
  ScheduleParamsDto,
  UpdateScheduleDto,
} from "./schedule.dto";

const scheduleService = {
  create: async (query: FilterDto, body: CreateScheduleDto) => {
    // Menggunakan default timezone (Asia/Makassar) dari utils/time.ts
    const scheduleDate = time.parseDate(body.scheduleDate);
    
    const startTime = time.applyTime({
      date: body.scheduleDate,
      hour: body.startTime,
    });
    
    const endTime = time.applyTime({
      date: body.scheduleDate,
      hour: body.endTime,
    });

    const capacity = body.capacity || 100;

    const data = {
      serviceId: query.serviceId,
      scheduleDate,
      startTime,
      endTime,
      capacity: body.capacity || capacity,
      quota: body.capacity || capacity,
    } as unknown as CreateScheduleDto;
    const doc = await ScheduleModel.create(data);
    const result = doc.toObject({
      transform: (doc, ret) => {
        const { __v, ...rest } = ret;
        return rest;
      },
    });
    return result;
  },
  findAllPublic: async (query: FilterDto) => {
    const { page, limit, ...params } = query;
    const skip = (page - 1) * limit;
    const minDate = time.minDate(7);

    const options = { skip, limit, minDate, excludeDeleted: true, ...params };
    const { data, pagination } = await ScheduleModel.findAll(options);
    
    const result = data.map((item) => {
      return {
        scheduleId: item.scheduleId,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        scheduleDate: item.scheduleDate,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        capacity: item.capacity,
        quota: item.quota,
        registrants: item.registrants,
      };
    });

    return { data: result, pagination };
  },
  findAllAdmin: async (query: ScheduleAdminQueryDto) => {
    const { page, limit, includeDeleted, ...params } = query;
    const skip = (page - 1) * limit;

    const options = { skip, limit, includeDeleted, ...params };
    const { data, pagination } = await ScheduleModel.findAll(options);
    
    const result = data.map((item) => {
      return {
        scheduleId: item.scheduleId,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        scheduleDate: item.scheduleDate,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        capacity: item.capacity,
        quota: item.quota,
        registrants: item.registrants,
        deletedAt: item.deletedAt,
      };
    });

    return { data: result, pagination };
  },
  update: async (params: ScheduleParamsDto, body: UpdateScheduleDto) => {
    const data = await ScheduleModel.findOneAndUpdate(
      {
        _id: params.scheduleId,
        deletedAt: null,
      },
      { $set: body },
      { new: true },
    );
    if (!data) throw new Error("Jadwal tidak ditemukan atau sudah dihapus");
    return data;
  },
  remove: async (params: ScheduleParamsDto) => {
    const data = await ScheduleModel.findByIdAndUpdate({
      _id: params.scheduleId
    }, {
      $set: {
        deletedAt: new Date()
      }
    }, {
      new: true
    })
    return data;
  },
};

export default scheduleService;
