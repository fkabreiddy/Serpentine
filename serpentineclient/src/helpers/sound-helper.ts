import { playSound } from "react-sounds"



export const useUiSound = () =>{

    const playUiSound = (soundName: string) => playSound(soundName, {volume: 0.3})
    
    return{
        playUiSound
    }


}