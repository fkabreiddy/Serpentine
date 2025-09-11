import { Input, Textarea } from "@heroui/input";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { useCreateChannel } from "@/hooks/channel-hooks";
import {
  CreateChannelRequest,
  createChannelSchema,
} from "@/models/requests/channels/create-channel-request";
import { showToast } from "@/helpers/sonner-helper";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import {ChannelBanner} from "@/components/channels/common/channel-banner.tsx";
import ChannelCover from "@/components/channels/common/channel-cover.tsx";
import { FormView } from "@/models/utils";
import IconButton from "@/components/common/icon-button";
import { X } from "lucide-react";


export default function CreateChannelForm({onDone}:FormView){
  const { channel, createChannel, creatingChannel } = useCreateChannel();
  const { setCreatedChannel } = useGlobalDataStore();
  const [componentIsReady, setComponentIsReady] = useState<boolean>(false);

  useEffect(()=>{
    setComponentIsReady(true);
  },[])

  useEffect(() => {
    if (channel) {
      setCreatedChannel(null);
      setCreatedChannel(channel);
      onDone();
      
    }
  }, [channel]);

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
      coverPictureFile: null,
    },
  });

 
  const submit = async (data: CreateChannelRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File || value === null) {
        if (value) formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });
    
    await createChannel(formData as any);
  };

  

  

  if(!componentIsReady) return(<></>);

  return (
    <div className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4">

       <div className="absolute top-2 right-2">
          <IconButton tooltipText="Close" onClick={onDone}>
            <X className="size-[18px]" />
          </IconButton>
        </div>
      

      <div className="">
        <h2 className="text-md font-semibold max-md:text-center">
          Creating a Channel
        </h2>
        <p className="text-xs opacity-45 max-md:text-center">
          Creating a channel makes you the owner of it. Be sure that your
          channel name is unique when creating it. You can change any
          information previously
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => submit(data))}
        className="w-full relative  flex flex-col gap-3 mt-4"
      >
        
        <ChannelBannerAndCoverForm onBannerChanged={(x) => setValue("bannerPictureFile", x)} onCoverChanged={(x) => setValue("coverPictureFile", x)} channelName={watch("name")}/>

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
        <p className="text-xs opacity-45">
          Adult content channels must not be visible for some users.
        </p>

        <Button
          isDisabled={!isValid || creatingChannel}
          type="submit"
          isLoading={creatingChannel}
          className={`w-full backdrop-blur-xl bg-blue-600 text-white  max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
        >
          Create Channel
        </Button>
      </form>
    </div>
  );
};



type FileType = File;


interface ChannelBannerAndCoverFormProps{
  onBannerChanged: (file: FileType | null) => void;
  onCoverChanged: (file: FileType | null) => void;
  channelName?: string | null
}




function ChannelBannerAndCoverForm({onBannerChanged, onCoverChanged, channelName}:ChannelBannerAndCoverFormProps){

  const coverInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<FileType | null>(null);
  const [coverFile, setCoverFile] = useState<FileType | null>(null);
  const handleCoverInputClicked = () => {
    coverInput.current?.click();
  };

  const handleBannerInputClicked = () => {
    bannerInput.current?.click();
  };


  const handleFileChanged = (
      event: React.ChangeEvent<HTMLInputElement>,
      field: string,
  ) => {
    const file = event.target.files?.[0];
    proccessImage(file, field);
  };

  const getChannelBanner = (): string =>{

    if(bannerFile) {
      return URL.createObjectURL(bannerFile);
    }
    
    return "";
    
  }

  const getChannelCover = (): string =>{

    if(coverFile) {
      return URL.createObjectURL(coverFile);
    }
    
    return "";
    
  }




  const handleFileRemoved = (
      field: string

  ) => {

    if(field === "coverPictureFile")
    {
      (coverInput.current!.value = "");
      setCoverFile(null);
      onCoverChanged(null);
    }
    else if(field === "bannerPictureFile")
    {
      (bannerInput.current!.value = "");
      setBannerFile(null);
      onBannerChanged(null);
    }
  };

  const proccessImage = (
      file: File | null | undefined,
      field: string

  ) => {
    if (file) {
      const allowedExtensions = ["jpg", "png", "webp", "img", "jpeg"];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        showToast({
          title: "Invalid file type",
          description: "Please select a valid image file (jpg, png, jpeg, webp).",
        });
        return;
      }
      if (file.size > maxSizeInBytes) {
        showToast({
          title: "Image too large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }

      if(field === "coverPictureFile")
      {
        setCoverFile(file);
        onCoverChanged(file);
      }
      else if(field === "bannerPictureFile")
      {
        setBannerFile(file);
        onBannerChanged(file);
      }
    }
  };
  
  
  
  const onCoverPictureClicked = () =>{
    
    if(!coverFile)
    {
      handleCoverInputClicked();
    }
    else {
       handleFileRemoved("coverPictureFile");
    }
  }

  const onBannerPictureClicked = () =>{

    if(!bannerFile)
    {
      handleBannerInputClicked();
    }
    else {
      handleFileRemoved("bannerPictureFile");
    }
  }


  return(

      <>

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

        <div className="flex flex-col w-full h-fit gap-2 relative mt-2 mb-2">
          <ChannelBanner pictureUrl={getChannelBanner()}/>
          <ChannelCover pictureUrl={getChannelCover()} channelName={channelName ?? ""} isSmall={false} absolute={true}/>
        </div>
        <div className={"flex w-full items-center gap-3 mb-4"}>
          <Button onPress={() => onCoverPictureClicked()} color={coverFile ? "danger" : "default"}  size={"sm"} radius={"md"}>
            <p className={"text-xs"}>{coverFile ? "Remove" : "Upload"} cover</p>
          </Button>
          <Button onPress={() => onBannerPictureClicked()} color={bannerFile ? "danger" : "default"}  size={"sm"} radius={"md"}>
            <p className={"text-xs"}>{bannerFile ? "Remove" : "Upload"} banner</p>
          </Button>
        </div>
      </>
  )

}

