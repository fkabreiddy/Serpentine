import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from '../hooks/use-mobile';
import { useEffect, useState } from "react";
import { useTheme } from "@heroui/use-theme";
import {  useLayoutStore } from "@/contexts/layout-context";
import { ArrowLeft, ArrowRight, MenuIcon, X } from "lucide-react";
import IconButton from "@/components/common/icon-button";
import AppBar from "@/components/panels/app-bar/app-bar";
import LeftSideBar from "@/components/panels/left-pannel/left-side-bar";
import RightSideBar from "@/components/panels/right-panel/right-side-bar";
import { RightPanelView } from "@/models/right-panel-view";

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
  
  const {layout, setLayout} = useLayoutStore();

  useEffect(() => {

    if(!isMobile && !layout.sideBarExpanded)
       setLayout({sideBarExpanded: true})

    
  }),[isMobile]

  

  const changeSidebarState = () =>{
      setLayout({sideBarExpanded : !layout.sideBarExpanded})
  }

  return (
    <div className="w-screen h-screen flex">
        <LeftSideBar />
          {isMobile && 
            <div className={`absolute top-[50%] !z-[99999] ${layout.sideBarExpanded ? "left-[300px]" : "left-[50px]"}`}>
                <button onClick={changeSidebarState}  className="flex bg-default-100 items-center justify-center px-1 py-2 rounded-r-xl">
                    {!layout.sideBarExpanded ? <ArrowRight className="shrink-0 size-4"/> : <ArrowLeft className="shrink-0 size-4"/>}
                </button>
            </div>
          }

        {isMobile && layout.currentRightPanelView !== RightPanelView.DefaultView ? 
          <></> :

          <div className="flex flex-col w-full h-screen  " style={{marginLeft: !layout.sideBarExpanded ? "50px" : "0px" }}>
              <AppBar />
              <main className="flex flex-col animate-[width] bg-white  dark:bg-black  float-left h-full overflow-auto "  >
              {children}

            </main> 

          </div>
         
        }
       

       {layout.currentRightPanelView === RightPanelView.DefaultView ? <></> :    <RightSideBar/> }
 
       
    </div>
     
    
     

    
      
  );
}
