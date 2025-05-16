import React, { useState } from "react";
import icons from "@/helpers/icons-helper";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";
import { AnimatePresence } from "motion/react"
import { CreateUserRequest } from "@/models/requests/user/create-user-request";
const [userIcon ] = icons;



interface CreatePasswordFormProps {
    
    user: CreateUserRequest;
    onNext: () => void;
    passwordChanged: (userName: string) => void;
    confirmPasswordChanged: (name: string) => void;
    currentStep: number;
    onPrev: ()=>void;
}

const CreatePasswordForm : React.FC<CreatePasswordFormProps> = ({passwordChanged, confirmPasswordChanged, onNext, onPrev, user, currentStep}) => {
   
    const [passwordIsValid, setPasswordIsValid] = useState(false);


    const handlePasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {  value } = e.target;
        passwordChanged(value);
    };

    const handleConfirmPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {  value } = e.target;
        confirmPasswordChanged(value);
    };

  

    const validatePassword = () : boolean => {

        return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(user.password)

    }

    const confirmPasswordIcon : React.ReactNode = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.7"  className="size-5 stroke-green-700 opacity-55">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  







    return(
        <>
            <div className="flex flex-col gap-2 w-full">
                <p className="text-blue-600 text-start underline font-normal text-sm cursor-pointer" onClick={onPrev}>Go back</p>
                <p className="text-3xl font-semibold ">Now. lets put hands on  <span className="underline text-blue-600">security</span></p>
                <p className="text-sm mb-4 opacity-60 font-normal ml-1 text-start">Make sure to not use your name or any other public credential in your password. Get creative and get secure</p>

               
                    <div className="flex flex-col gap-1">
                        <label className="text-sm  font-semibold ml-1 text-start">Password</label>
                        <Input
                            type="password"
                            onChange={handlePasswordChanged}
                            placeholder="Enter your password"
                            name="password"
                            minLength={8}
                            value={user.password}
                            maxLength={30}
                            radius="md"
                            required={true}
                            description="At least 8 characters, one uppercase letter, one number and one symbol"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm  font-semibold ml-1 text-start">Confirm Password</label>
                        <Input
                            type="password"
                            onChange={handleConfirmPasswordChanged}
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            minLength={8}
                            maxLength={30}
                            value={user.confirmPassword}
                            radius="md"
                            endContent={user.password !== "" &&
                                user.confirmPassword === user.password ?
                                confirmPasswordIcon 
                                : <></>
                                }

                            required={true}
                            description="Password must be the same"
                        />
                    </div>
                        

                        

                
            </div>

           

            

                {

                    (validatePassword() && user.password === user.confirmPassword) && 
                    <>
                        <p className="text-blue-600 text-end underline font-normal text-sm cursor-pointer" onClick={onNext}>Next</p>
                    </>
                }
        </>
           

    );
}

export default CreatePasswordForm;
