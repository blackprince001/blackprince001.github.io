import Link from "next/link";
import React from "react";
import { CiBarcode, CiMail, CiTwitter } from "react-icons/ci";

function Footer() {
  return (
    <footer className="font-semibold flex justify-center items-center max-w-3xl mx-auto h-full px-6 py-5">
        <ul className="flex flex-col sm:flex-row sm:items-center gap-5 my-5 px-6 py-5">
          <Link href={"mailto:appiahboaduprince@gmail.com"} target="_blank" className="hover:underline">
            <CiMail />
          </Link>
        </ul>

        <ul className="flex flex-col sm:flex-row sm:items-center gap-5 my-5 px-6 py-5">
          <Link href={"https://x.com/0xed8"} target="_blank" className="hover:underline">
            <CiTwitter />
          </Link>
        </ul>
{/*         
        <ul className="flex flex-col sm:flex-row sm:items-center gap-5 my-5">

          <Link href={"https://github.com/blackprince001"} target="_blank" className="hover:underline">
            <CiBarcode />
          </Link>
        </ul> */}
    </footer>
  );
}

export default Footer;
