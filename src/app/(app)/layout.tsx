import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-session";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavProfile } from "@/components/nav-profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <nav className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-primary">
            Water Tracker
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavProfile
              name={user.name}
              email={user.email}
              image={user.image ?? null}
            />
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
