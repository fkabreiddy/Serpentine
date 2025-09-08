export interface CreateMessageRequest {
    groupId: string;  
    content: string;
    isNotification: boolean; 
    parentId?: string | null; 
}