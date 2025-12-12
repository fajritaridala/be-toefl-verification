import type { FilterDto } from "../../common/dtos/query.dto";
import { ROLES } from "../../common/utils/constants";
import time from "../../common/utils/time";
import ScheduleModel from "./models/schedule.model";
import {
  CreateScheduleDto,
  ScheduleOptionsDto,
  ScheduleParamsDto,
  UpdateScheduleDto,
} from "./schedule.dto";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

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
  findAll: async (query: ScheduleOptionsDto) => {
    const { user, ...params } = query;
    const skip = (params.page - 1) * params.limit;
    
    let minDate: Date | undefined;
    
    // Jika user tidak ada ATAU bukan admin, terapkan batasan H+7
    if (!user || user.role !== ROLES.ADMIN) {
      // Logic: Hari ini (WITA) + 7 hari, ambil awal hari (00:00)
      minDate = dayjs().tz("Asia/Makassar").add(7, "day").startOf("day").toDate();
    }

    const options = { skip, minDate, ...params };
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
  update: async (params: ScheduleParamsDto, body: UpdateScheduleDto) => {
    const data = await ScheduleModel.findByIdAndUpdate(
      {
        _id: params.scheduleId,
      },
      { $set: body },
      { new: true },
    );
    return data;
  },
  remove: async (params: ScheduleParamsDto) => {
    const data = await ScheduleModel.findByIdAndDelete({
      _id: params.scheduleId,
    });
    return data;
  },
};

export default scheduleService;
