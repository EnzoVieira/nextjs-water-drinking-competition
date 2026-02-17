import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

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
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <ThemeToggle />
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
