"use client";

export default function LogoutButton() {
  function logout() {
    localStorage.removeItem("reven_user");
    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      className="rounded-full border border-white/15 px-6 py-4 font-semibold text-white hover:bg-white/10"
    >
      Logout
    </button>
  );
}