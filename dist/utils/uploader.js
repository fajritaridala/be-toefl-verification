"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinata_1 = require("pinata");
const env_1 = require("./env");
const pinata = new pinata_1.PinataSDK({
    pinataJwt: env_1.PINATA_JWT,
    pinataGateway: env_1.PINATA_GATEAWAY,
});
exports.default = {
    async uploadCertificate(file) {
        try {
            const filePinata = new File([file.buffer], file.originalname, {
                type: file.mimetype,
            });
            const uploadPrivate = await pinata.upload.private
                .file(filePinata)
                .group(env_1.PINATA_GROUP_PRIVATE);
            // const uploadPublic = await pinata.upload.public.file(filePinata);
            const result = {
                cid: uploadPrivate.cid,
                url: `https://${env_1.PINATA_GATEAWAY}/ipfs/${uploadPrivate.cid}`,
                size: uploadPrivate.size,
            };
            return result;
        }
        catch (error) {
            const err = error;
            throw new Error(`pinata upload failed: ${err.message}`);
        }
    },
};
