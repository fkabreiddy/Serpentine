import LeftSideBar from "@/components/panels/left-side-bar";
import AppBar from "@/components/panels/app-bar";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from '../hooks/use-mobile';
import { useEffect, useState } from "react";
import { useTheme } from "@heroui/use-theme";
import { CurrentRightBarViews, useLayoutStore } from "@/contexts/layout-context";
import IconButton from "@/components/icon-button";
import { ArrowLeft, ArrowRight, MenuIcon, X } from "lucide-react";
import RightSideBar from "@/components/panels/right-side-bar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { setTheme } = useTheme("dark");

  useEffect(() => {
    setTheme("dark");
  }, []);

  const isMobile = useIsMobile();
  
  const {layout, setLayout, currentRightBarView} = useLayoutStore();

  

  const changeSidebarState = () =>{
      setLayout({sideBarExpanded : !layout.sideBarExpanded})
  }

  return (
    <div className="w-screen h-screen flex">
        <LeftSideBar />

        <div className={`absolute top-[15px] !z-[50] ${layout.sideBarExpanded ? "left-[150px]" : "left-[50px]"}`}>
                <IconButton onClick={changeSidebarState}  tootltipText={layout.sideBarExpanded ? "Minimize Sidebar" : "Expand Sidebar"}>
                    {!layout.sideBarExpanded ? <ArrowRight className="shrink-0 size-4"/> : <ArrowLeft className="shrink-0 size-4"/>}
                </IconButton>
            </div>

        {isMobile && currentRightBarView !== CurrentRightBarViews.TrendingPosts ? 
          <></> :

          <div className="flex flex-col w-full h-screen  ">
              <AppBar />
              <main className="flex flex-col animate-[width] bg-white  dark:bg-black  float-left h-full overflow-auto "  >
              {children}

            </main> 

          </div>
         
        }
       

       {isMobile && currentRightBarView === CurrentRightBarViews.TrendingPosts ? <></> :    <RightSideBar/> }
 
       
    </div>
     
    
     

    
      
  );
}
