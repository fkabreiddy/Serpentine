import React, { useEffect, useState } from "react";
import icons from "@/helpers/icons-helper";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import { AnimatePresence } from "motion/react"
import { CreateUserRequest } from "@/models/requests/user/create-user-request";
import { use } from "motion/react-client";
import { useGetByUsername } from "@/hooks/user-hooks";
const [userIcon ] = icons;



interface CreateUserNameFormProps {
    
    user : CreateUserRequest
    onNext: () => void;
    onAgeChanged: (dayOfBirth: string) => void;
    onUserNameChanged: (userName: string) => void;
    onNameChanged: (name: string) => void;
    currentStep: number;
}

const CreateUserNameForm : React.FC<CreateUserNameFormProps> = ({onUserNameChanged: userNameChanged, onNameChanged: nameChanged, onNext, onAgeChanged, currentStep, user}) => {
  
    const [userNameIsAvailable, setUserNameIsAvailable] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false);
    const [username, setUsername] = useState<string>("");
    const {getByUsername, loading, data} = useGetByUsername();

    useEffect(()=>{
        setIsMounted(true);

    }, [])

    useEffect(()=>{
        setUserNameIsAvailable(user.userName !== "");
        setUsername(user.userName);

    }, [])



    const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {  value } = e.target;
        nameChanged(value);
    };

    const handleUserNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {  value } = e.target;
        setUsername(value);
    };

    const handleAgeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {  value } = e.target;
        const date = new Date(value);

        if (!isNaN(date.getTime())) {
          const iso = date.toISOString();
          onAgeChanged(iso);

        }
    };

    useEffect(()=>{

        if(data.statusCode === 404)
        {
            setUserNameIsAvailable(true);
            userNameChanged(username);

        }
        
    },[data])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await getByUsername({username: username});

      
        
        
    };

    const validateAge = () : boolean =>{
        const birthDate = new Date(user.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age <= 100 && age >= 16;
    }

    const validateUserName = () : boolean => {

        return /^[a-zA-Z0-9._]{3,30}$/.test(username)

    }

    const validateName = () : boolean => {
       return /^[a-zA-ZÀ-ÿ0-9 ]{10,30}$/.test(user.fullName);
    }









    return(
       <>
            {
                isMounted && ( <>
                    <div className="flex flex-col gap-1 w-full">
        
                        <p className="text-3xl font-semibold ">First. tell us about <span className="underline text-blue-600">you</span></p>
                        <p className="text-sm mb-4 font-normal ml-1 text-start">Welcome to serpentine. We are so happy that you wanna join. We need some information about you. But first, tell us how do you wanna be called on serpentine</p>
        
                        <div className="flex items-center w-full  gap-2">
                            <Input
                                type="text"
                                onChange={handleUserNameChanged}
                                placeholder="Enter your user name"
                                name="userName"
                                className={userNameIsAvailable ? "opacity-50" : ""}
                                endContent={userIcon}
                                minLength={3}
                                maxLength={30}
                                radius="md"
                                required={true}
                                value={username}
                                disabled={userNameIsAvailable}
                            
                            />
        
                            {  loading ? 
                                
                                <Spinner color="default" size="sm"  classNames={{label: "text-foreground mt-4"}}  variant="spinner" />
            
                                :   userNameIsAvailable ? 
                                    <>
                                        <Button isDisabled={currentStep > 0} color="danger"  onClick={()=> setUserNameIsAvailable(false)} className="px-3   text-sm font-semibold" variant="light" size="sm">
                                
                                            Change    
        
                                        </Button>
                                    </>
                                     :
                                     <>
                                        <Button isDisabled={loading || username === "" || userNameIsAvailable || !validateUserName()} color="primary" onClick={handleSubmit} className="px-3  transition-all text-sm font-semibold" variant="solid" size="sm">
                                
                                            Check    
        
                                        </Button>
                                     
                                     </>
                            
                                
                            }
            
                        </div>
                        <p className="text-xs mb-4 font-normal opacity-50 ml-1 text-start">No need to put @. Just letters, numbers, dots and underscores</p>
        
                        
                    </div>
        
                            
                    {<AnimatePresence key={"full-name"} initial={false}>
                         {userNameIsAvailable ? (
                            <motion.div
                                key="full-name"
                                initial={{ opacity: 0,  }}
                                animate={{ opacity: 1, }}
                                exit={{ opacity: 0,  }}
                                className="flex flex-col gap-1"
                            >
                            <label className="text-sm font-semibold ml-1 text-start">
                                Your full name
                            </label>
                            <Input
                                type="text"
                                onChange={handleNameChanged}
                                placeholder="Enter your full name"
                                name="fullName"
                                minLength={3}
                                maxLength={30}
                                radius="md"
                                required={true}
                                value={user.fullName}
                                description="No numbers or special characters"
                            />
                             <label className="text-sm font-semibold ml-1 text-start">
                                Your day of birth
                            </label>
                            <Input
                                type="date"
                                onChange={handleAgeChanged}
                                placeholder="Your age"
                                name="age"
                                value={user.dateOfBirth.slice(0, 10)}
                                radius="md"
                                min={16}
                                max={100}
                                required={true}
                                description="The minimun is 16 yo"
                            />
                            </motion.div>
                        ) : (null)}
                        </AnimatePresence>
        
                    }
        
                    <div className="w-full flex  justify-end items-center gap-3">
                        
        
                        {
        
                            (userNameIsAvailable && validateName() && validateUserName() && validateAge()) && 
                            <>
                                <p className="text-blue-600 text-end underline font-normal text-sm cursor-pointer" onClick={onNext}>Next</p>
                            </>
                        }
                    </div>
                </>)
            }
       </>
       
       
           

    );
}

export default CreateUserNameForm;
