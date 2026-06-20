import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import ProfileClient from "@/components/profile/ProfileClient";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-black py-24 text-white">
      <Container>
        <a href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
          ← Back to Dashboard
        </a>

        <h1 className="mt-10 text-4xl font-bold md:text-6xl">Profile</h1>
        <p className="mt-4 text-zinc-400">
          Manage your Reven identity, Telegram verification, wallet, and account details.
        </p>

        <GlassCard className="mt-12 p-6">
          <ProfileClient />
        </GlassCard>
      </Container>
    </main>
  );
}