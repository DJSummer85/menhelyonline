"use client";

import { useRouter } from "next/navigation";
import { type Animal } from "@/data/animals";
import AnimalCard from "@/components/AnimalCard";

interface AnimalCardWithModalProps {
  animal: Animal;
}

export default function AnimalCardWithModal({ animal }: AnimalCardWithModalProps) {
  const router = useRouter();

  return (
    <AnimalCard
      animal={animal}
      onClick={() => router.push(`/animals/${animal.id}`)}
    />
  );
}
