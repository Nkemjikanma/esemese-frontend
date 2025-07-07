import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const gateway = "salmon-realistic-muskox-762.mypinata.cloud";

export const ipfsURL = (cid: string, filename: string): string => {
  return `https://${gateway}/ipfs/${cid}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_KEY}`;
};
