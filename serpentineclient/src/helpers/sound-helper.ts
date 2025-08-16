import { useCallback } from "react"
import { playSound } from "react-sounds"



export const useUiSound = () =>{



    const playStartUp = useCallback(()=>playSound("system/boot_up", {volume: 0.3}),[]);

    const playUiSound = (soundName: string) => playSound(soundName, {volume: 0.3});
    const playSubmit =  useCallback(()=> playSound("ui/submit", {volume: 0.3}),[]);

    return{
        playUiSound,
        
        playStartUp,
        playSubmit
    }


}