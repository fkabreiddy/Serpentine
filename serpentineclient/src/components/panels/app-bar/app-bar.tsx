import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useAuthStore } from "@/contexts/authentication-context";
import { Spinner } from "@heroui/spinner";
import { useCloseSession } from "@/hooks/user-hooks";
import IconButton from "@/components/common/icon-button";
import { ThemeSwitch } from "@/components/theme-switch";
import { Compass, Home, Inbox, PlugIcon, Settings2, TestTubeIcon } from "lucide-react";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { HubConnectionState } from "@microsoft/signalr";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import CrosshatchPattern from "@/components/common/crosshatch-pattern";
import { useNavigate } from "react-router-dom";
import UserAvatar from "@/components/users/common/user-avatar";
import { useActiveUser, useActiveUsersActions } from "@/helpers/active-user-hub";
import { useTest } from "@/hooks/channel-member-hooks";
import { useLayoutStore } from "@/contexts/layout-context";
import { useUiSound } from "@/helpers/sound-helper";

interface ProfilePanelProps {}

const AppBar: React.FC<ProfilePanelProps> = () => {

  
  const {} = useActiveUser();
  const navigate = useNavigate();
  const {layout} = useLayoutStore();
  const {playUiSound} = useUiSound();

  const {fetching, test} = useTest();

  async function tryTest()
  {
    await test({typeOfResponse: "validation"});
  }

  useEffect(()=>{
          playUiSound("system/boot_up")

  },[])



  return (
    <nav
      id="app-bar"
      className=" z-[30]  bg-white dark:bg-neutral-950/50   sticky top-0 w-full    border-b border-default-100 flex items-center px-4 py-3 max-md:justify-end justify-between gap-3 h-fit transition-all"
    >
      <div className="absolute inset-0 w-full h-full backdrop-blur-xl backdrop-opacity-70   z-[-1]" />

      <CrosshatchPattern />

      <div />

      <div className=" flex  items-center justify-end gap-4 ">
        <IconButton tooltipText="Test" onClick={() => tryTest()}>
          <TestTubeIcon size={20}/>
        </IconButton>
        <HomeIcon/>
        <ExploreIcon />
        <ThemeSwitch />

        <NotificationsIcon />

        <AvatarDropdown />
      </div>
    </nav>
  );
};

const NotificationsIcon = () => (
  <IconButton onClick={() => {}} tooltipText="Notifications">
    <motion.div
      key="notifications-icon"
      whileHover={{ rotate: 30 }}
      animate={{ rotate: 0 }}
      exit={{ rotate: -30 }}
      className="flex  relative"
    >
     <Inbox size={20}/>
    </motion.div>
  </IconButton>
);

const HomeIcon = () => {

  const navigate = useNavigate();
  return(
    <IconButton onClick={() => {navigate("/home")}} tooltipText="Notifications">
      <motion.div
        key="notifications-icon"
        whileHover={{  }}
        animate={{ }}
        exit={{ }}
        className="flex  relative"
      >
      <Home size={20}/>
      </motion.div>
    </IconButton>
  )
};



const ExploreIcon = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      onClick={() => {
        navigate("/explore");
      }}
      tooltipText="Explore"
    >
      <motion.div
        key="compass-icon"
        whileHover={{ rotate: 90 }}
        animate={{ rotate: 0 }}
        exit={{ rotate: -30 }}
        className="flex  relative"
      >
        <Compass size={20} />
      </motion.div>
    </IconButton>
  );
};


const AvatarDropdown = () => {


  const {closeSession} = useCloseSession();

  const { user, isAuthenticated } = useAuthStore();

  const { activeUserHubConnectionState } = useActiveUserHubStore();

  const getConnectionStateText = () : string => {
    switch (activeUserHubConnectionState) {
      case HubConnectionState.Connected:
        return "ring-green-600";
      case HubConnectionState.Disconnected:
        return "ring-red-6000";
      case HubConnectionState.Reconnecting:
        return "ring-yellow-600";
      default:
        return "dark:ring-neutral-800 ring-neutral-300";
    }
  };

  
  return (
    <Dropdown placement="bottom-end" showArrow={true} className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  ">
      <DropdownTrigger>
                 <div>

                    {isAuthenticated && user !== null && (
                    
                      <UserAvatar isBlurred={true} src={user.profilePictureUrl ?? null} connectionColor={getConnectionStateText()}/>

                      
                    )}
                 </div>

      </DropdownTrigger>
      <DropdownMenu className="border-neutral-500"  variant="flat" disabledKeys={["connectionInfo", "divider1", "divider2"]} aria-label="user actions">
        <DropdownItem key="connectionInfo" isReadOnly={true}>

          <div className="w-full flex gap-3 items-center justify-between">
           
                <p className="text-[13px] font-semibold">@{user?.username}</p>



            {(() => {
              switch (activeUserHubConnectionState) {
                case HubConnectionState.Connected:
                  return (
                    <div className="bg-green-600 size-[6px] rounded-full text-xs font-semibold" />
                  );
                case HubConnectionState.Disconnected:
                  return (
                    <div className="bg-red-600 size-[6px] rounded-full font-semibold" />
                  );
                case HubConnectionState.Reconnecting:
                  return <Spinner size="sm" variant="spinner" />;
                default:
                  return <div className="text-gray-500 text-xs">Unknown</div>;
              }
            })()}
          </div>
        </DropdownItem>

        <DropdownItem
        key="divider1">
          <hr className="w-full border-neutral-300 dark:border-neutral-800 border-t" />
        </DropdownItem>

        <DropdownItem
          key="settings"
          onClick={()=>{closeSession();}}
          endContent={<Settings2 className="size-[16px] shrink-0" />}
        >
          <p className="text-[13px] font-normal">Settings</p>

        </DropdownItem>

        <DropdownItem
        key="divider2">
          <hr className="w-full border-neutral-300 dark:border-neutral-800 border-t" />
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          onClick={()=>{closeSession();}}
          endContent={<PlugIcon className="size-[16px] shrink-0" />}
        >
          <p className="text-[13px] font-normal">Logout</p>

        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AppBar;
