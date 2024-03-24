"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/verified");
  };

  return (
    <div>
      <button onClick={handleClick}>Verificar</button>
    </div>
  );
}
