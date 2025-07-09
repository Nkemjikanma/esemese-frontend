import { motion, useMotionValueEvent, useScroll } from "motion/react";
import type React from "react";
import { useRef, useState } from "react";
import type { PinataFile } from "@/hooks/useGetFavourites";
import { ipfsURL } from "@/lib/utils";

export interface PhotoItemProp {
  id: number;
  url: string;
  title: string;
  photographer: string;
  date: string;
  description: string;
  location: string;
}

export function PhotoItem({ photo }: { photo: PinataFile; index?: number }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  return (
    <section className="relative h-full w-full snap-start snap-always flex items-center justify-center">
      <div className="relative w-full flex flex-row justify-center gap-2">
        <motion.div
          ref={ref}
          className="w-5/12 sticky top-0 m-0 h-1/2"
          // style={{
          // 	opacity: progress,
          // }}
        >
          <div className="">
            <motion.h2
              className="text-3xl font-bold"
              style={{
                opacity: progress < 0.2 ? progress * 5 : 1,
              }}
            >
              {photo.name}
            </motion.h2>

            <motion.p
              className="text-xl"
              style={{
                opacity: progress < 0.3 ? (progress - 0.2) * 5 : 1,
              }}
            >
              By Nkemjika
            </motion.p>

            {/* <motion.p
              className="text-lg"
              style={{
                opacity: progress < 0.4 ? (progress - 0.25) * 5 : 1,
              }}
            >
              {photo.location}
            </motion.p> */}

            <motion.p
              className="text-sm text-gray-500"
              style={{
                opacity: progress < 0.6 ? (progress - 0.3) * 5 : 1,
              }}
            >
              {photo.created_at}
            </motion.p>

            <motion.p
              className="text-base"
              style={{
                opacity: progress < 0.65 ? (progress - 0.35) * 5 : 1,
              }}
            >
              {photo.keyvalues?.description}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="w-full h-full"
          style={
            {
              // opacity: progress,
              // x: progress * 0 + 100 * (1 - progress), // Slides in from right
            }
          }
        >
          <div className="relative aspect-[16/9] w-full">
            <img
              src={ipfsURL(photo.cid, photo.name)}
              alt={photo.name}
              className="object-cover rounded-none"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
