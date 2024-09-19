import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="font-semibold flex justify-between items-center max-w-3xl mx-auto h-full px-6 py-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 my-5">
          Email:
          <Link href={"mailto:appiahboaduprince@gmail.com"} target="_blank">
            <p className="mt-0">appiahboaduprince@gmail.com</p>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 my-5">
          Twitter:
          <Link href={"https://x.com/0xed8"} target="_blank">
            <p className="mt-0">@0xed8</p>
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 my-5">
          Github:
          <Link href={"https://github.com/blackprince001"} target="_blank">
            <p className="mt-0">@blackprince001</p>
          </Link>
        </div>
    </footer>
  );
}

export default Footer;
