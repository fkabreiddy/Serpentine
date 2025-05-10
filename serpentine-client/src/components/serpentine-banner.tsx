export default function SerpentineBanner() {

    return(
        <>
         <div className="w-full h-screen max-sm:h-[50vh] relative overflow-hidden">
            <div className="doodle-pattern absolute inset-0 z-0 w-full h-full"></div>

            <div className="absolute inset-0 flex justify-center items-center z-10">
                <p
                style={{ fontSize: "700px", lineHeight:1  }}
                className="select-none rotate-[-40deg] outlined-text rainbow rainbow_text_animated font-bold"
                >
                S
                </p>
            </div>
        </div>


        </>
    )
}