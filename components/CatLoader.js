import { cat } from "../public/cat.png";
import Image from "next/image";

export default function CatLoader() {
  return (
    <div className="flex animate-spin-slow h-10 w-10">
      <Image width="70" height="70" src="/../public/cat.png">
        {cat}
      </Image>
    </div>
  );
}
