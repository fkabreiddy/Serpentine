import { ChannelResponse } from "@/models/responses/channel-response";
import { Input, Textarea } from "@heroui/input";
import React, { useEffect, useState } from "react";
import {z} from "zod"
import { useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import {Checkbox} from "@heroui/checkbox"
import { useCreateChannel } from "@/hooks/channel-hooks";
import { CreateChannelRequest, createChannelSchema } from "@/models/requests/channels/create-channel-request";

interface CreateChannelFormProps {

    onCreate: (channel: ChannelResponse) => void;
}



const CreateChannelForm: React.FC<CreateChannelFormProps> = ({onCreate}) => {

    const {channel, createChannel, creatingChannel} = useCreateChannel();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        
        resolver: zodResolver(createChannelSchema),
        mode: "onChange",
        
        defaultValues: {
            adultContent:false,
            description: "",
            name:""
        }
        

    });

   

    const submit = async (data:  CreateChannelRequest) => {
       
        await createChannel(data);
           
    };
    

  

    useEffect(()=>{

        
        if(channel)
        {
            onCreate(channel);

        }

    },[channel])
        
        

    return (
        <div className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4">
            <div className="">
                <h2 className="text-md font-semibold max-md:text-center">Creating a Channel</h2>
                <p className="text-xs opacity-45 max-md:text-center">Creating a channel makes you the owner of it. Be sure that your channel name is unique when creating it. You can change any information previously</p>
            </div>
             
              <form onSubmit={handleSubmit(data => submit(data))}  className="w-full flex flex-col gap-3 mt-4">
                <Input
                    label="Channel name"
                    type="text"
                    placeholder="my.awesome.channel"
                    minLength={3}
                    maxLength={100}
                    value={watch("name")}
                    labelPlacement="outside"
                    
                    isRequired={true}
                    autoComplete="username"
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
                    autoComplete="username"
                    description="Be as clear as possible about you channel and the rules."
                    {...register("description")}
                    errorMessage={errors.description?.message}
                    isInvalid={errors.description?.message !== undefined}
                />


                <Checkbox isSelected={watch("adultContent")} {...register("adultContent")} size="sm">
                    Has adult content
                </Checkbox>
                <p className="text-xs opacity-45">Adult content channels must not be visible for some users.</p>

                
                <Button
                    isDisabled={!isValid || creatingChannel}
                    type="submit"
                    isLoading={creatingChannel}
                    className={`w-full backdrop-blur-xl bg-default-100/80 ${
                        !isValid ? "opacity-50" : ""
                    } max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
                >
                    <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
                    Create Channel
                </Button>
            
            </form>

            
            
        </div>
    );
};

export default CreateChannelForm;