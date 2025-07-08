import { Instagram, Mail, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { socials } from "@/lib/constants";

interface AboutSectionProps {
  className?: string;
}

export const AboutSection = ({ className = "" }: AboutSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className={`w-full py-16 dark:bg-black ${className}`}>
      <div className="w-10/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-7">
        {/* Left column - Photo */}
        <div className="relative overflow-hidden h-[400px] w-full">
          <div
            className={`absolute inset-0 bg-gray-200 dark:bg-zinc-900 ${
              imageLoaded ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500`}
          ></div>
          <img
            src="/esemese_2.png"
            alt="Esemese - Captured moments"
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Right column - Info */}
        <div className="relative flex flex-col justify-center h-[400px] col-span-2">
          <h4 className="font-normal">ABOUT</h4>
          <h1 className="text-4xl md:text-5xl font-light mb-3">Esemese</h1>

          <div className="w-12 h-1 bg-amber-600 mb-4"></div>

          <p className="text-lg mb-6 leading-relaxed text-zinc-700 dark:text-zinc-300">
            Captured moments that tell stories. The intersection of emotions,
            memories, action, light, and perspective. Images that resonate
            beyond the visual.
          </p>

          <p className="text-lg mb-7 leading-relaxed text-zinc-700 dark:text-zinc-300">
            Based in the United Kingdom but available worldwide, for shoots and
            commissions.
          </p>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-zinc-500">
              Connect
            </h3>
            <div className="flex space-x-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.profile}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-none border-zinc-300 dark:border-zinc-700"
                >
                  <img
                    src={social.logo}
                    alt={social.name}
                    className="w-8 h-8"
                  />
                </a>
              ))}
            </div>
            <div className="pt-6">
              <Button className="rounded-none bg-black backdrop-blur-md isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 hover:before:w-full before:-left-full hover:before:left-0 before:rounded-full before:bg-amber-600 text-gray-50 dark:text-gray-50 before:-z-10 before:aspect-square hover:before:scale-150 hover:before:duration-700 relative z-10 px-6 py-2 overflow-hidden">
                Contact Me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
