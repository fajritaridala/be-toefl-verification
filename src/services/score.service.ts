import { ScoreInputBodyDto, ScoreOutputDto } from "../dtos";
import { ValidationException } from "../exceptions";
import toeflConverter from "../utils/toeflConverter";

export class ScoreService {
  convertToToeflScores(rawScores: ScoreInputBodyDto): ScoreOutputDto {
    this.validateScoreRanges(rawScores);

    const converted = toeflConverter({
      nilai_listening: rawScores.listening,
      nilai_structure: rawScores.writing,
      nilai_reading: rawScores.reading,
    });

    return {
      listening: converted.listening,
      reading: converted.reading,
      writing: converted.structure,
      total: converted.nilai_total,
    };
  }

  private validateScoreRanges(scores: ScoreInputBodyDto): void {
    const { listening, reading, writing } = scores;

    if (listening < 0 || listening > 50) {
      throw new ValidationException("Listening score must be between 0 and 50");
    }
    if (reading < 0 || reading > 50) {
      throw new ValidationException("Reading score must be between 0 and 50");
    }
    if (writing < 0 || writing > 40) {
      throw new ValidationException("Writing score must be between 0 and 40");
    }
  }

  normalizeScores(scores: any): ScoreOutputDto | undefined {
    if (!scores) return undefined;

    const { _id, ...cleanScores } = scores;
    return {
      listening: cleanScores.listening,
      reading: cleanScores.reading,
      writing: cleanScores.writing,
      total: cleanScores.total,
    };
  }
}

export const scoreService = new ScoreService();
