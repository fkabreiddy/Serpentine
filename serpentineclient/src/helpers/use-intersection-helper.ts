import { useEffect, useState } from "react";

export const useIntersection = (elementId: string, rootMargin: any) => {
  const [isVisible, setState] = useState(false);

   useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setState(entry.isIntersecting);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementId]);


  return isVisible;
};