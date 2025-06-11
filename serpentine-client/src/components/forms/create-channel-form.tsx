import { ChannelResponse } from "@/models/responses/channel-response";
import { Input, Textarea } from "@heroui/input";
import React, { useEffect, useState } from "react";
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import {Checkbox} from "@heroui/checkbox"
import { useCreateChannel } from "@/hooks/channel-hooks";

interface CreateChannelFormProps {

    onCreate: (channel: ChannelResponse) => void;
}

const createChannelSchema = z.object({
  name: z.string()
    .min(3, { message: "The name of the channel must contain at least 3 characters" })
    .max(100, { message: "The name of the channel must contain at less than 100 characters" })
    .regex(/^[a-zA-Z0-9._]+$/, { message: "the name must contain just letters, numbers, dots and underscores" }),
    
  description: z.string()
    .min(10, { message: "The description must be larger than 10 characters" })
    .max(500, { message: "the description must not exceed 500 characters" }),
    
  adultContent: z.boolean().default(false),
});
const CreateChannelForm: React.FC<CreateChannelFormProps> = ({onCreate}) => {

    const {channel, createChannel, creatingChannel} = useCreateChannel();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<z.infer<typeof createChannelSchema>>({
        
        resolver: zodResolver(createChannelSchema),
        mode: "onChange",
        defaultValues: {
            adultContent:false
        }
        

    });

    const [request, setRequest] = useState<CreateChannelRequest>({
        name: "",
        description: "",
        adultContent: false
    })

    const submit = async (data: z.infer<typeof createChannelSchema>) => {
       
        await createChannel(request);
           
    };

    const handleForm = (e : React.FormEvent) => {
        e.preventDefault();
        
        handleSubmit(submit)(e);
    }

    useEffect(()=>{

        
        if(channel)
        {
            onCreate(channel);

        }

    },[channel])
        
        

    useEffect(()=>{

        setRequest({
            name: watch("name"),
            description: watch("description"),
            adultContent: watch("adultContent")
        })

    }, [watch("name"), watch("description"), watch("adultContent")])

    return (
        <div className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4">
            <div className="">
                <h2 className="text-md font-semibold max-md:text-center">Creating a Channel</h2>
                <p className="text-xs opacity-45 max-md:text-center">Creating a channel makes you the owner of it. Be sure that your channel name is unique when creating it. You can change any information previously</p>
            </div>
             
              <form onSubmit={handleForm}  className="w-full flex flex-col gap-3 mt-4">
                <Input
                    label="Channel name"
                    type="text"
                    placeholder="my.awesome.channel"
                    minLength={3}
                    maxLength={100}
                    value={request.name}
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
                    value={request.description}
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


                <Checkbox isSelected={request.adultContent} onValueChange={(e) => setValue("adultContent", e) } size="sm">
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