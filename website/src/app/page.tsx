import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import WaitlistForm from "@/components/waitlist-form";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between px-5 py-2">
        <Link href='/' className="text-2xl">WizarMark</Link>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger>
              <Button>Join Waitlist</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <WaitlistForm />
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <a href="https://github.com/kshitij-hash/WizarMark" target="_blank" rel="noopener noreferrer">
            <Button variant='ghost'>
              <GitHubLogoIcon />
            </Button>
          </a>
          <ModeToggle />
        </div>
      </header>
      <Separator />

      <main className="flex-grow">
        <section className="px-5 pt-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to WizarMark</h1>
          <p className="text-lg mb-4 text-center">
            Stop bookmarking and forgetting!<br />Unclutter your links effortlessly with WizarMark.<br />Organize, search, and get instant context for every bookmark with ease.
            <br />
            WizarMark is your browser extension for seamless bookmark management across different browsers without the hassle of importing or exporting your bookmarks.
          </p>
        </section>
      </main>
      <Separator />

      <footer className="py-4 text-center">
        <p className="text-sm">&copy; 2024 WizarMark. All rights reserved.</p>
      </footer>
    </div>

  );
}
