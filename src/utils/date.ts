import moment, { Moment } from "moment";

const validateDate = (date: string | Moment) => {
  return moment(date, "DD-MM-YYYY", "id", true).isValid();
};

const convertToDate = (date: string):number => {
  const convert = new Date(date);
  return moment(convert).valueOf();
};

function convertToString(date: number): string {
  return moment.unix(date).locale("id").format("DD-MM-YYYY");
}

export { convertToString, convertToDate, validateDate };
