import React from "react";
import { useAuthStore } from "@/contexts/authentication-context";

interface AuthorizeViewProps {
  children: React.ReactNode;
  else?: React.ReactNode;
}

export const AuthorizeView = ({
  children,
  else: elseContent,
}: AuthorizeViewProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasAccess = isAuthenticated;

  return <>{hasAccess ? children : (elseContent ?? null)}</>;
};
