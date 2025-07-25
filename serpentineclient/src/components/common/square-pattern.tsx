import { useTheme } from "@heroui/use-theme";
import { useEffect, useState } from "react";

export default function SquarePattern() {
  const [mode, setMode] = useState("dark");
  const { theme } = useTheme();

  useEffect(() => {
    const mode = localStorage.getItem("heroui-theme");
    setMode(mode ?? "light");
  }, [theme]);

  return (
    <div
      className="absolute inset-0 z-0 h-full w-full opacity-20"
      style={{
        background: "transparent",
        backgroundImage: `
                    linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
                    radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
                `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      }}
    />
  );
}
