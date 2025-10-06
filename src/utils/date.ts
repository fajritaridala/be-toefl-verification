import moment from "moment";

function numberToString(date: number) {
  return moment.unix(date).locale("id").format("D MMMM YYYY");
}

function stringToNumber(date: string) {
  return moment(date, "D MMMM YYYY", "id").unix();
}

export default {
  numberToString,
  stringToNumber,
};
