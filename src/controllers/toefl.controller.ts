// import { Response } from "express";
// import moment from "moment";
// import { PesertaModel } from "../models/user.model";
// import { STATUS, STATUS_KETERSEDIAAN } from "../utils/constants";
// import date from "../utils/date";
// import { generateHash } from "../utils/hash";
// import { IPaginationQuery, IReqUser } from "../utils/interface";
// import response from "../utils/response";
// import toeflConverter from "../utils/toeflConverter";
// import uploader from "../utils/uploader";
// import {
//   addLayananValidateSchema,
//   addScheduleValidateSchema,
//   inputValidateSchema,
//   toeflValidateSchema,
// } from "../utils/validate";

// type TOEFLRegister = {
//   jenis_tes: string;
//   nama_lengkap: string;
//   jenis_kelamin: string;
//   tanggal_lahir: string;
//   nomor_induk_mahasiswa: string;
//   fakultas: string;
//   program_studi: string;
//   sesi_tes: string;
// };

// type TOEFLInput = {
//   nilai_listening: number;
//   nilai_structure: number;
//   nilai_reading: number;
// };

// export default {
//   async findAll(req: IReqUser, res: Response) {
//     const { page, limit, search } = req.query as unknown as IPaginationQuery;
//     try {
//       // melakukan query ke database
//       const query = {};
//       if (search) {
//         Object.assign(query, {
//           $or: [
//             { nama_lengkap: { $regex: search, $options: "i" } },
//             // { nim: { $regex: search, $options: 'i' } },
//           ],
//         });
//       }

//       // mendeklarasikan data yang tidak akan ditampilkan pada response
//       const exclude = "-_id -createdAt -updatedAt -__v";

//       // mencari data berdasarkan hasil query
      // const data = await ToeflModel.find(query)
      //   .select(exclude)
      //   .limit(limit)
      //   .skip((page - 1) * limit)
      //   .sort({ createdAt: -1 })
      //   .exec();

//       // menghitung jumlah data berdasarkan hasil query
//       const count = await ToeflModel.countDocuments(query);

//       // menyiapkan data pagination
//       const pagination = {
//         total: count,
//         totalPages: Math.ceil(count / limit),
//         current: page,
//       };

//       response.pagination({
//         res,
//         data,
//         pagination,
//         message: "Data berhasil ditemukan",
//       });
//     } catch (error) {
//       response.error(res, error, "Terjadi kesalahan saat mengambil data");
//     }
//   },
//   async schedules(req: IReqUser, res: Response) {
//     const { type } = req.query as unknown as { type: string };
//     try {
//     } catch (error) {}
//   },
//   async addSchedule(req: IReqUser, res: Response) {
//     try {
//       const body = await addScheduleValidateSchema.validate(req.body);

//       const {
//         tanggal_tes,
//         waktu_mulai,
//         waktu_selesai,
//         lokasi,
//         kuota_penuh,
//       } = body;

//       const newSchedule = {
//         tanggal_tes,
//         waktu_mulai,
//         waktu_selesai,
//         lokasi,
//         kuota_penuh,
//         jumlah_peserta: 0,
//         status_ketersediaan: STATUS_KETERSEDIAAN.TERSEDIA,
//       };

//       await ToeflModel.updateOne(
//         {},
//         { $push: { jadwal: newSchedule } },
//         { upsert: true },
//       );

//       response.success(res, newSchedule, "Jadwal berhasil ditambahkan");
//     } catch (error) {
//       const err = error as unknown as Error;
//       response.error(res, error, err.message);
//     }
//   },
//   async addLayanan(req: IReqUser, res: Response) {
//     try {
//       const body = await addLayananValidateSchema.validate(req.body);
//       const { nama_layanan, deskripsi, harga, durasi } = body;

//       const newLayanan = {
//         nama_layanan,
//         deskripsi,
//         harga,
//         durasi,
//       };

//       await ToeflModel.updateOne(
//         {},
//         { $push: { layanan: newLayanan } },
//         { upsert: true },
//       );

//       response.success(res, newLayanan, "Layanan berhasil ditambahkan");
//     } catch (error) {
//       const err = error as unknown as Error;
//       response.error(res, error, err.message);
//     }
//   },
//   async register(req: IReqUser, res: Response) {
//     try {
//       // validasi inputan peserta
//       const body = await toeflValidateSchema.validate(
//         req.body as TOEFLRegister,
//       );

//       // mengambil data peserta dari parameter
//       const { address_peserta } = req.params;
//       const {
//         jenis_tes,
//         nama_lengkap,
//         jenis_kelamin,
//         tanggal_lahir,
//         nomor_induk_mahasiswa,
//         fakultas,
//         program_studi,
//         sesi_tes,
//       } = body;

//       const tanggal_tes = date.numberToString(moment().unix());

//       // menyiapkan data peserta baru
//       const TOEFLParticipantData = {
//         address_peserta,
//         nama_lengkap,
//         jenis_kelamin,
//         tanggal_lahir,
//         nomor_induk_mahasiswa,
//         fakultas,
//         program_studi,
//         sesi_tes,
//         tanggal_tes,
//         status: STATUS.BELUM_SELESAI,
//       };

//       const TOEFLData = {
//         jenis_tes,
//         participants: [{ address_peserta, tanggal_tes }],
//       };

//       // mengecek peserta
//       const tes = await ToeflModel.findOne({ jenis_tes });

//       // menolak peserta yang sudah terdaftar
//       // if (participant) throw new Error("Pengguna telah terdaftar");

//       // menyimpan data peserta baru
//       // await TOEFLParticipantModel.create(TOEFLParticipantData);

//       // await ToeflModel.create(TOEFLData);

//       // response.success(
//       //   res,
//       //   { TOEFLParticipantData, TOEFLData },
//       //   "Pendaftaran TOEFL berhasil",
//       // );
//     } catch (error) {
//       const err = error as unknown as Error;
//       console.log(err.message);
//       response.error(res, error, err.message);
//     }
//   },
//   async input(req: IReqUser, res: Response) {
//     try {
//       // menangkap data dari parameter
//       const { address_peserta } = req.params;
//       const { nilai_listening, nilai_structure, nilai_reading } =
//         req.body as unknown as TOEFLInput;

//       // mengecek apakah peserta sudah terdaftar
//       const peserta = await TOEFLParticipantModel.findOne({ address_peserta });
//       if (!peserta) {
//         return response.error(res, null, "Peserta tidak ditemukan");
//       }

//       // menyiapkan nilai peserta
//       const { nilai_total, listening, structure, reading } = toeflConverter({
//         nilai_listening,
//         nilai_structure,
//         nilai_reading,
//       });

//       // menyiapakan data yang akan dikirim sebagai response
//       const result = {
//         address_peserta,
//         nama_lengkap: peserta.nama_lengkap,
//         jenis_kelamin: peserta.jenis_kelamin,
//         tanggal_lahir: peserta.tanggal_lahir,
//         nomor_induk_mahasiswa: peserta.nomor_induk_mahasiswa,
//         fakultas: peserta.fakultas,
//         program_studi: peserta.program_studi,
//         sesi_tes: peserta.sesi_tes,
//         tanggal_tes: peserta.tanggal_tes,
//         nilai_listening: listening,
//         nilai_structure: structure,
//         nilai_reading: reading,
//         nilai_total,
//       };

//       // memvalidasi data yang akan dikirim
//       await inputValidateSchema.validate(result);

//       // menyiapakan kode hash
//       const hash = generateHash(result);
//       const toefl_hash = "0x" + hash;

//       // menambahkan toefl_hash ke database peserta
//       await PesertaModel.findOneAndUpdate(
//         { address: address_peserta },
//         {
//           $set: { toefl_hash },
//         },
//       );

//       // menyiapkan data tanggal untuk response
//       const tanggalLahir = date.stringToNumber(result.tanggal_lahir);
//       const tanggalTes = date.stringToNumber(result.tanggal_tes);

//       // kirim response
//       res.status(201).json({
//         message: "success input data",
//         data: {
//           peserta: {
//             ...result,
//             tanggal_tes: tanggalTes,
//             tanggal_lahir: tanggalLahir,
//           },
//           toefl_hash,
//         },
//       });
//     } catch (error) {
//       const err = error as unknown as Error;
//       response.error(res, error, err.message);
//     }
//   },
//   async uploadCertificate(req: IReqUser, res: Response) {
//     // memastikan file ada
//     if (!req.file) {
//       return response.error(res, null, "File tidak ditemukan");
//     }
//     try {
//       // memastikan peserta ada
//       const { address_peserta } = req.params;
//       const peserta = await ToeflModel.findOne({ address_peserta }).lean();
//       if (!peserta) {
//         return response.error(res, null, "Peserta tidak ditemukan");
//       }

//       // melakukan upload sertifikat ke IPFS Pinata
//       // sekarang masih dikirim ke jaringan private
//       const upload = await uploader.uploadCertificate(
//         req.file as Express.Multer.File,
//       );

//       // mengambil CID, url, dan size dari hasil upload
//       const { cid, url, size } = upload;

//       // mengupdate status peserta menjadi selesai
//       await ToeflModel.findOneAndUpdate(
//         { address_peserta },
//         {
//           $set: { status: "selesai" },
//         },
//       );

//       // menambahkan cid sertifikat ke peserta
//       await PesertaModel.findOneAndUpdate(
//         { address: address_peserta },
//         { $set: { certificate: cid } },
//       );

//       const result = {
//         cid,
//         url,
//         size,
//       };

//       response.success(res, result, "Sertifikat berhasil diunggah");
//     } catch (error) {
//       const err = error as unknown as Error;
//       response.error(res, error, err.message);
//     }
//   },
// };
