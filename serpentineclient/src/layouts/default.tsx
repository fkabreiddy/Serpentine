import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from '../hooks/use-mobile';
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@heroui/use-theme";
import {  useLayoutStore } from "@/contexts/layout-context";
import { ArrowLeft, ArrowRight, MenuIcon, X } from "lucide-react";
import IconButton from "@/components/common/icon-button";
import AppBar from "@/components/panels/app-bar/app-bar";
import LeftSideBar from "@/components/panels/left-pannel/left-side-bar";
import RightSideBar from "@/components/panels/right-panel/right-side-bar";
import { RightPanelView } from "@/models/right-panel-view";
import { useJwtHelper } from "@/helpers/jwt-helper";
import { useAuthStore } from "@/contexts/authentication-context";
import { Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useUiSound } from "@/helpers/sound-helper";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { setTheme } = useTheme("dark");
  const {getToken} = useJwtHelper();
  const {isAuthenticated, user} = useAuthStore();
  const firstRender = useRef(false);
  const navigate = useNavigate();
  const [loadLayout, setLoadLayout] = useState(false);

 useEffect(()=>{
  
    
    if(!user && !isAuthenticated)
    {
      navigate("/");

    }
    

  },[user, isAuthenticated])

  useEffect(() => {


    if(!firstRender.current)
    {
      firstRender.current = true;
      const token = getToken();

      if(!token)
      {
          navigate("/");
      }
      setLoadLayout(true);
    }
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

  if(!loadLayout) return (<div className="flex items-center justify-center w-full h-screen bg-black"><Spinner size="sm" variant="spinner"/></div>)

  return (
    <div className="w-screen h-screen flex">
        <AppBar />
        <LeftSideBar />
          {isMobile && 
            <div className={`absolute top-[50%] !z-[9999999] ${layout.sideBarExpanded ? "left-[355px]" : "left-[105px]"}`}>
                <button onClick={changeSidebarState}  className="flex bg-default-100 cursor-pointer items-center justify-center px-1 py-2 rounded-r-xl">
                    {!layout.sideBarExpanded ? <ArrowRight className="shrink-0 size-4"/> : <ArrowLeft className="shrink-0 size-4"/>}
                </button>
            </div>
          }

        
      

          <div className="flex flex-col w-full h-screen  " style={{marginLeft: !layout.sideBarExpanded ? "50px" : "0px" }}>

            
              <main className="flex flex-col animate-[width] bg-white  dark:bg-black  float-left h-full overflow-auto "  >
                {children}

              </main> 
              
             

          </div>
         
        
       

       {layout.currentRightPanelView === RightPanelView.DefaultView ? <></> :    <RightSideBar/> }
 
       
    </div>
     
    
     

    
      
  );
}
