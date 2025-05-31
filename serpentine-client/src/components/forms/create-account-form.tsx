import { motion } from "motion/react";
import {useForm} from "react-hook-form"
import { z } from "zod";
import React, { useEffect, useRef, useState, useTransition } from "react";
import Avatar from "boring-avatars"
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetByUsername, useCreateUser } from "@/hooks/user-hooks";
import { Button } from '@heroui/button';
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Image } from "@heroui/image";
import { UploadCloud, UploadIcon } from "lucide-react";
import {ArrowUpIcon, MagnifyingGlassIcon} from '@heroicons/react/24/solid'
import Divider from "../divider";
import { DateInput } from "@heroui/date-input";
import { CreateUserRequest } from "@/models/requests/user/create-user-request";
import { CalendarIcon } from "lucide-react";
import { parseDate, today, getLocalTimeZone, CalendarDate, parseAbsolute, } from "@internationalized/date";
import { data } from "motion/react-client";
import { CakeIcon } from "lucide-react";

const minAge = () => {
    const currentDate = today(getLocalTimeZone());
    return currentDate.subtract({ years: 16 });
};

const maxAge = () => {
    const currentDate = today(getLocalTimeZone());
    return currentDate.subtract({ years: 100 });
    // Convert calendar date to JavaScript Date for maxAge validation
   
};

 
type FileType = File;

// Remove the node:url import as we'll use the browser's URL API

interface CreateAccountFormProps {
    onClose: () => void
}

const createAccountSchema = z.object({
    fullName: z.string()
        .min(3, "Your name must be at least 3 characters")
        .max(30, "Your name must be less than 30 characters")
        .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
        .default(""),
  
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9._]{3,30}$/, "Username can only contain letters, numbers, dots and underscores")
        .default(""),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character")
        .default(""),
           
    confirmPassword: z.string().default(""),

    imageFile: z.instanceof(File).nullable().default(null),
    dayOfBirth: z.instanceof(CalendarDate).default(today(getLocalTimeZone()))

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});





const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ onClose }) => {

        const {
            register,
            handleSubmit,
            setValue,
            watch,
            formState: { errors, isValid },
        } = useForm<z.infer<typeof createAccountSchema>>({
            
            resolver: zodResolver(createAccountSchema),
            mode: "onChange",
            defaultValues: {
                imageFile:null
            }
            

        });




        
    const {getByUsername,isAvailable, setIsAvailable, isGettingByUsername } = useGetByUsername();
    const profilePictureInput = useRef<HTMLInputElement>(null);
    const {createUser, result, isCreatingUser} = useCreateUser();
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [request, setRequest] = useState<CreateUserRequest>({
        username: watch("username"),
        fullName: watch("fullName"),
        password: watch("password"),
        dayOfBirth: today(getLocalTimeZone()).toString(),
        confirmPassword: watch("confirmPassword"),
        imageFile: watch("imageFile") as FileType | null,
    });

    const ageIsValid = () =>{

        return watch("dayOfBirth") <= minAge() &&  watch("dayOfBirth") >= maxAge()
    }


    useEffect(() => {
        setRequest({
            username: watch("username"),
            fullName: watch("fullName"),
            password: watch("password"),
            confirmPassword: watch("confirmPassword"),
            dayOfBirth: today(getLocalTimeZone()).toString(),
            imageFile: watch("imageFile") as FileType | null,
        });

        const date = watch("dayOfBirth");

        if(date) {
            setRequest((prev) => ({
            ...prev,
                dayOfBirth: date.toString()
            }));
        }
        else
        {
             setRequest((prev) => ({
            ...prev,
                dayOfBirth:  today(getLocalTimeZone()).toString()
            }));
        }

    }, [watch("username"), watch("fullName"), watch("password"), watch("dayOfBirth"), watch("confirmPassword"), watch("imageFile")]);


    const handleEditPictureClicked = () => {
        profilePictureInput.current?.click();
    
    };

    const buildForm = () : FormData =>{

        const formData = new FormData();
        formData.append('username', request.username);
        formData.append('fullName', request.fullName);
        formData.append('password', request.password);
        formData.append('confirmPassword', request.confirmPassword);
        formData.append("dayOfBirth", request.dayOfBirth);
     

        if (request.imageFile) {

            formData.append('imageFile', request.imageFile);
        }

        return formData;
    }

    useEffect(()=>{
        if(result && result.isSuccess === true && result.statusCode === 200)
        {
            onClose()
        }
    },[result]);

    const submit = async (data: z.infer<typeof createAccountSchema>) => {
        const formData = buildForm();
        console.log("Submitting form data:", formData);
        await createUser(formData);
       
    };
    
    
    useEffect(() => {

        setIsAvailable(false);
    }, []);

    const clearPicture = () =>{

        setValue("imageFile", null);
        setProfilePictureFile(null);
       
    }

    const canProceed = errors === null && isValid;
    const processFile = (file: File | null | undefined) => {
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

                setValue("imageFile", file);
                setProfilePictureFile(file);
    



                

                
            }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        processFile(file);
        
    };

    const handleForm = (e : React.FormEvent) => {
        e.preventDefault();
        
        handleSubmit(submit)(e);
    }
   

   


    

    



    

    return(
        <ScrollShadow className="w-full scroll-smooth scrollbar-hide p-2 ">
              <motion.div
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col   relative justify-between items-center gap-3 "
            >
            
            
            <input
                onChange={handleFileChange}
                type="file"
                ref={profilePictureInput}
                accept="image/png, image/jpeg, image/webp, image/jpg"
                multiple={false}
                className="hidden"
            />

                <div className="w-full">
                    
                    {errors.dayOfBirth && (
                        <p className="text-red-500 text-sm mt-1">{errors.dayOfBirth.message}</p>
                    )}
                    
                </div>

                

                <form   onSubmit={handleForm} className="w-full flex flex-col gap-3  mt-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-center">Create Account</h1>
                        <p className="text-sm mb-4 font-normal opacity-60 ml-1 text-center">
                            We need some information about you.
                        </p>
                     </div> 
                        <div className="flex flex-col items-center justify-center gap-3 mb-2">
                            {request.imageFile ? <FileAvatar file={request.imageFile} onRemove={clearPicture} onAdd={handleEditPictureClicked} /> : <Avatar className="transition-all" name={(isAvailable || request.username !== "") ? request.username : "adam" } size={70} variant="beam"/> }
                                <Button
                                    radius="md"
                                    endContent={!request.imageFile && <ArrowUpIcon strokeWidth={2} className="size-4" />}
                                    onPress={request.imageFile ? clearPicture : handleEditPictureClicked}
                                    isDisabled={isGettingByUsername }
                                    size="sm"
                                    className={`w-fit backdrop-blur-xl ${request.imageFile && "bg-red-700 text-white "}  max-h-9 border border-default-100/20 transition-all text-xs font-semibold`}
                                        
                                >
                                    <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
                                    {request.imageFile ? "Reset": "Upload"}
                                </Button>

                        </div>  
                     

                     <Input
                        type="text"
                        label="Username"
                        autoComplete="username"
                        labelPlacement="outside"
                        value={request.username}
                        minLength={3}
                        maxLength={30}
                        required={true}
                        readOnly={isAvailable}
                        isRequired={true}
                        pattern="^[a-zA-Z0-9._]{3,30}$"
                        endContent={<UserIcon />}
                        description="Dont put @, just your username"
                        placeholder="How do you want to be called?"
                        className={`${isAvailable ? "opacity-50" : ""}`}
                        {...register("username")}
                        disabled={isAvailable}
                        errorMessage={errors.username?.message}
                        isInvalid={errors.username?.message !== undefined}

                        
                    />

                   

                 
                   
                        <Button
                        isLoading={isGettingByUsername}
                            onPress={async () => {

                                if (isAvailable) {
                                    setValue("username", "");
                                    setIsAvailable(false);
                                } else {
                                   
                                    await getByUsername({ username: request.username});
                                     
                                }
                            }}
                            size="sm"
                            radius="md"
                            isDisabled={isGettingByUsername || request.username === "" }
                            className={`w-fit backdrop-blur-xl self-end  ${ isAvailable  ? " bg-red-700 dark:bg-red-700 text-white" : ""}  max-h-9 border border-default-100/20 transition-all text-xs font-semibold`}
                                
                        >
                            <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
                            {isAvailable ? "Reset": "Check Availability"}
                        </Button>
                  

                {
                    isAvailable && (
                        
                        <>
                             <Input
                                type="text"
                                value={request.fullName}
                                maxLength={30}
                                minLength={10}
                                required={true}
                                label="Full Name"
                                labelPlacement="outside"
                                placeholder="What is your name in real life?"
                                isInvalid={errors.fullName?.message !== undefined}
                                errorMessage={errors.fullName?.message}
                                isRequired={true}
                               description="This will not be used to identify you in the app"
                                {...register("fullName")}

                            />
                            <div className="flex w-full items-center gap-2 opacity-40">
                                <label className="text-xs opacity-50  font-semibold text-nowrap">Security</label>
                                <hr className="border rounded-full dar:border-default-50 border-default-200 w-full"/>

                            </div>
                            <Input
                                type="password"
                                label="Password"
                                {...register("password")}

                                labelPlacement="outside"
                                value={request.password}
                                placeholder="Your password"
                                minLength={8}
                                maxLength={30}
                                isRequired={true}
                                errorMessage={errors.password?.message}
                                isInvalid={errors.password?.message !== undefined}

                               description="Your password must be at least 8 characters, contain at least one uppercase letter, one number and one special character"
                                
                            />
                            <Input
                                {...register("confirmPassword")}
                                type="password"
                                value={request.confirmPassword}
                                label="Confirm Password"
                                labelPlacement="outside"
                                minLength={8}
                                maxLength={30}
                                required={true}
                                isRequired={true}
                                isInvalid={errors.confirmPassword?.message !== undefined}
                                errorMessage={errors.confirmPassword?.message}

                                placeholder="Confirm your password"
                               description="Your passwords must match"


                            />
                            <DateInput
                                minValue={maxAge()}
                                maxValue={minAge()}
                                endContent={
                                   <CakeIcon size={20} />
                                }
                              
                                label="Day of birth"
                                labelPlacement="outside"
                                onChange={(e) => setValue("dayOfBirth", e ?? today(getLocalTimeZone()))}
                                value={parseDate(request.dayOfBirth)}
                                isRequired={true}
                                placeholderValue={today(getLocalTimeZone())}
                                />
                                

                            <Button
                            isDisabled={!isValid || isCreatingUser || !ageIsValid()}
                            type="submit"
                            isLoading={isCreatingUser}
                            className={`w-full backdrop-blur-xl bg-default-100/80  ${
                                canProceed ? "opacity-50" : ""
                            } max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
                            >
                                <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
                                Create Account
                            </Button>
                        </>
                        
                    )
                }

               
               
            </form>

             <a
                    onClick={onClose}
                    className={`text-center mt-5 cursor-pointer hover:underline text-blue-600 dark:text-blue-700 text-sm font-semibold`}
            >
                Cancel
            </a>
        </motion.div>
        </ScrollShadow>
      
    );
}

interface FileAvatarProps {
    file: File | null; 
    onRemove: () => void;
    onAdd: () => void;
}

const FileAvatar: React.FC<FileAvatarProps> = ({ file, onRemove, onAdd }) => (
    <div className="rounded-full bg-default-100">
            <Image
            isBlurred
            className="rounded-full cursor-pointer bg-default-100 border-default/90 object-cover flex-shrink-0 max-h-[70px] max-w-[70px]"
            src={file instanceof File ? window.URL.createObjectURL(file) : ""}            
            onClick={file ? onRemove : onAdd}                
            width={70}
            height={70}
        />
    </div>
                              
)





const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 opacity-50">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
    </svg>
);

export default CreateAccountForm;
