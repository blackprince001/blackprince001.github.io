import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Improved BentoGrid component
const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        "px-4 sm:px-6 lg:px-8 py-12",
        className
      )}
    >
      {children}
    </div>
  );
};

// Enhanced BentoCard component
const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]",
      "border border-[#333333] hover:border-[#404040]",
      "transform transition-all duration-300 hover:scale-[1.02]",
      "shadow-xl hover:shadow-2xl",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
    {background}

    <div className="pointer-events-none z-10 flex flex-col gap-4 p-8 transition-all duration-300 group-hover:-translate-y-5">
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-[#00ff88] transition-all duration-300 group-hover:scale-110" />
        <h3 className="text-2xl font-bold text-neutral-100">{name}</h3>
      </div>
      <p className="text-lg text-neutral-400 max-w-[80%]">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Button
        variant="ghost"
        asChild
        size="lg"
        className="pointer-events-auto bg-[#00ff88]/10 hover:bg-[#00ff88]/20 text-[#00ff88] backdrop-blur-sm"
      >
        <a href={href} className="flex items-center gap-2">
          {cta}
          <ArrowRightIcon className="h-5 w-5" />
        </a>
      </Button>
    </div>
  </div>
);

export { BentoCard, BentoGrid };