'use client'
import { Button } from "@/components/ui/button"

export default function ExtensionPage() {
    const handleClose = () => window.close()
    return (
        <div className="flex gap-2 flex-col min-h-[90vh] w-full items-center justify-center">
            <p className="text-lg">click <b>wizarmark extension</b> icon to get started</p>
            <Button variant="outline" onClick={handleClose}>
                Close
            </Button>
        </div>
    )
}