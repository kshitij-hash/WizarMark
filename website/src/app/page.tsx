import { Separator } from "@/components/ui/separator";
import { images } from "../constants/index";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <main className="flex-grow">
        <section className="px-5 pt-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to WizarMark</h1>
          <p className="text-lg mb-4 text-center">
            Stop bookmarking and forgetting!
            <br />
            Unclutter your links effortlessly with WizarMark.
            <br />
            Organize, search, and get instant context for every bookmark with
            ease.
            <br />
            WizarMark is your browser extension for seamless bookmark management
            across different browsers without the hassle of importing or
            exporting your bookmarks.
          </p>
        </section>
        <section className="px-5 pt-10 flex flex-col items-center">
          <Carousel className="w-full lg:max-w-lg">
            <CarouselContent className="-ml-1">
              {images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/2 lg:basis-full"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent
                        key={image.id}
                        className="h-[300px] rounded-md relative bg-transparent"
                      >
                        <Image
                          src={image.src}
                          alt={"image-carousel"}
                          className="h-full w-full relative object-cover object-top rounded-md overflow-hidden"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </main>
      <Separator />

      <footer className="py-4 text-center">
        <p className="text-sm">&copy; 2024 WizarMark. All rights reserved.</p>
      </footer>
    </div>
  );
}
