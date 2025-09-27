import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateGroupRequest,
  createGroupSchema,
} from "@/models/requests/groups/create-group-request.ts";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { useGlobalDataStore } from "@/contexts/global-data-context.ts";
import { useCreateGroup } from "@/hooks/group-hooks.ts";
import { motion } from "motion/react";
import { FormView } from "@/models/utils";
import IconButton from "@/components/common/icon-button";
import { X } from "lucide-react";
import { useRightPanelViewData } from "@/contexts/right-panel-view-data";
import RightViewHeader from "@/components/panels/right-panel/right-view-header";


export default function CreateGroupForm({ onDone }: FormView) {
  const {rightPanelData} = useRightPanelViewData(); 
  const {setCreatedGroup} = useGlobalDataStore(); 
  const { creatingGroup, group, createGroup } = useCreateGroup();
  const [componentIsReady, setComponentIsReady] = useState(false);



  useEffect(() => {

    if(!group) return;
    setCreatedGroup(group);
    
    if (group) {
      onDone();
    }
  }, [group]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(createGroupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      public: true,
      channelId: "",
      requiresOverage: false
    },
  });

  const submit = async (data: CreateGroupRequest) => {
    await createGroup(data);
  };

  useEffect(() => {
    if (rightPanelData.createGroupChannelData?.id) {
      setValue("channelId", rightPanelData.createGroupChannelData?.id);
      setComponentIsReady(true);
    }

   
  }, [rightPanelData.createGroupChannelData]);
  
  return (
    <>
      {componentIsReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
         className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4"

        >

          <RightViewHeader 
              title={"Creating a Group"} 
              description={`You are creating a group for the channel: ${rightPanelData.createGroupChannelData?.name} Be sure
              that your group name is unique in your channel. You can change any
              information previously`}
              onClose={onDone}
            />
          

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
              isDisabled={!isValid || creatingGroup}
              type="submit"
              
              isLoading={creatingGroup}
              className={`w-full backdrop-blur-xl bg-blue-600 text-white  max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
            >
              Create Group
            </Button>
          </form>
        </motion.div>
      )}
    </>
  );
}
