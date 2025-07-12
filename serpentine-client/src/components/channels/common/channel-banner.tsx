export interface ChannelBannerProps {
    pictureUrl: string | null; 
    
}

export const ChannelBanner: React.FC<ChannelBannerProps> = ({ pictureUrl }) => (
    <div className="w-full rounded-sm dark:bg-neutral-950 bg-neutral-100  h-[100px] ">
        {pictureUrl && 
            <img
    
    
            className="rounded-sm w-full h-full    object-cover flex-shrink-0 "
            src={pictureUrl}            
    
         /> 
        }
         
    </div>
   
       
                              
)