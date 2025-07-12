import Avatar from "boring-avatars";

export interface CoverAvatarProps {
    pictureUrl: string | null; 
    channelName: string | null
}

export const CoverAvatar: React.FC<CoverAvatarProps> = ({ pictureUrl, channelName }) => (
       
    <>
        {pictureUrl  ? 
        <img
            className="rounded-full absolute ring-2 ring-white dark:ring-black -bottom-[10px] right-[30px] cursor-pointer bg-default-100  object-cover flex-shrink-0 size-[50px]"
            src={pictureUrl}   
          
        /> : 
        <Avatar className="transition-all ring-2 absolute ring-white dark:ring-black rounded-full -bottom-[10px] right-[30px]" name={channelName ?? "serpentine"} size={40} variant="marble"/>}
    </>
        
        
        
       
                              
)

