import ChannelsPanel from "@/components/panels/channels-panel";
import ProfilePanel from "@/components/panels/profile-panel";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from '../hooks/use-mobile';
import { useEffect } from "react";
import { useTheme } from "@heroui/use-theme";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { theme, setTheme } = useTheme("dark");

  useEffect(() => {
    setTheme("dark");
  }, []);

  const {currentChatId} = useGlobalDataStore();
  const isMobile = useIsMobile();

  return (
    <div className="relative max-md:flex-col flex w-screen  h-screen">

      
      {isMobile ? 
        <>

          {currentChatId && currentChatId >= 1 || 
            <>
              <ChannelsPanel/>
              {currentChatId && currentChatId >= 1 &&
                <div className="w-full rounded-md m-3">
                  {children}

                </div>

              }
              <ProfilePanel/>
            </>
          }

          
         
        </>
        :
        <>
          <ProfilePanel/>
          <ChannelsPanel/>
          <div className=" w-[77%] h-screen   ">
            {children}

          </div>
        </>
        
      }
     

    
      
    </div>
  );
}
