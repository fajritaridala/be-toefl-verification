import { PinataSDK } from "pinata";
import { PINATA_GATEAWAY, PINATA_JWT } from "./env";

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT!,
  pinataGateway: PINATA_GATEAWAY,
});

export default pinata;
