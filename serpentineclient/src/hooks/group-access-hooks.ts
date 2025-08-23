import {useEffect, useState, useTransition} from "react";
import {GroupResponse} from "@/models/responses/group-response.ts";
import ApiResult from "@/models/api-result.ts";
import {useFetch} from "@/helpers/axios-helper.ts";
import {handleApiErrors, handleApiSuccess} from "@/helpers/api-results-handler-helper.ts";
import {CreateGroupRequest} from "@/models/requests/groups/create-group-request.ts";
import {GroupAccessResponse} from "@/models/responses/group-access-response.ts";
import {useTransform} from "framer-motion";

const GROUPS_ACCESSES_ENDPOINT = "group-accesses"


//actions
export function useCreateOrUpdateGroupAccess() {

    const [groupAccess, setGroupAccess] = useState<GroupAccessResponse | null>(null);
    const [creatingOrUpdatingGroupAccess, setCreatingOrUpdatingGroupAccess] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<GroupAccessResponse> | null>(null);
    let isBusy = false;
    const { put } = useFetch<GroupAccessResponse>();

    useEffect(() => {


        if(!result)
        {
            setCreatingOrUpdatingGroupAccess(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
            setGroupAccess(result.data);

        }
        else {

            handleApiErrors(result);
        }

        setCreatingOrUpdatingGroupAccess(false);
        setResult(null);


    }, [result]);


    const createOrUpdateGroupAccess = async (data: CreateOrUpdateGroupAccessRequest) => {

       
        setResult(null);
        setCreatingOrUpdatingGroupAccess(true);
        setGroupAccess(null);
        const response = await put({endpoint: GROUPS_ACCESSES_ENDPOINT, contentType: "application/json"}, data );
        setResult(response);



    };

    return { createOrUpdateGroupAccess, groupAccess, creatingOrUpdatingGroupAccess};
}

