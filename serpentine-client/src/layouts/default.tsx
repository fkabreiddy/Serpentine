import ChannelsPanel from "@/components/panels/channels-panel";
import ProfilePanel from "@/components/panels/profile-panel";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative max-md:flex-col flex w-screen  h-screen">

        <ProfilePanel/>
        <ChannelsPanel/>
        <div className="w-[70%]  max-md:w-0">
          {children}

        </div>
    
      
    </div>
  );
}
