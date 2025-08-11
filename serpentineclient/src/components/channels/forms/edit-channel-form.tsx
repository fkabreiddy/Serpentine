import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { showToast } from "@/helpers/sonner-helper";
import {useDeleteChannel, useGetChannelById, useUpdateChannel} from "@/hooks/channel-hooks";
import { UpdateChannelRequest, updateChannelSchema } from "@/models/requests/channels/update-channel-request";
import { RightPanelView } from "@/models/right-panel-view";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";


export default function EditChannelForm(){


    const {updateChannelId, setUpdateChannelid, setUpdatedChannel: setUpdatedChannelOnStore} = useGlobalDataStore();
    const {getChannelById, channel, loadingChannel} = useGetChannelById();
    const {setLayout} = useLayoutStore();
    const {updatedChannel, updateChannel, updatingChannel} = useUpdateChannel();

    async function fetchChannel(channelId: string){

        await getChannelById({channelId: channelId});
    }

    async function fetchUpdate(data: UpdateChannelRequest){

        await updateChannel(data);

    }

    useEffect(()=>{


        if(!updateChannelId) return;

        fetchChannel(updateChannelId);
        

        return()=>{
            setUpdateChannelid(null)
        }


            
    },[updateChannelId])


    useEffect(()=>{

        if(!channel) return;
        if(!channel.myMember || (channel.myMember && (!channel.myMember.isOwner || channel.myMember.isAdmin))){
 
            showToast({ description: "You dont have permisson to do this action", color: "danger"})
            setUpdateChannelid(null);
            setLayout({currentRightPanelView: RightPanelView.DefaultView});
            return;
        }

        setValue("name", channel.name);
        setValue("adultContent", channel.adultContent);
        setValue("description", channel.description);
        setValue("channelId", channel.id);

    },[channel])

    useEffect(()=>{

        if(!updatedChannel) return;

        setUpdatedChannelOnStore(updatedChannel);
        showToast({description: "Changes will be available soon"});
        setUpdateChannelid(null);
        setLayout({currentRightPanelView: RightPanelView.DefaultView})

    },[updatedChannel])



    
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
      } = useForm({
        resolver: zodResolver(updateChannelSchema),
        mode: "onChange",
        defaultValues: {
          adultContent: false,
          description: "",
          name: "",
        },
      });

      if(!channel) return <div className="w-full justify-center flex h-screen"><Spinner size="sm" variant="spinner"/></div>
    return(
        <>
        <div className="">
            <h2 className="text-md font-semibold max-md:text-center">
            Updating a Channel
            </h2>
            <p className="text-xs opacity-45 max-md:text-center">
            You are updating the channel <strong>#{channel.name}</strong>. Changes will be available in a while. If you don't see changes try reloading the app.
            </p>
      </div>
  <form
        onSubmit={handleSubmit((data) => fetchUpdate(data))}
        className="w-full relative  flex flex-col gap-3 mt-4"
      >
        
          
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
          isDisabled={!isValid || updatingChannel}
          type="submit"
          isLoading={updatingChannel}
          className={`w-full backdrop-blur-xl bg-default-100/80  max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
        >
          <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
          Update Channel
        </Button>
      </form>
        
        </>
      
    )
}

