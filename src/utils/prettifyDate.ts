import jalaliPlugin from "@zoomit/dayjs-jalali-plugin";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/fa";
dayjs.extend(jalaliPlugin);

export const toStandardGeorgianDateTime = (date: Dayjs | Date | string) => {
  const _dayjs = dayjs(date);
  const jalaliDate = toStandardJalaliDate(date);
  const georgianDate = _dayjs.format("YYYY/MM/DD HH:mm:ss");

  return [georgianDate, " ", "(", jalaliDate, ")"].join("");
};

export const toStandardJalaliDateTime = (date: Dayjs | Date | string) => {
  const _dayjs = dayjs(date);
  return _dayjs.calendar("jalali").format("YYYY/MM/DD HH:mm:ss");
};

export const toStandardJalaliDate = (date: Dayjs | Date | string) => {
  const _dayjs = dayjs(date);
  return _dayjs.calendar("jalali").format("YYYY/MM/DD");
};
