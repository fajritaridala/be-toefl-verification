import { Request, Response } from "express";

function avalancheEffect(h0: string, h1: string) {
  let diffBits = 0;

  for (let i = 0; i < h0.length; i++) {
    // Parse tiap digit hex ke integer (0-15)
    const v1 = parseInt(h0[i], 16);
    const v2 = parseInt(h1[i], 16);

    // XOR nilainya
    const xor = v1 ^ v2;

    // Hitung bit 1 pada hasil XOR (digit hex max 4 bit)
    diffBits +=
      (xor & 1) + ((xor >> 1) & 1) + ((xor >> 2) & 1) + ((xor >> 3) & 1);
  }

  const totalBits = h0.length * 4;
  const percentage = (diffBits / totalBits) * 100;

  return {
    diffBits,
    totalBits,
    percentage,
    fixPercentage: percentage.toFixed(2) + "%",
  };
}

function getAE(diffBits: number) {
  const AE = (diffBits / 256) * 100;
  return AE;
}

const aeController = {
  bdr: async (req: Request, res: Response) => {
    const { h0, h1 } = req.body as unknown as { h0: string; h1: string };
    const { diffBits, fixPercentage, percentage, totalBits } = avalancheEffect(
      h0,
      h1,
    );

    return res.status(200).json({
      diffBits,
      totalBits,
      percentage,
      fixPercentage,
    });
  },
};

export default aeController;
