// src/components/SessionProviderWrapper.tsx
'use client'; // Ce composant doit être un Client Component

import { SessionProvider } from "next-auth/react";
import React from "react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Le SessionProvider fournit le contexte de session aux composants enfants
  return <SessionProvider>{children}</SessionProvider>;
}