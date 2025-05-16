import React, { useEffect, useState } from "react";
import icons from "@/helpers/icons-helper";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { CreateUserRequest } from "@/models/requests/user/create-user-request";
import { useGetByUsername } from "@/hooks/user-hooks";
import { Calendar } from "@/components/ui/calendar";
import {Checkbox} from "@heroui/checkbox";

const [userIcon] = icons;

interface CreateUserNameFormProps {
    user: CreateUserRequest;
    onNext: () => void;
    onUserNameChanged: (userName: string) => void;
    onNameChanged: (name: string) => void;
    currentStep: number;
}

const CreateUserNameForm: React.FC<CreateUserNameFormProps> = ({
    onUserNameChanged,
    onNameChanged,
    onNext,
    currentStep,
    user
}) => {
    const [userNameIsAvailable, setUserNameIsAvailable] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [username, setUsername] = useState(user.userName);
    const { getByUsername, loading, data } = useGetByUsername();
    const [imOverSixteen, setImOverSixteen] = useState<boolean>(false);

    // Validation constants
    const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,30}$/;
    const NAME_REGEX = /^[a-zA-ZÀ-ÿ0-9 ]{10,30}$/;
    const MIN_AGE = 16;
    const MAX_AGE = 100;

    useEffect(() => {
        setIsMounted(true);
        setUserNameIsAvailable(Boolean(user.userName));
    }, []);

    useEffect(() => {
        if (data?.statusCode === 404) {
            setUserNameIsAvailable(true);
            onUserNameChanged(username);
        }
    }, [data]);

    const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        onNameChanged(e.target.value);
    };

    const handleUserNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await getByUsername({ username });
    };

   

    const isValidUsername = (): boolean => USERNAME_REGEX.test(username);
    const isValidName = (): boolean => NAME_REGEX.test(user.fullName);
    const canProceed = userNameIsAvailable && isValidName() && isValidUsername() && imOverSixteen;

    if (!isMounted) return null;

    return (
        <div className="flex flex-col gap-2 w-full">
            <header>
                <h1 className="text-3xl font-semibold">
                    First, tell us about <span className="text-blue-600">you</span>
                </h1>
                <p className="text-sm mb-4 font-normal opacity-60 ml-1">
                    Welcome to serpentine. We need some information about you.
                </p>
            </header>

            <div className="flex items-center w-full gap-2">
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
                    required
                    value={username}
                    disabled={userNameIsAvailable}
                />

                {loading ? (
                    <Spinner color="default" size="sm" variant="spinner" />
                ) : (
                    <Button
                        isDisabled={currentStep > 0 || (!userNameIsAvailable && (!username || !isValidUsername()))}
                        onClick={userNameIsAvailable ? () => setUserNameIsAvailable(false) : handleSubmit}
                        className="backdrop-blur-xl bg-blue-700/80 max-h-9 border border-default-100/20"
                    >
                        {userNameIsAvailable ? 'Reset' : 'Check'}
                    </Button>
                )}
            </div>

            <AnimatePresence>
                {userNameIsAvailable && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold ml-1">Your full name</label>
                            <Input
                                type="text"
                                onChange={handleNameChanged}
                                placeholder="Enter your full name"
                                name="fullName"
                                value={user.fullName}
                                description="No numbers or special characters"
                            />
                        </div>

                        <div className="flex gap-1 items-start">
                            <Checkbox color="primary"  isSelected={imOverSixteen} onValueChange={setImOverSixteen}>
                            </Checkbox>  
                            <p className="text-sm font-normal">Im over 16 years old when making this account</p>
                         
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            
            <div className="w-full flex justify-end">
                <Button
                    onClick={onNext}
                    className={`text-blue-600 font-semibold ${canProceed ? "animate-appearance-in" : "animate-appearance-out"} `}
                >
                    Next
                </Button>
            </div>
            
        </div>
    );
};

export default CreateUserNameForm;
