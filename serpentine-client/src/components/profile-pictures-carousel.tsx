import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Image } from "@heroui/image"
import { pictures } from "@/helpers/profile-pictures-variants-helper"
interface ProfilePictureCarouselProps{

    onSelected: (picture : string) => void
}
 
const ProfilePictureCarousel: React.FC<ProfilePictureCarouselProps> = ({onSelected}) => {


  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }
 

    api.on("select", () => {
      onSelected(pictures[api.selectedScrollSnap()]);
    })
    
  }, [api])
 

  return (
    <Carousel setApi={setApi} style={{maxWidth: "50%"}} className=" max-w-xs">
      <CarouselContent>
        {pictures.map((picture, index) => (
          <CarouselItem key={index}>
            <div className="p-1 flex  items-center justify-center">
              
                    <Image
                      
                      alt="HeroUI Album Cover"
                      className="rounded-full border-default/90 object-cover"
                  
                      src={picture}
                      width={80}
                      height={80}
                  />
              
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default ProfilePictureCarousel;