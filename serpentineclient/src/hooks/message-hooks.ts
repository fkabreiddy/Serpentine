import {useEffect, useState} from "react";
import {GroupResponse} from "@/models/responses/group-response.ts";
import ApiResult from "@/models/api-result.ts";
import {useFetch} from "@/helpers/axios-helper.ts";
import {handleApiErrors, handleApiSuccess} from "@/helpers/api-results-handler-helper.ts";
import {CreateGroupRequest} from "@/models/requests/groups/create-group-request.ts";
import {MessageResponse} from "@/models/responses/message-response.ts";
import {CreateMessageRequest} from "@/models/requests/messages/create-message-request.ts";
import { getCiphers } from "node:crypto";
import DeleteMessageRequest from "@/models/requests/messages/delete-message-request";

const MESSAGES_ENDPOINT = "messages"


//actions
export function useCreateMessage() {

    const [message, setMessage] = useState<MessageResponse | null>(null);
    const [creatingMessage, setCreatingMessage] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<MessageResponse> | null>(null);
    const { post } = useFetch<MessageResponse>();

    useEffect(() => {


        if(!result)
        {
            setCreatingMessage(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
            setMessage(result.data);

        }
        else {

            handleApiErrors(result);
        }

        setResult(null);


    }, [result]);


    const createMessage = async (data: FormData) => {

        setResult(null);
        setCreatingMessage(true);
        setMessage(null);
        const response = await post({endpoint: MESSAGES_ENDPOINT, contentType: "multipart/form-data"}, data );
        setResult(response);



    };

    return { createMessage, message, creatingMessage};
}

export function useDeleteMessage() {

    const [messageId, setMessageId] = useState<string | null>(null);
    const [deletingMessage, setDeletingMessage] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<string> | null>(null);
    const { delete: fetchDelete } = useFetch<string>();

    useEffect(() => {


        if(!result)
        {
            setDeletingMessage(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
            setMessageId(result.data);

        }
        else {

            handleApiErrors(result);
        }

        setResult(null);


    }, [result]);


    const deleteMessage = async (data: DeleteMessageRequest) => {

        setResult(null);
        setDeletingMessage(true);
        setMessageId(null);
        const response = await fetchDelete({endpoint: MESSAGES_ENDPOINT, contentType: "application/json"}, data );
        setResult(response);



    };

    return { deleteMessage, messageId, deletingMessage};
}


//queries
export function useGetMessagesByGroupId() {

    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [fetchingMessages, setFetchingMessages] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<MessageResponse[]> | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [groupId, setGroupId] = useState<string | null>(null);
    const { get } = useFetch<MessageResponse[]>();

    useEffect(() => {


        if(!result)
        {
            setFetchingMessages(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
            setMessages((prev)=>[...prev, ...(result.data?.filter(m => m.groupId === groupId) ?? [])]);

            if(result.data.length <= 14)
            {
                setHasMore(false);
            }


        }
        else {

            handleApiErrors(result);
            setHasMore(false);
        }

        setResult(null);


    }, [result, groupId]);


    const getMessagesByGroupId = async (data: GetMessagesByGroupIdRequest) => {

        setResult(null);
        setFetchingMessages(true);
        setGroupId(data.groupId);
        const response = await get({endpoint: MESSAGES_ENDPOINT + "/by-group-id", contentType: "application/json"}, data );
        setResult(response);



    };

    return { getMessagesByGroupId, hasMore, messages, fetchingMessages, setMessages};
}
