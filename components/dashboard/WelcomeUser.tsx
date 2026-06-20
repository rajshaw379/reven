"use client";

import { useEffect, useState } from "react";

type User = {
  username: string;
  fullName: string;
};

export default function WelcomeUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("reven_user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <h1 className="mt-3 text-4xl font-bold md:text-6xl">
      Welcome back, {user?.fullName || user?.username || "Guest"}
    </h1>
  );
}