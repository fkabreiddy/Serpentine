import React, { useState, useRef, useEffect } from "react";
import { Input } from "@heroui/input";
import { CreateUserRequest } from "@/models/requests/user/create-user-request";
import { ReactPhotoEditor } from "react-photo-editor";
import { convertToBase64 } from "@/helpers/file-reader-helper";




interface CreateProfilePictureFormProps {
    
    user: CreateUserRequest;
  
    onFileChange: (file: File | null) => void;
    currentStep: number;
    onPrev: ()=>void;
}

const CreateProfilePictureForm : React.FC<CreateProfilePictureFormProps> = ({onFileChange, onPrev, user,}) => {
   
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [openFileEditor, setOpenFileEditor] = useState(false);
    
    const profilePictureInput = useRef<HTMLInputElement>(null);

    const clearFileInput = () => {
        if (profilePictureInput.current) {
                profilePictureInput.current.value = "";
        }
    };

   

    useEffect( ()=>{

        const loadImage = async () => {
            if(user.imageFile)
            {
                var prev = await convertToBase64(user.imageFile)
                setPreviewUrl(prev);
            }
        }

        loadImage()
    }, [user.imageFile])

        
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
                onFileChange(file);
                setOpenFileEditor(true);

                

                
            }
        
    };
    

    return(
        <>
            <ReactPhotoEditor

                open={openFileEditor}
                onClose={() => setOpenFileEditor(false)}
                file={user.imageFile ? user.imageFile : new File([], "")}
                onSaveImage={onFileChange}
            />  
            <p className="text-3xl font-semibold ">About your   <span className="underline text-blue-600">preferences</span></p>
                <p className="text-sm mb-4 font-normal ml-1 text-start">Upload an image for your avatar. Maximum size is 5mb</p>

            <div className="flex items-center gap-3 w-full ">
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
                                required={false}
                                description="Not required"
                            />
                    </div>     
                {
                    (previewUrl && user.imageFile) && 
                    <button onClick={() => {onFileChange(null); clearFileInput();}} className="text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                                            
                    </button> 
                  
                }
                        
               
                        
            </div>
            <div className="w-full flex mt-3  justify-between items-center gap-3">   
                <p className="text-blue-600 text-end underline font-normal text-sm cursor-pointer" onClick={onPrev}>Go back</p>
            </div>
        </>
           

    );
}

export default CreateProfilePictureForm;
