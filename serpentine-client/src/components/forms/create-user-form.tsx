import React, {useEffect, useState, useRef}from "react";
import { Button } from "@heroui/button";
import { CreateUserRequest } from "@/models/requests/user/create-user-request";
import { Spinner } from "@heroui/spinner";
import * as motion from "motion/react-client"
import CreateUserNameForm from "./create-username-form";
import CreatePasswordForm from "./create-password-form";
import { AnimatePresence } from "framer-motion";
import CreateProfilePictureForm from "./create-profile-picture-form";
import { useCreateUser } from "@/hooks/user-hooks";


interface CreateUserFormProps {
    onViewChanged: () => void;
}


const CreateUserForm : React.FC<CreateUserFormProps> = ({onViewChanged}) => {
   

    const [createUserRequest, setCreateUserRequest] = useState<CreateUserRequest>({
        userName: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: new Date(),
        imageFile: null,
    });

    const { createUser, loading, data} = useCreateUser();
    
    
    const [isMounted, setIsMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(()=>{
        if(data.statusCode === 200)
        {
            onViewChanged();
        }
    }, [data]);

  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       let form = buildForm();
       await createUser(form);
    };

   

    const toggleViewChange = () => {
        onViewChanged();
    }

    const buildForm = () : FormData =>{

        const formData = new FormData();
        formData.append('userName', createUserRequest.userName);
        formData.append('fullName', createUserRequest.fullName);
        formData.append('password', createUserRequest.password);
        formData.append('confirmPassword', createUserRequest.confirmPassword);
        formData.append('dateOfBirth', createUserRequest.dateOfBirth.toString());
        formData.append('profilePictureUrl', createUserRequest.profilePictureUrl ?? "");

        if (createUserRequest.imageFile) {
            formData.append('imageFile', createUserRequest.imageFile);
        }

        return formData;
    }

    



   

    

    return (
        <>
            {
                isMounted && 

                    <motion.div
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col  h-screen max-sm:h-fit justify-center relative items-center  "
                        >

                        <form onSubmit={handleSubmit} className="w-[70%] max-sm:w-[90%] flex  flex-col  gap-4  mt-4">


                            <AnimatePresence  initial={false}>
                                {currentStep === 0 && (
                                    
                                    <motion.div
                                        key="full-name"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0, }}
                                        exit={{ opacity: 0, x:10}}
                                        className="flex flex-col gap-1 relative"
                                    >
                                        <p onClick={toggleViewChange} className="text-sm   font-semibold text-start underline text-blue-600 cursor-pointer">Cancel</p>

                                        <CreateUserNameForm user={createUserRequest} onAgeChanged={(val) => setCreateUserRequest((prev) => ({ ...prev, dateOfBirth: val }))} onUserNameChanged={(userName) => setCreateUserRequest((prev) => ({ ...prev, userName }))} onNameChanged={(name) => setCreateUserRequest((prev) => ({ ...prev, fullName: name }))} onNext={() => setCurrentStep(1)} currentStep={currentStep}/>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            

                            
                            <AnimatePresence  >
                                {currentStep === 1 && (
                                    <motion.div
                                        key="password"
                                        initial={{ opacity: 0, x: -10, display: "none"}}
                                        animate={{ opacity: 1, x: 0, display: "block" }}
                                        exit={{ opacity: 0, x: 10, display: "none"}}
                                        transition={{  delay: 0.5 }}
                                        className="flex flex-col gap-1 relative"
                                        
                                    >
                                    <CreatePasswordForm user={createUserRequest} passwordChanged={(val) => setCreateUserRequest((prev) => ({ ...prev, password: val }))} confirmPasswordChanged={(val) => setCreateUserRequest((prev) => ({ ...prev, confirmPassword: val }))} onNext={() => setCurrentStep(2)} onPrev={()=> setCurrentStep(0)} currentStep={currentStep}/>

                                    </motion.div>
                                )}
                            </AnimatePresence>

                        

                            <AnimatePresence  initial={false}>
                                {currentStep === 2 && (
                                    <motion.div
                                        key="pfp"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0, }}
                                        exit={{ opacity: 0, x:10}}
                                        className="flex flex-col gap-1 relative"
                                    >
                                        <CreateProfilePictureForm user={createUserRequest} onProfilePictureUrl={(val) => setCreateUserRequest((prev) => ({ ...prev, profilePictureUrl: val }))} onFileChange={(val) => setCreateUserRequest((prev) => ({ ...prev, imageFile: val }))} onPrev={()=> setCurrentStep(1)}  currentStep={currentStep}/>
                                        {  loading ? 
                                                
                                            <Spinner color="default" size="sm"  classNames={{label: "text-foreground mt-4"}}  variant="spinner" />
                        
                                            :
                                        
                                            <Button disabled={loading} type="submit" className={`w-full backdrop-blur-xl bg-default-100/80 mt-4  backdrop-brightness-100 ${loading ? " opacity-50" : ""}  max-h-9  border border-default-100/20 transition-all   text-sm font-semibold`}  >
                                                <div className="grain w-4 h-4 absolute inset-0 opacity-50"></div>
                        
                                                Create Account   
                                                
                                                
                                            </Button>
                                        }
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        
                        
                            
                            

                                        
                        
                                        
                        </form>



                    </motion.div>
            }
        </>
      
      
    );
}

export default CreateUserForm;