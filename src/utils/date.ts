const time = {
  validate: (date: string): boolean => {
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(date); // YYYY-MM-DD
    return isValid;
  },
  stringToDate: (date: string): number => {
    const utc = new Date(date).toUTCString();
    const convert = Date.parse(utc);
    return convert;
  },
  dateToString: (date: number): string => {
    const timestamp = new Date(date);
    const year = timestamp.getUTCFullYear();
    const month = (timestamp.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = timestamp.getUTCDate().toString().padStart(2, "0");
    const convert = `${year}-${month}-${day}`;
    return convert;
  },
};



export default time;
