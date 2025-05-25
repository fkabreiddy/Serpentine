import { motion } from "motion/react";
import {useForm} from "react-hook-form"
import { z } from "zod";
import React, { useEffect, useRef, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetByUsername, useCreateUser } from "@/hooks/user-hooks";
import { Button } from '@heroui/button';
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Image } from "@heroui/image";

// Remove the node:url import as we'll use the browser's URL API

interface CreateAccountFormProps {
    onClose: () => void
}

const createAccountSchema = z.object({
    fullName: z.string()
        .min(3, "Your name must be at least 3 characters")
        .max(30, "Your name must be less than 30 characters"),
  
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9._]{3,30}$/, "Username can only contain letters, numbers, dots and underscores"),

    password: z.string()
           .min(8, "Password must be at least 8 characters")
           .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
           .regex(/\d/, "Password must contain at least one number")
           .regex(/[\W_]/, "Password must contain at least one special character"),
           
  confirmPassword: z.string(),

    profilePictureUrl: z.string().nullable(),
    imageFile: z.instanceof(File).nullable(),

}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
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
                profilePictureUrl: "https://img.freepik.com/premium-vector/vector-abstract-grainy-texture-gradient-background_296715-733.jpg",
                imageFile:null
            }

        });
    const file = watch("imageFile");

    const {getByUsername,isAvailable, setIsAvailable, isGettingByUsername } = useGetByUsername();
    const profilePictureInput = useRef<HTMLInputElement>(null);
    const {createUser, result, isCreatingUser} = useCreateUser();

    const handleEditPictureClicked = () => {
        profilePictureInput.current?.click();
    
    };

    const buildForm = () : FormData =>{

        const formData = new FormData();
        formData.append('username', watch("username"));
        formData.append('fullName', watch("fullName"));
        formData.append('password', watch("password"));
        formData.append('confirmPassword', watch("confirmPassword"));
     
        formData.append('profilePictureUrl', watch("profilePictureUrl") ?? "");

        if (watch("imageFile")) {

            const imageFile = watch("imageFile");
            formData.append('imageFile', imageFile ? imageFile : "");
        }

        return formData;
    }

    useEffect(()=>{
        if(result && result.isSuccess === true && result.statusCode === 200)
        {
            onClose();
        }
    },[result]);

    const submit = async () => {
        const formData = buildForm();
        await createUser(formData);
       
    };
    

    useEffect(() => {

        setIsAvailable(false);
    }, []);

    const clearPicture = () =>{

        setValue("imageFile", null);
        setValue("profilePictureUrl", "https://img.freepik.com/premium-vector/vector-abstract-grainy-texture-gradient-background_296715-733.jpg");
       
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
                setValue("profilePictureUrl", null);
    



                

                
            }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        processFile(file);
        
    };

   

   


    

    



    

    return(
        <ScrollShadow className="w-full scroll-smooth scrollbar-hide p-2 ">
              <motion.div
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col   relative justify-between items-center gap-3 "
            >
            
            
            <Input
            {...register("imageFile")}
            type="file"
            ref={profilePictureInput}
            accept="image/png, image/jpeg, image/webp, image/jpg"
            multiple={false}
            className="w-full  cursor-pointer border-2 invisible border-dashed border-default-100/80 hover:border-blue-700 items-center rounded-xl transition-all"
            radius="md"
            style={{display: "none"}}
            variant="flat"
            required={false}
            />

           

                <form  onSubmit={(e)=> { e.preventDefault(); handleSubmit(submit())}} className="w-full flex flex-col gap-3  mt-4">
                <div>
                    <h1 className="text-2xl font-semibold text-center">Create Account</h1>
                    <p className="text-sm mb-4 font-normal opacity-60 ml-1 text-center">
                        We need some information about you.
                    </p>
                </div>    
                     <Input
                        type="text"
                        label="Username"
                        autoComplete="username"
                        labelPlacement="outside"
                        value={watch("username")}
                        minLength={3}
                        maxLength={30}
                        required={true}
                        readOnly={isAvailable}
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
                                   
                                    await getByUsername({ username: watch("username") });
                                     
                                }
                            }}
                            
                            isDisabled={isGettingByUsername }
                            className={`w-fit backdrop-blur-xl self-end  ${ isAvailable  ? " bg-blue-600 dark:bg-blue-700 text-white" : ""}  max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
                                
                        >
                            <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
                            {isAvailable ? "Reset": "Check"}
                        </Button>
                  

                {
                    isAvailable && (
                        
                        <>
                             <Input
                                type="text"
                                value={watch("fullName")}
                                maxLength={30}
                                minLength={10}
                                required={true}
                                label="Full Name"
                                labelPlacement="outside"
                                placeholder="What is your name in real life?"
                                isInvalid={errors.fullName?.message !== undefined}
                                errorMessage={errors.fullName?.message}

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
                                value={watch("password")}
                                placeholder="Your password"
                                minLength={8}
                                maxLength={30}
                                errorMessage={errors.password?.message}
                                isInvalid={errors.password?.message !== undefined}

                               description="Your password must be at least 8 characters, contain at least one uppercase letter, one number and one special character"
                                
                            />
                            <Input
                                {...register("confirmPassword")}
                                type="password"
                                value={watch("confirmPassword")}
                                label="Confirm Password"
                                labelPlacement="outside"
                                minLength={8}
                                maxLength={30}
                                required={true}
                                isInvalid={errors.confirmPassword?.message !== undefined}
                                errorMessage={errors.confirmPassword?.message}

                                placeholder="Confirm your password"
                               description="Your passwords must match"


                            />
                            <div className="flex w-full items-center gap-2 opacity-40">
                                <label className="text-xs opacity-50  font-semibold text-nowrap">Personalization</label>
                                <hr className="border rounded-full dar:border-default-50 border-default-200 w-full"/>

                            </div>
                            <div className="flex w-full items-center gap-2">
                                <Input
                                    {...register("profilePictureUrl")}
                                    type="url"
                                    label="Profile Picture URL"
                                    labelPlacement="outside"    
                                    required={false}
                                    disabled={watch("imageFile") !== null}
                                    value={watch("profilePictureUrl") ?? ""}
                                    placeholder="Insert your profile picture url"
                                    description="Introduce a valid url"
                                  
                                />

                                <div className="rounded-full bg-default-100">
                                        <Image
                                        isBlurred
                                        className="rounded-full cursor-pointer bg-default-100 border-default/90 object-cover flex-shrink-0 max-h-[40px] max-w-[40px]"
                                        src={!watch("profilePictureUrl") ? 
                                            (file instanceof File ? window.URL.createObjectURL(file) : watch("profilePictureUrl")) 
                                            : watch("profilePictureUrl")
                                        }                   
                                        onClick={watch("imageFile") ? clearPicture : handleEditPictureClicked}                
                                        width={40}
                                        height={40}
                                    />
                                </div>
                              
                            </div>
                            

                            <Button
                            isDisabled={!isValid}
                            type="submit"
                            spinner={isCreatingUser}
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


const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 opacity-50">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
    </svg>
);

export default CreateAccountForm;
