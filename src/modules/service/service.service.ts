import type { ParamsDto, QueryDto } from "../../common/dtos/query.dto";
import type { CreateServiceDto, UpdateServiceDto } from "./service.dto";
import ServiceModel from "./service.model";

const serviceService = {
  findAll: async (query: QueryDto) => {
    const data = await ServiceModel.find()
      .select("-__v -createdAt -updatedAt")
      .limit(query.limit)
      .skip((query.page - 1) * query.limit)
      .sort({ createdAt: -1 })
      .exec();
    return data;
  },
  create: async (body: CreateServiceDto) => {
    const data = await ServiceModel.create(body);
    const result = {
      _id: data._id,
      name: data.name,
      description: data.description,
      price: data.price,
    };
    if (data.price) result.price = data.price;
    return result;
  },
  update: async (params: ParamsDto, body: UpdateServiceDto) => {
    const data = await ServiceModel.findByIdAndUpdate(
      {
        _id: params.serviceId,
      },
      { $set: body },
      { new: true },
    ).select("-__v -createdAt -updatedAt");
    return data;
  },
  remove: async (params: ParamsDto) => {
    const data = await ServiceModel.findByIdAndDelete({
      _id: params.serviceId,
    });
    return data;
  },
};

export default serviceService;
