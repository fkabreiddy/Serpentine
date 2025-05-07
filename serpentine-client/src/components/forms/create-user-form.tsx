import React, {useEffect, useState, useRef}from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import icons from "@/helpers/icons-helper";
import { convertToBase64 } from "@/helpers/file-reader-helper";
import { CreateUserRequest, validateCreateUserRequest } from "@/models/requests/user/create-user-request";
import { ReactPhotoEditor } from 'react-photo-editor';
import { Spinner } from "@heroui/spinner";

interface CreateUserFormProps {
    
    onViewChanged: () => void;// Replace 'any' with the actual type of your form data
}



const CreateUserForm : React.FC<CreateUserFormProps> = ({onViewChanged}) => {
   
   
    const [fileToEdit, setFileToEdit] = useState<File | null>(null);

    const [createUserRequest, setCreateUserRequest] = useState<CreateUserRequest>({
        userName: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        age: 0,
        imageFile: fileToEdit,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [userIcon, passwordIcon, confirmPasswordIcon, deleteIcon] = icons;
    const [openFileEditor, setOpenFileEditor] = useState(false);
    const profilePictureInput = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [modelIsValid, setModelIsValid] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        const validation = validateCreateUserRequest(createUserRequest);
        setModelIsValid(validation.isValid);

    }, [createUserRequest]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateUserRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const clearFileInput = () => {
      if (profilePictureInput.current) {
        profilePictureInput.current.value = "";
      }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

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
            
                setCreateUserRequest((prev) => ({
                    ...prev,
                    imageFile: file,
                }));
                setOpenFileEditor(true);

                

               
            }
        
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
    };

    const handleFileEditorSave = async (editedFile : File) => {

        setOpenFileEditor(false);
        setCreateUserRequest((prev) => ({
            ...prev,
            imageFile: editedFile,
        }));
    
        if(createUserRequest.imageFile) {
            const preview = await convertToBase64(createUserRequest.imageFile);
            setPreviewUrl(preview);

        }

    }

    const clearImage = () => {
        setOpenFileEditor(false);
        setPreviewUrl(null);
        clearFileInput();
       setFileToEdit(null);
    }

    const toggleViewChange = () => {
        onViewChanged();
    }



   

    

    return (
        <>
            <ReactPhotoEditor

                open={openFileEditor}
                onClose={clearImage}
                file={createUserRequest.imageFile ? createUserRequest.imageFile : new File([], "")}
                onSaveImage={handleFileEditorSave}
            />           
            
            <p className={"text-2xl my-2 font-semibold"}>Create Your account</p>
           
            <form onSubmit={handleSubmit} className="w-[70%] max-sm:w-full flex flex-col  gap-4  mt-4">
           
            
                <div className="flex flex-col gap-1">
                    <label className="text-sm  font-semibold ml-1 text-start">Username</label>
                    <Input
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter your user name"
                        name="userName"
                        endContent={userIcon}
                        minLength={3}
                        maxLength={30}
                        radius="md"
                        required={true}
                    
                        description="Not need to put @. Just letters, numbers, dots and underscores"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm  font-semibold ml-1 text-start">Full Name</label>
                    <Input
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        name="fullName"
                        endContent={userIcon}
                        minLength={3}
                        maxLength={30}
                        radius="md"
                        required={true}
                    
                        description="No numbers or special characters"
                    />
                </div>


                <div className="flex items-center gap-1">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm  font-semibold ml-1 text-start">Password</label>
                        <Input
                            type="password"
                            onChange={handleChange}
                            placeholder="Enter your password"
                            name="password"
                            endContent={passwordIcon}
                            minLength={8}
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
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            minLength={8}
                            maxLength={30}
                            radius="md"
                            endContent={createUserRequest.password !== "" &&
                                createUserRequest.confirmPassword === createUserRequest.password ?
                                confirmPasswordIcon 
                                : <></>
                                }

                            required={true}
                            description="Password must be the same"
                        />
                    </div>
                

                
                </div>

                <div className="flex items-center gap-3 w-full ">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm  font-semibold ml-1 text-start">Age</label>
                        <Input
                            type="number"
                            onChange={handleChange}
                            placeholder="Your age"
                            name="age"
                        
                            radius="md"
                            min={16}
                            max={100}
                            required={true}
                            description="min 16"
                        />
                    </div>
                    {
                        previewUrl && createUserRequest.imageFile ? 
                        <button onClick={clearImage} className="text-red-700">{deleteIcon}</button> : 
                        <div className="flex flex-col gap-1">
                                <label className="text-sm  font-semibold ml-1 text-start">Profile Picture</label>
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    ref={profilePictureInput}
                                    placeholder="Upload your profile picture"
                                    name="profilePicture"
                                    accept="image/png, image/jpeg, image/webp, image/jpg"
                                    multiple={false}
                                    radius="md"
                                    endContent={createUserRequest.password !== "" &&
                                        createUserRequest.confirmPassword === createUserRequest.password ?
                                        confirmPasswordIcon 
                                        : <></>
                                        }

                                    required={false}
                                    description="Not required"
                                />
                        </div>
                    }
                
                    {previewUrl && createUserRequest.imageFile ? 
                    <div className="flex items-center gap-1 justify-between relative">
                    <img src={previewUrl} className="size-[40px] shrink-0  rounded-full object-cover" />
                    </div>  : 
                    <div></div>
                    } 
                </div>
                
                 {  loading ? 
                            
                    <Spinner color="default" size="sm"  classNames={{label: "text-foreground mt-4"}}  variant="spinner" />

                    :
                
                    <Button isDisabled={loading || !modelIsValid} color="primary" type="submit" className="w-full transition-all hover:scale-[105%] mt-4 text-sm font-semibold" variant="solid" size="sm">
                    
                        Login   

                    </Button>
                }
                            
                <p onClick={toggleViewChange} className="text-sm font-normal text-center underline text-blue-600 cursor-pointer">Create an account</p>
            
                            
            </form>
        </>
      
    );
}

export default CreateUserForm;