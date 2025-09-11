import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from '../hooks/use-mobile';
import { ReactNode, useEffect, useRef, useState } from "react";
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
    
    if(!user && !isAuthenticated && firstRender.current)
    {

      navigate("/");

    }
    

  },[user, isAuthenticated, firstRender])

  useEffect(()=>{

    if(loadLayout)
    {
      firstRender.current = true;

    }

  },[loadLayout])
  useEffect(() => {


    if(!firstRender.current)
    {
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
    {
       setLayout({sideBarExpanded: true})

    }

    
    
  }),[isMobile]

  

  if(!loadLayout) return (<div className="flex items-center justify-center w-full h-screen bg-black"><Spinner size="sm" variant="spinner"/></div>)

  return (
    <div className="w-screen h-screen flex items-stretch">

      <LeftSide>
        <AppBar />
        <LeftSideBar />
      </LeftSide>
      
      <main 
        style={{width: (layout.sideBarExpanded && isMobile) ? "100vw" : "calc(100vw - 60px)" }}
      className={`  flex flex-col animate-[width] bg-white  dark:bg-black     h-full overflow-auto  `}  >
        {children}

      </main> 
      
      {layout.currentRightPanelView === RightPanelView.DefaultView ? <></> :    <RightSideBar/> }
 
       
    </div>
     
    
     

    
      
  );
}


const LeftSide = ({children}:{children: ReactNode}) =>{

  const {layout} = useLayoutStore();
  const isMobile = useIsMobile();
  return(

    <div className={`${layout.sideBarExpanded && isMobile && "absolute"} ${layout.sideBarExpanded ? "w-[360px]" : "w-[60px]" } h-screen flex z-[40]  items-stretch`}>
      {children}
     
    </div>
  )
}
