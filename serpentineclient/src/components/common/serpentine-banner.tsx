interface SerpentineBannerProps {
  fontSize: number;
}

export default function SerpentineBanner({
  fontSize = 1700,
}: SerpentineBannerProps) {
  return (
    <>
      <div className="w-full h-screen  relative overflow-hidden">
        <div className="doodle-pattern absolute inset-0 z-0 w-full h-full"></div>

        <div className="absolute perspective-dramatic  inset-0 flex justify-center items-center z-10">
          <p
            style={{ fontSize: fontSize + "px", lineHeight: 1 }}
            className=" select-none rotate-[-40deg] outlined-text rainbow rainbow_text_animated font-bold"
          >
            S
          </p>
        </div>
      </div>
    </>
  );
}
