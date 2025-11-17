import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const mediaMiddleware = {
  uploadSingle(fieldName: string) {
    return upload.single(fieldName);
  },
};

export default mediaMiddleware;
