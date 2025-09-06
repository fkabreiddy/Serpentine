interface GetMessagesByGroupIdRequest{

    groupId: string,
    skip: number,
    take: number,
    after: boolean,
    indexDate?: string | null
}