import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";
import WaitlistForm from "./waitlist-form";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-between px-5 py-2">
            <Link href="/" className="text-2xl">
                WizarMark
            </Link>
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Join Waitlist</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <WaitlistForm />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <a
                    href="https://github.com/kshitij-hash/WizarMark"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="ghost">
                        <GitHubLogoIcon />
                    </Button>
                </a>
                <ModeToggle />
            </div>
        </nav>
    )
}