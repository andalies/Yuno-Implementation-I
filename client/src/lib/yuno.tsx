import React, { createContext, useCallback, useContext, useRef } from "react";
import type { YunoInstance } from "@yuno-payments/sdk-web-types";

type Ctx = {
  ensureYuno: () => Promise<YunoInstance>;
};

const YunoCtx = createContext<Ctx | null>(null);

export const YunoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const yunoRef = useRef<YunoInstance | null>(null);

  const ensureYuno = useCallback(async () => {
    if (yunoRef.current) return yunoRef.current;

    const publicKey = import.meta.env.VITE_YUNO_PUBLIC_KEY || import.meta.env.VITE_YUNO_API_KEY;
    if (!publicKey) throw new Error("Chave pública da Yuno ausente (VITE_YUNO_PUBLIC_KEY).");

    // robust dynamic import that works across builds
    const mod: any = await import("@yuno-payments/sdk-web");
    const loadScript = mod.loadScript ?? mod.default;
    if (typeof loadScript !== "function") throw new Error("Falha ao localizar loadScript no SDK.");

    const sdk: any = await loadScript();
    if (!sdk?.initialize) throw new Error("SDK inválido retornado por loadScript.");

    const yuno = await sdk.initialize(publicKey); // initialize is async (v1.1)
    yunoRef.current = yuno as YunoInstance;
    return yunoRef.current!;
  }, []);

  return <YunoCtx.Provider value={{ ensureYuno }}>{children}</YunoCtx.Provider>;
};

export const useYuno = () => {
  const ctx = useContext(YunoCtx);
  if (!ctx) throw new Error("useYuno must be used inside <YunoProvider>");
  return ctx;
};
