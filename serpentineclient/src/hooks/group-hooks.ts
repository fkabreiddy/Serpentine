import {useEffect, useState} from "react";
import ApiResult from "@/models/api-result.ts";
import {useFetch} from "@/helpers/axios-helper.ts";
import {handleApiErrors, handleApiSuccess} from "@/helpers/api-results-handler-helper.ts";
import {GroupResponse} from "@/models/responses/group-response.ts";
import {GetGroupsByChannelIdRequest} from "@/models/requests/groups/get-by-channel-id-request.ts";
import {CreateGroupRequest} from "@/models/requests/groups/create-group-request.ts";



export function useCreateGroup() {

    const [group, setGroup] = useState<GroupResponse | null>(null);
    const [creatingGroup, setCreatingGroup] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<GroupResponse> | null>(null);
    const { post } = useFetch<GroupResponse>();

    useEffect(() => {


        if(!result)
        {
            setCreatingGroup(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
            setGroup(result.data);
            handleApiSuccess(result);

        }
        else {

            handleApiErrors(result);
        }

        setCreatingGroup(false);
        setResult(null);


    }, [result]);


    const createGroup = async (data: CreateGroupRequest) => {

        setResult(null);
        setCreatingGroup(true);
        setGroup(null);
        const response = await post({endpoint: "groups/create", contentType: "application/json"}, data );
        setResult(response);



    };

    return { createGroup, group, creatingGroup};
}
export function useGetGroupsByChannelId() {


    const [groups, setGroups] = useState<GroupResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingGroups, setLoadingGroups] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<GroupResponse[]> | null>(null);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const { get } = useFetch<GroupResponse[]>();


    useEffect(() => {


        if(!result)
        {

            return;
        }



        if (result.data && result.statusCode === 200) {
            setGroups(prev => [...prev, ...(result.data || [])]);

        }
        else {
            setHasMore(false);
            handleApiErrors(result);
        }

        setLoadingGroups(false);
        setResult(null);


    }, [result]);


    const getGroupsByChannelId = async (data: GetGroupsByChannelIdRequest) => {
        let has = true;
        let channelCount = 0;
        setIsBusy(true);
        setResult(null);
        setGroups([]);
        setHasMore(true);
        setLoadingGroups(true);

        do{


            data.skip = channelCount;
            const response = await get({endpoint: "groups/by-channel-id" }, data );
            has = (response.data !== null && response.data.length == 5);
            channelCount += response.data?.length || 0;
            setResult(response);
        }while (has);

        setIsBusy(false);
        setHasMore(has);

    };

    return { getGroupsByChannelId, groups, setGroups, loadingGroups, result, hasMore, isBusy};
}

export function useGetGroupById(){

    const [result, setResult] = useState<ApiResult<GroupResponse>| null>(null);
    const [searchingGroup, setSearchingGroup] = useState<boolean>(false);
    const [group, setGroup] = useState<GroupResponse | null>(null);
    const {get} = useFetch<GroupResponse>();

    useEffect(()=>{

        if(!result)
        {
            setSearchingGroup(false);
            return;
        }

        if(result.data !== null && result.isSuccess)
        {
            setGroup(result.data);
        }
        else{
            handleApiErrors(result);
        }

        setResult(null);


    },[result])

    const getGroupById = async (data: GetGroupByIdRequest) =>{

        setResult(null);
        setGroup(null);
        setSearchingGroup(true);

        const response = await get({endpoint: "groups/by-id", contentType: "application/json"}, data)

        setResult(response);

    }

    return{
        group, 
        getGroupById,
        searchingGroup
    }
}