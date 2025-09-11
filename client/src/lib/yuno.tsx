// client/src/lib/yuno.ts
import { useRef, useCallback } from "react";
import type { YunoInstance } from "@yuno-payments/sdk-web-types";
import { loadScript } from "@yuno-payments/sdk-web";

export function useYuno() {
  const ref = useRef<YunoInstance | null>(null);

  const ensureYuno = useCallback(async (): Promise<YunoInstance> => {
    if (ref.current) return ref.current;

    const publicKey =
      import.meta.env.VITE_YUNO_PUBLIC_KEY ||
      import.meta.env.VITE_YUNO_API_KEY;
    if (!publicKey) {
      throw new Error("VITE_YUNO_PUBLIC_KEY ausente no cliente.");
    }

    let sdk: any | undefined;

    // 1) Normal path
    try {
      sdk = await loadScript();
    } catch (e) {
      console.error("Yuno loadScript() falhou:", e);
    }

    // 2) Fallback: window.Yuno (se algum script externo expôs global)
    if (!sdk?.initialize) {
      const g: any = (window as any).Yuno;
      if (g?.initialize) {
        ref.current = (await g.initialize(publicKey)) as YunoInstance;
        return ref.current;
      }
    }

    // 3) Fallback: dynamic import and constructor
    if (!sdk?.initialize) {
      try {
        const mod: any = await import("@yuno-payments/sdk-web");
        if (typeof mod?.Yuno === "function") {
          // algumas versões expõem classe Yuno
          ref.current = new mod.Yuno(publicKey) as YunoInstance;
          return ref.current;
        }
      } catch (e) {
        console.error("import('@yuno-payments/sdk-web') falhou:", e);
      }
    }

    if (!sdk?.initialize) {
      throw new Error(
        "Yuno SDK não carregou. Verifique ad-block/Brave, rede e a versão de @yuno-payments/sdk-web."
      );
    }

    ref.current = (await sdk.initialize(publicKey)) as YunoInstance;
    return ref.current;
  }, []);

  return { ensureYuno };
}
