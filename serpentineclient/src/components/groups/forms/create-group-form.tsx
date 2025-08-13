import { useEffect } from "react";
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

interface CreateGroupFormProps {
  onCreate: () => void;
}

export default function CreateGroupForm({ onCreate }: CreateGroupFormProps) {
  const { createChannelGroupData, setCreateGroupChannelData, setCreatedGroup } =
    useGlobalDataStore();
  const { creatingGroup, group, createGroup } = useCreateGroup();

  useEffect(() => {
    setCreatedGroup(group);
    setCreateGroupChannelData(null);
    if (group) {
      onCreate();
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
      rules: "",
      public: true,
      channelId: "",
    },
  });

  const submit = async (data: CreateGroupRequest) => {
    await createGroup(data);
  };

  useEffect(() => {
    if (createChannelGroupData?.channelId) {
      setValue("channelId", createChannelGroupData.channelId);
      setCreateGroupChannelData(createChannelGroupData);
    }
  }, [createChannelGroupData]);
  return (
    <>
      {createChannelGroupData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
         className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4"

        >
          <div className="">
            <h2 className="text-md font-semibold max-md:text-center">
              Creating a Group
            </h2>
            <p className="text-xs opacity-45 max-md:text-center">
              You are creating a group for channel :{" "}
              <strong>#{createChannelGroupData?.channelName}</strong>. Be sure
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

            <Textarea
              label="Group Rules"
              type="text"
              placeholder="Describe the rules of you group"
              minLength={10}
              maxLength={1000}
              value={watch("rules")}
              maxRows={4}
              labelPlacement="outside"
              isRequired={true}
              isClearable={true}
              autoComplete="groupRules"
              description="Be as clear as possible about you group and the rules."
              {...register("rules")}
              errorMessage={errors.rules?.message}
              isInvalid={errors.rules?.message !== undefined}
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
