import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-6 text-center">
      <h1 className="text-9xl font-bebas text-glow text-transparent bg-clip-text bg-gradient-to-b from-[#ff0033] to-[#7A0000] mb-4">
        404
      </h1>
      <h2 className="text-4xl font-bebas text-white tracking-wide mb-6">
        PAGE NOT FOUND
      </h2>
      <p className="text-gray-400 font-poppins max-w-md mx-auto mb-10 text-lg">
        The page you are looking for doesn't exist, has been moved, or is currently under construction.
      </p>
      <Link href="/">
        <button className="bg-white text-black px-8 py-4 font-montserrat uppercase tracking-wider font-bold text-sm flex items-center justify-center space-x-2 hover:bg-[#ff0033] hover:text-white transition-colors group">
          <span>Back To Home</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  );
}
