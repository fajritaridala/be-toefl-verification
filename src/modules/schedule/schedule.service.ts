import type { FilterDto } from "../../common/dtos/query.dto";
import time from "../../common/utils/time";
import ScheduleModel from "./models/schedule.model";
import {
  CreateScheduleDto,
  ScheduleParamsDto,
  UpdateScheduleDto,
} from "./schedule.dto";

const scheduleService = {
  create: async (query: FilterDto, body: CreateScheduleDto) => {
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
  findAll: async (query: FilterDto) => {
    const skip = (query.page - 1) * query.limit;
    const options = { skip, ...query };
    const result = await ScheduleModel.findAll(options);
    return result;
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
