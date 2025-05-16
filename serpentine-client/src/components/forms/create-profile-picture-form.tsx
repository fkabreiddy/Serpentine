import React, { useState, useRef, useEffect } from "react";
import { Input } from "@heroui/input";
import { CreateUserRequest } from "@/models/requests/user/create-user-request";
import { ReactPhotoEditor } from "react-photo-editor";
import {Image} from "@heroui/image";
import ProfilePictureCarousel from "../profile-pictures-carousel";




interface CreateProfilePictureFormProps {
    
    user: CreateUserRequest;
  
    onFileChange: (file: File | null) => void;
    onProfilePictureUrl: (pfp : string) => void;
    currentStep: number;
    onPrev: ()=>void;
}

const CreateProfilePictureForm : React.FC<CreateProfilePictureFormProps> = ({onFileChange, onProfilePictureUrl, onPrev, user,}) => {
   
    const [openFileEditor, setOpenFileEditor] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [lastProfilePictureUrl, setLastProfilePictureUrl] = useState("");

    
    const profilePictureInput = useRef<HTMLInputElement>(null);

    const handleProfilePictureUrlSelected = (pfp : string) =>{

        clearFileInput();
        setProfilePictureUrl(pfp);
        setLastProfilePictureUrl(pfp);
    }

    useEffect(()=>{
        onProfilePictureUrl(profilePictureUrl);
    }, [profilePictureUrl])
        
    const handleEditPictureClicked = () => {
        profilePictureInput.current?.click();
    
    };

    const clearFileInput = () => {
        if (profilePictureInput.current) {
                profilePictureInput.current.value = "";
                setProfilePictureUrl(lastProfilePictureUrl);
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
                onFileChange(file);
                setOpenFileEditor(true);
                setProfilePictureUrl("");

                

                
            }
        
    };
    

    return(
        <div className="flex flex-col gap-2">
            <ReactPhotoEditor

                open={openFileEditor}
                onClose={() => setOpenFileEditor(false)}
                file={user.imageFile ? user.imageFile : new File([], "")}
                onSaveImage={onFileChange}
            />  
            <div className="w-full flex mt-3  justify-between items-center gap-3">   
                <p className="text-blue-600 text-end underline font-normal text-sm cursor-pointer" onClick={onPrev}>Go back</p>
            </div>
            <p className="text-3xl font-semibold ">A preview about  <span className=" text-blue-600">you</span></p>
            <p className="text-sm mb-4 font-normal ml-1 text-start opacity-60">Upload an image for your avatar. Maximum size is 5mb</p>
            <div className="flex flex-col gap-8   items-center   ">

               <div className="flex flex-col gap-4 items-center">
                    {
                        user.imageFile ?
                         <Image
                            isBlurred
                            alt="HeroUI Album Cover"
                            className="rounded-full border-default/90 object-cover"
                        
                            src={URL.createObjectURL(user.imageFile)}
                            width={70}
                            height={70}
                        />

                        :
                        <ProfilePictureCarousel onSelected={handleProfilePictureUrlSelected}/>
                        

                    }
                     {
                        (user.imageFile) ?
                          
                        <p onClick={() => {onFileChange(null); clearFileInput();}} className="font-normal text-xs text-red-600 underline">Delete</p>
                        :
                        <label className="font-semibold text-start underline text-blue-600 text-xs cursor-pointer " onClick={handleEditPictureClicked}>Edit</label>


                     }

               </div>
               
               <div className="flex flex-col gap-1 items-center">
                    <label className="font-semibold text-start text-xs opacity-25">Username</label>
                    <p className="font-semibold text-start text-xs opacity-65">@fka.breiddy</p>
             
                     <label className="font-semibold text-start text-xs opacity-25">Full name</label>
                    <p className="font-semibold text-start text-xs opacity-65">Breiddy Garcia</p>
             
               </div>

                

             
              


                       

            </div>
                    
                    {(user.imageFile) ?
                        <>

                       
                        
                        
                        </>
                        :

                            <Input
                            type="file"
                            onChange={handleFileChange}
                            ref={profilePictureInput}
                            name="profilePicture"
                            accept="image/png, image/jpeg, image/webp, image/jpg"
                            multiple={false}
                            className="w-full  cursor-pointer border-2 invisible border-dashed border-default-100/80 hover:border-blue-700 items-center rounded-xl transition-all"
                            radius="md"
                            style={{display: "none"}}
                            variant=""
                            required={false}
                        >
                        </Input>
                    
                    }
                   
                    
             
                      
                 
               
                        
            
        </div>
           

    );
}

export default CreateProfilePictureForm;
