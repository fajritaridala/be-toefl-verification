import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type OptionsType = {
  date?: string;
  hour?: string;
};

const time = {
  parseDate: (date: string): Date => {
    const parse = dayjs.utc(date).toDate();
    return parse;
  },
  applyTime: (options: OptionsType) => {
    const timeString = `${options.date} ${options.hour}`;
    const parse = dayjs(timeString).toDate();
    return parse;
  },
};

export default time;
