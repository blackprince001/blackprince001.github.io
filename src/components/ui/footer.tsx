import Link from "next/link";
import React from "react";
import { BiEnvelope } from "react-icons/bi";

function Footer() {
  return (
    <footer className="flex justify-between items-center max-w-3xl mx-auto h-full px-6 py-5">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 my-5">
          <Link href={"mailto:appiahboaduprince@gmail.com"} target="_blank">
            <button className="btn rounded-full">
              <BiEnvelope />
              <p className="text-sm mt-0">contact</p>
            </button>
          </Link>
        </div>

      <p>
        © {new Date().getFullYear()} Copyright not Reserved.
      </p>
    </footer>
  );
}

export default Footer;
