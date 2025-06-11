import SideBar from "@/components/panels/side-bar";
import AppBar from "@/components/panels/app-bar";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from '../hooks/use-mobile';
import { useEffect, useState } from "react";
import { useTheme } from "@heroui/use-theme";
import { useLayoutStore } from "@/contexts/layout-context";
import IconButton from "@/components/icon-button";
import { MenuIcon, X } from "lucide-react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { theme, setTheme } = useTheme("dark");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTheme("light");
  }, []);

  const {currentChatId} = useGlobalDataStore();
  const isMobile = useIsMobile();
  const [sidebarExpanded, setSideBarExpanded] = useState<boolean>(isMobile);
  const [sideBarWidth, setSideBarWidth] = useState("0px");
  const [appBarHeight, setAppBarHeight] = useState("0px");
  const {layout, setLayout} = useLayoutStore();

  useEffect(() => {
    setIsMounted(true);
    const updateDimensions = () => {
      const appBar = document.getElementById("app-bar");
      const sideBar = document.getElementById("side-bar");
      if (appBar) setAppBarHeight(getComputedStyle(appBar).height);
      if (sideBar) setSideBarWidth(getComputedStyle(sideBar).width);
    };

    if (isMounted) {
      updateDimensions();
    }
  }, [isMounted]);

   const changeSidebarState = () =>{
        setLayout({sideBarExpanded : !layout.sideBarExpanded})
    }

  return (
    <>
     <AppBar />

      <div className="flex w-100vw relative ">
        <SideBar />
       
        <main className="flex flex-col animate-[width] " style={{width: `calc(100% - ${sideBarWidth})`, marginTop: appBarHeight}} >
          {children}

        </main>
       
      </div>
       
    </>
     
    
     

    
      
  );
}
