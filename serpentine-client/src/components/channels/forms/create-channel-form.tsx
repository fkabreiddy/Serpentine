import { ChannelResponse } from "@/models/responses/channel-response";
import { Input, Textarea } from "@heroui/input";
import React, { useEffect, useState, useRef } from "react";
import { useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import {Checkbox} from "@heroui/checkbox"
import { useCreateChannel } from "@/hooks/channel-hooks";
import { CreateChannelRequest, createChannelSchema } from "@/models/requests/channels/create-channel-request";
import Avatar from "boring-avatars";
import IconButton from "@/components/common/icon-button";
import { AppWindowMacIcon, ImageIcon } from "lucide-react";
import Noise from "@/components/common/noise-ext";
interface CreateChannelFormProps {

    onCreate: (channel: ChannelResponse) => void;
}

type FileType = File;



const CreateChannelForm: React.FC<CreateChannelFormProps> = ({onCreate}) => {

    const {channel, createChannel, creatingChannel} = useCreateChannel();
    const coverInput = useRef<HTMLInputElement>(null);
    const bannerInput = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(createChannelSchema),
        mode: "onChange",
        defaultValues: {
            adultContent: false,
            description: "",
            name: "",
            bannerPictureFile: null,
            coverPictureFile: null
        }
    });

   

    const handleCoverInputClicked = () => {
        coverInput.current?.click();
    
    };

    const handleBannerInputClicked = () => {
        bannerInput.current?.click();
    
    };

    const submit = async (data:  CreateChannelRequest) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File || value === null) {
                if (value) formData.append(key, value);
            } else {
                formData.append(key, value as string);
            }
        });
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        await createChannel(formData as any);
           
    };

    

    const handleFileChanged = (event: React.ChangeEvent<HTMLInputElement>, field: "name" | "description" | "adultContent" | "coverPictureFile" | "bannerPictureFile") => {
        const file = event.target.files?.[0];
        processFile(file, field);
        
    };

     const handleFileRemoved = ( field: "name" | "description" | "adultContent" | "coverPictureFile" | "bannerPictureFile") => {
        
        if(field === "coverPictureFile" || field === "bannerPictureFile") {
            setValue(field, null);

            field === "coverPictureFile" ? coverInput.current!.value = "" : bannerInput.current!.value = "";

        }
        
    };
    
    
   const processFile = (file: File | null | undefined, field: "name" | "description" | "adultContent" | "coverPictureFile" | "bannerPictureFile") => {
         if (file) {
                const allowedExtensions = ['jpg', 'png', 'webp', 'img', 'jpge'];
                const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

                const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
                if(file.size > maxSizeInBytes) {
                    return;
                }

                if(!fileExtension || !allowedExtensions.includes(fileExtension)) {
                    return;

                }
                
                if(field === "coverPictureFile" || field === "bannerPictureFile") {
                    setValue(field, file);

                }
               
    



                

                
            }
    }

  

  

    useEffect(()=>{

        
        if(channel)
        {
            onCreate(channel);

        }

    },[channel])
        
        

    return (
        <div className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4">
            <input
                onChange={(e) => handleFileChanged(e, "coverPictureFile")}
                type="file"
                ref={coverInput}
                accept="image/png, image/jpeg, image/webp, image/jpg"
                multiple={false}
                max={1}
                
                className="hidden"
            />

            <input
                onChange={(e) => handleFileChanged(e, "bannerPictureFile")}
                type="file"
                ref={bannerInput}
                accept="image/png, image/jpeg, image/webp, image/jpg"
                multiple={false}
                max={1}
                className="hidden"
            />

            <div className="">
                <h2 className="text-md font-semibold max-md:text-center">Creating a Channel</h2>
                <p className="text-xs opacity-45 max-md:text-center">Creating a channel makes you the owner of it. Be sure that your channel name is unique when creating it. You can change any information previously</p>
            </div>
           
              <form onSubmit={handleSubmit(data => submit(data))}  className="w-full relative  flex flex-col gap-3 mt-4">
                
                <div className="flex flex-col w-full gap-2 relative mt-2 mb-2">
                    <Banner file={ watch("bannerPictureFile") as FileType} />
                    {watch("coverPictureFile") ? <CoverAvatar file={watch("coverPictureFile") as FileType}  /> : <Avatar className="transition-all absolute border-white border-3 dark:border-black rounded-full -bottom-[10px] right-[30px]" name={( watch("name") !== "") ? watch("name") : "awesomechannel" } size={60} variant="marble"/> }
                    
                </div>
               <div className="flex items-center gap-2 mb-4">
                        <IconButton type="button"  onClick={() => watch("coverPictureFile") ? handleFileRemoved("coverPictureFile") : handleCoverInputClicked} tooltipText={"Change cover picture"} className="bg-default-100/80 hover:bg-default-100/90 dark:bg-neutral-950/80 dark:hover:bg-neutral-950/90" >
                            <ImageIcon
                                className= {`size-[18px] ${watch("coverPictureFile") ? "text-red-500" : ""}`}
                                onClick={handleCoverInputClicked}
                                />
                        </IconButton>
                        <IconButton type="button" onClick={() => watch("bannerPictureFile") ? handleFileRemoved("bannerPictureFile") : handleBannerInputClicked} tooltipText={"Change banner picture"} className="bg-default-100/80 hover:bg-default-100/90 dark:bg-neutral-950/80 dark:hover:bg-neutral-950/90" >
                            <AppWindowMacIcon
                                className= {`size-[18px] ${watch("bannerPictureFile") ? "text-red-500" : ""}`}
                                onClick={handleBannerInputClicked}
                                />
                        </IconButton>
                    </div>
              
              <Input
                    label="Channel name"
                    type="text"
                    placeholder="my_awesome_channel"
                    minLength={3}
                    maxLength={100}
                    value={watch("name")}
                    labelPlacement="outside"
                    id={"channelName-input"}
                    isRequired={true}
                    autoComplete="channelName"
                    description="Must be just letters, numbers, underscores and dots."
                    {...register("name")}
                    errorMessage={errors.name?.message}
                    isInvalid={errors.name?.message !== undefined}
                />

                <Textarea
                    label="Channel description"
                    type="text"
                    placeholder="Type something"
                    minLength={10}
                    maxLength={500}
                    value={watch("description")}
                    maxRows={4}
                    labelPlacement="outside"
                    isRequired={true}
                    isClearable={true}                    
                    id={"channelDescription-input"}

                    autoComplete="channelDescription"
                    description="Be as clear as possible about you channel and the rules."
                    {...register("description")}
                    errorMessage={errors.description?.message}
                    isInvalid={errors.description?.message !== undefined}
                />


                <Checkbox 
                    isSelected={watch("adultContent")} 
                    {...register("adultContent")} 
                    size="sm"
                    id={"hasAdultContent-checkBox"}
                >
                    Has adult content
                </Checkbox>
                <p className="text-xs opacity-45">Adult content channels must not be visible for some users.</p>

                
                <Button
                    isDisabled={!isValid || creatingChannel}
                    type="submit"
                    isLoading={creatingChannel}
                    className={`w-full backdrop-blur-xl bg-default-100/80  max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
                >
                    <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
                    Create Channel
                </Button>
            
                 
            </form>

            
            
        </div>
    );
};

interface CoverAvatarProps {
    file: File | null; 
}

const CoverAvatar: React.FC<CoverAvatarProps> = ({ file }) => (
       
         <img
            className="rounded-full absolute border-white  dark:border-black -bottom-[10px] right-[30px] cursor-pointer bg-default-100  object-cover flex-shrink-0 max-h-[60px] max-w-[60px] min-h-[60px] min-w-[60px]"
            src={file instanceof File ? window.URL.createObjectURL(file) : ""}   
          
        />
        
        
       
                              
)

interface BannerProps {
    file: File | null; 
    
}

const Banner: React.FC<BannerProps> = ({ file }) => (
    <div className="w-full rounded-md dark:bg-neutral-950 bg-neutral-100  h-[100px] ">
        {file ?
            <img
    
    
            className="rounded-sm w-full h-full    object-cover flex-shrink-0 "
            src={file instanceof File ? window.URL.createObjectURL(file) : ""}            
    
         />  :
         <Noise
         
         
            patternSize={250}
            patternScaleX={0}
            patternScaleY={0}
            patternRefreshInterval={2}
            patternAlpha={10}
            height="100%"
            width="100%"
        />
        }
         
    </div>
   
       
                              
)

export default CreateChannelForm;