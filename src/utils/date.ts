import moment, { Moment } from "moment";

const isValidDate = (value: string | Moment) => {
  return moment(value, "DD MMMM YYYY", "id", true);
};

const stringToNumber = (date: string): number => {
  return isValidDate(date).unix();
};

function numberToString(date: number): string {
  return moment.unix(date).locale("id").format("DD MMMM YYYY");
}

export default {
  numberToString,
  stringToNumber,
  isValidDate,
};
