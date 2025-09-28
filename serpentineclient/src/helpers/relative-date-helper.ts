import { CalendarDate } from "@heroui/react";
import { CalendarDateTime, parseDateTime, parseZonedDateTime, ZonedDateTime } from "@internationalized/date";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// habilitamos plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const useDateHelper = () =>{

    const  getRelativeDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    return "just now";
  }

  const getDate = (iso: string) : Dayjs => {

    return dayjs(iso);
  }

  

  return{
    getDate,
    getRelativeDate,
  }
}

export const useLocalDateHelper = () =>{

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const utcToLocal = (
    date: string | Date | dayjs.Dayjs,
    
  ): Dayjs => {
    return dayjs.utc(date).local()
  }

  const humanizedDate = (date: string) : string =>{
    return `${monthNames[utcToLocal(date).month() - 1]} ${utcToLocal(date).date()},
            ${utcToLocal(date).year()}`;
  }

  const humanizedDateTime = (date: string) : string =>{
    return `${monthNames[utcToLocal(date).month() - 1]} ${utcToLocal(date).date()},
            ${utcToLocal(date).year()} at ${utcToLocal(date).hour()}:${utcToLocal(date).hour()}`;
  }

   const humanizedTime = (date: string) : string =>{
    return `${utcToLocal(date).hour()}:${utcToLocal(date).hour()}`;
  }


  return {

    utcToLocal,
    humanizedDate,
    humanizedDateTime,
    humanizedTime
  }
}