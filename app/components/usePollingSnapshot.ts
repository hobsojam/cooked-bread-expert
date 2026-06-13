"use client";

import { useEffect, useState } from "react";

export function usePollingSnapshot<TSnapshot>(
  apiPath: string,
  initialSnapshot: TSnapshot | null,
) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function refresh() {
      try {
        const response = await fetch(apiPath, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!isMounted) {
          return;
        }

        if (response.status === 404) {
          setSnapshot(null);
          return;
        }

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          snapshot: TSnapshot | null;
        };
        setSnapshot(payload.snapshot);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
      }
    }

    const interval = window.setInterval(refresh, 2_000);
    void refresh();

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(interval);
    };
  }, [apiPath]);

  return snapshot;
}
