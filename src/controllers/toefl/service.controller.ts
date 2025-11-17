import { Response } from "express";
import { Types } from "mongoose";
import { IPaginationQuery, IReqUser } from "../../interfaces/auth.interface";
import { IService } from "../../interfaces/toefl.interface";
import { ServiceModel } from "../../models/toefl/service.model";
import response from "../../utils/response";
import { serviceValidation } from "../../validates/toefl.validate";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const body = await serviceValidation.create.validate(req.body);
      const data = await ServiceModel.create(body);
      const result = {
        _id: data._id,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
      } as IService;
      if (data.notes) {
        result.notes = data.notes;
      }
      response.success(res, result, "Layanan berhasil dibuat");
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
        Object.assign(query, { name: { $regex: search, $options: "i" } });
      }

      const data = await ServiceModel.find(query)
        .select("-__v -createdAt -updatedAt")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ created_at: -1 })
        .exec();

      response.success(res, data, "Layanan berhasil ditemukan");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params as unknown as Types.ObjectId;
      const update = await serviceValidation.update.validate(req.body);
      const result = await ServiceModel.findOneAndUpdate(
        { _id: id },
        {
          $set: update,
        },
        { new: true },
      ).select("-__v -createdAt -updatedAt");
      response.success(res, result, "Layanan berhasil diupdate");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params as unknown as Types.ObjectId;
      const result = await ServiceModel.findOneAndDelete({ _id: id }).select(
        "-__v -createdAt -updatedAt",
      );
      response.success(res, result, "Layanan berhasil dihapus");
    } catch (err) {
      const error = err as Error;
      response.error(res, error, error.message);
    }
  },
};
