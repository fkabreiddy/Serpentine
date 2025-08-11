import SearchChannelCard from "@/components/channels/common/search-channel-card";
import IconButton from "@/components/common/icon-button";
import Noise from "@/components/common/noise-ext";
import WarmBeigeBg from "@/components/common/warm-beige-bg";
import { useAuthStore } from "@/contexts/authentication-context";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { useGetManyChannelsByNameOrId } from "@/hooks/channel-hooks";
import { ChannelResponse } from "@/models/responses/channel-response";
import { RightPanelView } from "@/models/right-panel-view";
import { Input, Spinner, Tab, Tabs } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [searchText, setSearchText] = useState("");

  

  const handleFilterChange = (
    onChange: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilter(onChange.target.value);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
      <>

        <Background/>
              <div className="flex flex-col z-[10]  p-3 w-full  top-0">
                  <h1 className="text-3xl text-center mt-[100px] font-normal opacity-80">
                      Explore
                  </h1>
                  <h1 className="text-[50px] text-center font-semibold opacity-90">
                      Serpentine
                  </h1>

                  <div className="flex w-full  gap-2 mt-5 justify-center items-center">

                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Input
                              value={filter}
                              labelPlacement="outside"
                              autoComplete="current-password"
                              style={{ fontSize: "12px" }}
                              placeholder="Search something..."
                              className={`w-[270px] max-md:w-full !text-[12px] `}
                              onChange={handleFilterChange}
                          />
                      </motion.div>



                      <div className="">
                          <IconButton
                              tooltipText="Search"
                              onClick={() => {
                                  setSearchText(filter);
                              }}
                              className="shrink-0 "
                          >

                              <SearchIcon className="size-[21px] " />
                          </IconButton>

                      </div>


                  </div>

                  <div className="flex flex-col w-full min-w-fit gap-3 mt-5 justify-center items-center">
                      <Tabs aria-label="filters" radius="full"  size={"sm"}>
                          <Tab key="channels" className="flex  w-[90%]" title="Channels">
                              <ChannelsResults filter={searchText}/>
                          </Tab>
                          <Tab key="users" title="Users" />
                      </Tabs>
                  </div>

              </div>

      </>
  );
}

interface ChannelsResultsProps {
  filter?: string;
}
const ChannelsResults = ({ filter = "" }: ChannelsResultsProps) => {

  const {setChannelJoined} = useGlobalDataStore();

  const {setChannelInfoId} = useGlobalDataStore();
  const { setLayout } = useLayoutStore();
  const {user} = useAuthStore();

 

  const fetch = async () =>{
    await getManyChannelsByNameOrId({channelName: filter, channelId: null});
  }
  const { getManyChannelsByNameOrId, channels, loadingChannels } = useGetManyChannelsByNameOrId();

    useEffect(()=>{

      fetch();
         
    },[filter])

    function handleChannelJoined(channel: ChannelResponse){

      setChannelJoined(channel);
    }
    
    function handleOnInfoClicked(channelId:string){

        setChannelInfoId(channelId);
        setLayout({currentRightPanelView: RightPanelView.ChannelInfo});
    }

if(loadingChannels) return <div className="flex   w-full justify-center"> <Spinner size="sm" variant="spinner"/></div>;
  return (
    <motion.div className="flex w-full h-auto items-center justify-center">
        {channels.length === 0  ? <div className="flex  w-full justify-center"><p className="text-xs">No channels found</p> </div>:
        
            <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               

                {channels.map((channel, _)=>(

                    <SearchChannelCard 
                      userIsOverage={user !== null && user?.age >= 18} 
                      onJoin={handleChannelJoined} 
                      infoClicked={handleOnInfoClicked} 
                      key={channel.id} 
                      channel={channel} 
                    />

                ))}

                


          
            </div>
            
        }
        
    </motion.div>
  );
};

const Background = () => {

    const {layout} = useLayoutStore();

  return (
 
  <>
        <div 
        style={{width: layout.sideBarExpanded
              ? "calc(100% - 300px)"
              : "calc(100% - 50px)", 
            height: "100vh"}}
        className=" absolute overflow-hidden flex items-center justify-center">
          <p
            style={{ fontSize: "1700px", lineHeight: 1,  }}
            className=" select-none z-[0] opacity-60 rotate-[-40deg] outlined-text rainbow rainbow_text_animated font-bold"
          >
            S
          </p>
             <div className="w-full backdrop-opacity-90 h-full backdrop-blur-xl absolute z-[1]">
            <div className="grain w-4 h-4 absolute inset-0"></div>

        </div>
        </div>
    </>
  )
}
