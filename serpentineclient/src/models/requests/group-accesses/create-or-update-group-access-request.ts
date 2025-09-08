import { CalendarDateTime} from "@internationalized/date";

interface CreateOrUpdateGroupAccessRequest{
    groupId: string;
    lastReadMessageDate:    Date | null;
}