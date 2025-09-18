import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import { toeflValidateSchema } from '../utils/validates';
import { ToeflModel } from '../models/toefl.model';
import { STATUS } from '../utils/constant';

type TRegister = {
  fullName: string;
  email: string;
  nim: string;
  major: string;
  sessionTest: string;
};

export default {
  async register(req: IReqUser, res: Response) {
    try {
      const { address } = req.params;
      const { fullName, email, nim, major, sessionTest } =
        req.body as unknown as TRegister;

      const data = {
        address,
        fullName,
        email,
        nim,
        major,
        sessionTest,
        testDate: new Date(),
        status: STATUS.BELUM_SELESAI,
      };

      await toeflValidateSchema.validate(data);

      const existingAddress = await ToeflModel.findOne({ data });
      const existingEmail = await ToeflModel.findOne({ email });
      if (existingAddress) throw new Error('address already registered');
      if (existingEmail) throw new Error('email already register');

      const result = await ToeflModel.create(data);

      res.status(201).json({
        message: 'toefl register successfully',
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  async findAll(req: IReqUser, res: Response) {
    const { page, limit, search } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};
      if (search) {
        Object.assign(query, {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        });
      }
      const result = await ToeflModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await ToeflModel.countDocuments(query);

      const pagination = {
        total: count,
        totalPages: Math.ceil(count / limit),
        current: page,
      };

      res.status(200).json({
        message: 'data successfully received',
        data: result,
        pagination: pagination,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({
        message: err.message,
        data: null,
      });
    }
  },
};
