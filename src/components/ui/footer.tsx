'use client'

import Link from "next/link";
import { CenterUnderline, ComesInGoesOutUnderline, GoesOutComesInUnderline } from "@/components/ui/underline-animation";


function Footer() {
  return (
    <footer className="font-semibold flex justify-center items-center py-12 w-full">
      <div className="flex flex-row font-overusedGrotesk items-start text-[#0015ff] uppercase space-x-8 text-xs sm:text-sm md:text-base lg:text-lg">
        <div>Contact</div>
        <ul className="flex flex-col space-y-1 h-full">
          <Link href={"mailto:appiahboaduprince@gmail.com"} target="_blank">
            <CenterUnderline label="EMAIL" />
          </Link>
          <Link href={"https://x.com/0xed8"} target="_blank">
            <ComesInGoesOutUnderline label="X (TWITTER)" direction="right" />
          </Link>
          <Link href={"https://github.com/blackprince001"} target="_blank">
            <ComesInGoesOutUnderline label="GITHUB" direction="left" />
          </Link>

          {/* <div className="pt-12">
            <ul className="flex flex-col space-y-1 h-full">
              <Link href={"mailto:appiahboaduprince@gmail.com"} target="_blank">
                <GoesOutComesInUnderline
                  label="APPIAHBOADUPRINCE@GMAIL.COM"
                  direction="left"
                />
              </Link>
            </ul>
          </div> */}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;