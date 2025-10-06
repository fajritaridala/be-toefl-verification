"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MONTHS_ID = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];
function numberToString(epochSeconds) {
    if (!Number.isFinite(epochSeconds)) {
        throw new Error("Invalid epoch seconds");
    }
    const date = new Date(epochSeconds * 1000);
    const day = date.getDate();
    const monthName = MONTHS_ID[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${monthName} ${year}`;
}
function stringToNumber(dateString) {
    if (typeof dateString !== "string") {
        throw new Error("Invalid date string");
    }
    // Expecting format: "D MMMM YYYY" in Indonesian, e.g., "1 Januari 2024"
    const trimmed = dateString.trim();
    const match = /^([0-9]{1,2})\s+([A-Za-z]+)\s+([0-9]{4})$/.exec(trimmed);
    if (!match) {
        throw new Error("Invalid date format, expected 'D MMMM YYYY'");
    }
    const day = Number(match[1]);
    const monthName = match[2].toLowerCase();
    const year = Number(match[3]);
    const monthIndex = MONTHS_ID.findIndex((m) => m.toLowerCase() === monthName);
    if (monthIndex === -1) {
        throw new Error("Invalid month name in date string");
    }
    const date = new Date(year, monthIndex, day);
    return Math.floor(date.getTime() / 1000);
}
exports.default = {
    numberToString,
    stringToNumber,
};
