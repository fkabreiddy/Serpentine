import React, {useState} from "react";
import GroupCardMini from "../groups/group-card-mini";
import { picture } from "motion/react-client";
import ChannelCardMenu from "./channel-card-menu";

interface ChannelCardProps{
    index : number,
    name : string
}

const ChannelCard:React.FC<ChannelCardProps> = ({index, name}) =>{

    const [selected, setSelected] = useState(false);

    const pictures : string[] = [
          "https://img.freepik.com/premium-vector/vector-abstract-grainy-texture-gradient-background_296715-733.jpg", 
          "https://img.freepik.com/premium-vector/grainy-gradient-background_708845-170.jpg", 
          "https://img.freepik.com/premium-vector/grainy-gradient-background-vector_115083-875.jpg",
        "https://www.misha.studio/blog/creating-grainy-gradients/assets/cover-16x9.png"]



    return(
    <>
        {selected && (
            <div
                className="fixed inset-0 backdrop-blur-xl z-[1]"
                onClick={() => setSelected(false)}
            />
        )}

        <ChannelCardMenu  isOpen={selected} >
              <div  onContextMenu={(e) =>  {e.preventDefault(); setSelected(true);}}  className={`flex w-full max-w-full ${selected ? "relative z-50 scale-[105%] bg-default-100/50 border-none rounded-xl" : "hover:scale-[103%] z-[-1]"}   flex-col gap-4 border-b   hover:bg-default-50/50 transition-all cursor-pointer border-b-default-100 py-4 px-4`}>
                <div className="flex items-start w-full max-w-full gap-3 justify-between">
                    <div className="flex flex-col">
                        <p className="text-[13px] font-semibold opacity-80 line-clamp-1 text-ellipsis  max-w-full break-words  ">#{name}</p>
                        <span className="text-[11px]  opacity-30">Id.01321312</span>

                    </div>
                    <div className="flex items-center gap-3">
                        <Mute/>

                    </div>
                </div>

                <div className="flex items-center gap-3">
                    
                    {[...Array(4)].map((_, i) => (
                    <React.Fragment key={`mini-${i}`}>
                        {i === 1 && <div key={`dot-left-${i}`} className="rounded-full bg-default-300 w-1 h-1"></div>}
                        <GroupCardMini key={`group-${i}`} cover={pictures[i]} index={i} />
                        {i === 3 && <div key={`dot-right-${i}`} className="rounded-full bg-default-300 w-1 h-1"></div>}
                    </React.Fragment>
                    ))}
                    <p className="text-xs font-semibold opacity-45">+3</p>
                </div>
            </div>
            
        </ChannelCardMenu>

       
    
         
     
    </>
       
    )
}





const Mute = () => (

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-[17px] opacity-20">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
</svg>


)
export default ChannelCard;