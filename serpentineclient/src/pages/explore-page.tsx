import SearchChannelCard from "@/components/channels/common/search-channel-card";
import IconButton from "@/components/common/icon-button";
import SerpentineBanner from "@/components/common/serpentine-banner";
import WarmBeigeBg from "@/components/common/warm-beige-bg";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { useGetManyChannelsByNameOrId } from "@/hooks/channel-hooks";
import { ChannelResponse } from "@/models/responses/channel-response";
import { RightPanelView } from "@/models/right-panel-view";
import { Badge, Input, Spinner, Tab, Tabs } from "@heroui/react";
import { channel } from "diagnostics_channel";
import { Search, SearchIcon, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ExplorePage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [hideTabs, setHideTabs] = useState(false);
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

          <div className="w-full h-screen max-h-screen relative  max-sm:h-fit flex max-sm:flex-col items-center justify-center ">
              <Background/>

              <div className="flex flex-col z-[10]  overflow-auto  p-3 w-[90%]  top-0">
                  <h1 className="text-3xl text-center mt-3 font-normal opacity-80">
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
                          <Tab key="channels" className="flex w-full max-md:w-[90%]" title="Channels">
                              <ChannelsResults filter={searchText}/>
                          </Tab>
                          <Tab key="users" title="Users" />
                      </Tabs>
                  </div>

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
  const { layout, setLayout } = useLayoutStore();

  const { getManyChannelsByNameOrId, channels, loadingChannels } = useGetManyChannelsByNameOrId();

    useEffect(()=>{

        const fetch = async () => {

            await getManyChannelsByNameOrId({channelName: filter, channelId: null});
        }

        fetch();

    },[filter])

    function handleChannelJoined(channel: ChannelResponse){

      setChannelJoined(channel);
    }
    
    function handleOnInfoClicked(channelId:string){

        setChannelInfoId(channelId);
        setLayout({currentRightPanelView: RightPanelView.ChannelInfo});
    }

if(loadingChannels) return <div className="flex  w-full justify-center"> <Spinner size="sm" variant="spinner"/></div>;
  return (
    <motion.div className="flex w-full items-center justify-center">
        {channels.length === 0  ? <div className="flex  w-full justify-center"><p className="text-xs">No channels found</p> </div>:
        
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               

                {channels.map((channel, index)=>(

                    <SearchChannelCard onJoin={handleChannelJoined} infoClicked={handleOnInfoClicked} key={channel.id} channel={channel} />

                ))}

                


          
            </div>
            
        }
        
    </motion.div>
  );
};

const Background = () => (
  <>
      <motion.div className="absolute overflow-hidden inset-0 z-[0] w-full h-screen pointer-events-none flex justify-center items-center">
        <p
          style={{ fontSize: "1700px", lineHeight: 1 }}
          className="select-none opacity-60 rotate-[-40deg] outlined-text rainbow rainbow_text_animated font-bold"
        >
          S
        </p>
      </motion.div>
    <div className="w-full  backdrop-opacity-90 h-screen inset-0 top-0 right-0 backdrop-blur-xl absolute z-[1]">
      <div className="grain h-full w-full absolute  inset-0"></div>
    </div>
  </>
);
