"use client";

import { useEffect, useState } from "react";

export default function RequireLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("reven_user");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setAllowed(true);
  }, []);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-400">Checking session...</p>
      </main>
    );
  }

  return <>{children}</>;
}