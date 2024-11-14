import ProudGhanaian from "@/components/ui/pg";
import Link from "next/link";
import Image from "next/image";

function HeroSection() {
  return (
    <div className="mt-6 pb-[10vh]">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="font-bold">blackprince</h1>
          <p className="font-semibold text-gray-500">
              Computer Engineer, Researcher and Design Architect
          </p>
        </div>

        <div>
          <div className="flex justify-end items-center">
            <ProudGhanaian />
          </div>
        </div>
      </div>

      <br />
      <div>
        <p>
        I had my undergraduate studies at <Link className="hover:underline" href="https://www.knust.edu.gh">Kwame Nkrumah University of Science and Technology.</Link>
        </p>
        <br />
          <Image src='https://blackprince001.github.io/images/drone.png' alt={"Drone"} width={500} height={600}/>
        <p>
        My passion lies in creating interactive software and systems that fosters idea sharing and personal expression. As a generalist, I am deeply invested in both technical and non-technical fields: hoping to bridge the gap between them. I believe that these fundamental aspects are crucial for developing meaningful products and research.
        </p>
        <br />
        <p>
        While pursuing my studies at Kwame Nkrumah University of Science and Technology, I have gained valuable experience in diverse contexts and political environments. This exposure has equipped me to tackle challenges head-on and adapt to various work environments.
        </p>
      </div>
    </div>
  );
}

export default HeroSection;
