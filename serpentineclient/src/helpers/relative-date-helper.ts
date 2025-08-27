import { CalendarDate } from "@heroui/react";
import { CalendarDateTime, parseDateTime, parseZonedDateTime, ZonedDateTime } from "@internationalized/date";

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

  const getDate = (iso:string) : CalendarDateTime | ZonedDateTime=>{

    try{

      if(iso.endsWith("Z"))
      {
        iso = iso.replace("Z", "");
      }
      return parseDateTime(iso);
    }catch{
      return  parseZonedDateTime(iso);
    }
  }

  return{

    getRelativeDate,
    getDate,
  }
}

