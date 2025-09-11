import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { useGlobalDataStore } from "@/contexts/global-data-context.ts";
import { useCreateGroup, useUpdateGroup } from "@/hooks/group-hooks.ts";
import { motion } from "motion/react";
import { UpdateGroupRequest, updateGroupSchema } from "@/models/requests/groups/update-group-request";
import { useGetChannelMemberByUserAndChannelId } from "@/hooks/channel-member-hooks";
import { useAuthStore } from "@/contexts/authentication-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { RightPanelView } from "@/models/right-panel-view";
import { Spinner } from "@heroui/react";
import { FormView } from "@/models/utils";
import IconButton from "@/components/common/icon-button";
import { X } from "lucide-react";


export default function UpdateGroupForm({ onDone }: FormView) {
  const { groupToUpdate, setUpdatedGroup: contextSetUpdatedGroup } =useGlobalDataStore();
  const {setLayout} = useLayoutStore();
  const { updateGroup, updatingGroup, updatedGroup } = useUpdateGroup();
  const {getChannelMemberByUserAndChannelId, channelMember} = useGetChannelMemberByUserAndChannelId();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [componentReady, setComponentReady] = useState<boolean>(false)

  //functions

  async function fetchGetMembership(data:GetChannelMemberByChannelAndUserIdRequest)
  {
    await getChannelMemberByUserAndChannelId(data);
  }


  
  //flow

  //first lets fetch the permission to see if the user is an admin or the owner of the channel

  useEffect(()=>{

    if(!groupToUpdate) return;

    fetchGetMembership({channelId: groupToUpdate.channelId});

  
   
  },[ groupToUpdate])

  //if user is not and admin and if is not the owner whe kick'em out
  useEffect(()=>{
    if(channelMember)
    {
        if(!channelMember.isOwner && !channelMember.isAdmin)
        {
            setLayout({currentRightPanelView: RightPanelView.DefaultView});
        }
        else
        {
            setHasPermission(true);
        }
    }
  },[channelMember])

  //otherwise we set the properties to the schema and say the component is ready to show the form

  useEffect(()=>{

    if(hasPermission && groupToUpdate)
    {
        setValue("name", groupToUpdate.name);
        setValue("groupId", groupToUpdate.id);
        setValue("public", groupToUpdate.public);
        setValue("requiresOverage", groupToUpdate.requiresOverage);
        setComponentReady(true);
    }

   

   
  },[hasPermission, groupToUpdate])

  
  useEffect(()=>{
    if(updatedGroup)
    {
      contextSetUpdatedGroup(updatedGroup);
      onDone();
    }
  },[updatedGroup])


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(updateGroupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      public: true,
      groupId: "",
      requiresOverage: false
    },
  });

  const submit = async (data: UpdateGroupRequest) => {

    await updateGroup(data);
  };

 if(!componentReady) return (<div className="w-full h-full flex justify-center items-center"><Spinner variant="spinner" size="sm"/></div>);
  return (
    <>
      {componentReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
         className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4"

        >
            <div className="absolute top-2 right-2">
                <IconButton tooltipText="Close" onClick={onDone}>
                    <X className="size-[18px]" />
                </IconButton>
            </div>
          <div className="">
            <h2 className="text-md font-semibold max-md:text-center">
              Updating a Group
            </h2>
            <p className="text-xs opacity-45 max-md:text-center">
              You are updating the group:{" "}
              <strong>{groupToUpdate?.name}</strong>. Be sure
              that your group name is unique in your channel. You can change any
              information previously
            </p>
          </div>

          <form
            onSubmit={handleSubmit((data) => submit(data))}
            className="w-full relative  flex flex-col gap-3 mt-4"
          >
            <Input
              label="Group name"
              type="text"
              placeholder="good_group"
              minLength={3}
              maxLength={30}
              value={watch("name")}
              labelPlacement="outside"
              isRequired={true}
              autoComplete="groupName"
              description="Must be just letters, numbers and underscores."
              {...register("name")}
              errorMessage={errors.name?.message}
              isInvalid={errors.name?.message !== undefined}
            />

          

            <Checkbox
              isSelected={watch("public")}
              {...register("public")}
              size="sm"
              color="default"
            >
              Is Public
            </Checkbox>
            <p className="text-xs opacity-45">
              If public every member of this channel can post on it.
            </p>

            <Checkbox
                isSelected={watch("requiresOverage")}
                {...register("requiresOverage")}
                size="sm"
                color="default"
            >
             Requires to be overage
            </Checkbox>
            <p className="text-xs opacity-45">
              This will allow to only overage members can send messages through this group
            </p>
            
            

            <Button
              isDisabled={!isValid || updatingGroup}
              type="submit"
              
              isLoading={updatingGroup}
              className={`w-full backdrop-blur-xl bg-blue-600 text-white  max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
            >
                Save changes
            </Button>
          </form>
        </motion.div>
      )}
    </>
  );
}
