import ChannelsPanel from "@/components/panels/channels-panel";
import ProfilePanel from "@/components/panels/profile-panel";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from '../hooks/use-mobile';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const {currentChatId} = useGlobalDataStore();
  const isMobile = useIsMobile();

  return (
    <div className="relative max-md:flex-col flex w-screen  h-screen">

      <ProfilePanel/>
      <ChannelsPanel/>
      {isMobile ? 
        <>
         

          {currentChatId && currentChatId >= 1 &&
            <div className="w-full ">
              {children}

            </div>

          }
         
        </>
        :
        <>
          
            <div className="w-[80%] ">
              {children}

            </div>
        </>
      }
       
    
      
    </div>
  );
}
