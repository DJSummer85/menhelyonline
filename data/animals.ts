export type AnimalSpecies = "kutya" | "macska" | "ragcsalo" | "madar" | "hullo";
export type AnimalGender = "hím" | "nőstény";
export type AnimalSize = "kicsi" | "közepes" | "nagy";
export type AnimalAge = "kölyök" | "felnőtt" | "idős";
export type CoatType = "rövid" | "közepes" | "hosszú";

export interface Animal {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed?: string;
  age: AnimalAge;
  ageText: string;
  gender: AnimalGender;
  size: AnimalSize;
  coat: CoatType;
  location: string;
  shelter: string;
  shelterId: string;
  image: string;
  description: string;
  childFriendly: boolean;
  transportHelp: boolean;
  indoorOutdoor: "benti" | "kinti" | "mindkettő";
  getsAlongWithOtherAnimals: boolean;
  urgent: boolean;
  featured: boolean;
  vaccinated: boolean;
  neutered: boolean;
  vaccinatedAt: boolean;
  sick?: boolean;
  sickDescription?: string;
  pickupLine?: string;
  createdAt: string;
  images?: string[];
  demo?: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  county: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website?: string;
  description: string;
  animalCount: number;
  image: string;
  demo?: boolean;
}

export const animals: Animal[] = [
  // ── DEMO állatok (1-1 fajtánként) ──
  {
    id: "1", name: "Bogyó", species: "kutya", breed: "keverék", age: "felnőtt",
    ageText: "2 éves", gender: "hím", size: "közepes", coat: "rövid",
    location: "Zalaegerszeg", shelter: "Bogáncs Menhely", shelterId: "s1",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
    description: "Bogyó egy vidám, barátságos kutya, aki imád sétálni és játszani. Kiskutyákkal és gyerekekkel is jól kijön.",
    childFriendly: true, transportHelp: true, indoorOutdoor: "kinti",
    getsAlongWithOtherAnimals: true, urgent: false, featured: true,
    vaccinated: true, neutered: true, vaccinatedAt: true,
    pickupLine: "Veled sétálnék minden nap a parkban! 🐾",
    createdAt: "2026-06-15", demo: true,
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "3", name: "Mici", species: "macska", breed: "rövidszőrű", age: "felnőtt",
    ageText: "3 éves", gender: "nőstény", size: "kicsi", coat: "rövid",
    location: "Debrecen", shelter: "Bogáncs Menhely", shelterId: "s1",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop",
    description: "Mici egy nyugodt, ölelgetni való macska. Szeret a ablakban napozni és a gazdája ölében dorombolni.",
    childFriendly: true, transportHelp: false, indoorOutdoor: "benti",
    getsAlongWithOtherAnimals: true, urgent: false, featured: true,
    vaccinated: true, neutered: true, vaccinatedAt: true,
    pickupLine: "Az öledben szívesen dorombolnék egész nap 😻",
    createdAt: "2026-05-01", demo: true,
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "5", name: "Nyuszi", species: "ragcsalo", breed: "törpenyúl", age: "felnőtt",
    ageText: "1.5 éves", gender: "hím", size: "kicsi", coat: "közepes",
    location: "Pécs", shelter: "Bogáncs Menhely", shelterId: "s1",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop",
    description: "Nyuszi egy aranyos törpenyúl, aki szereti a répát és a friss zöldet. Gyerekek mellé is kiváló.",
    childFriendly: true, transportHelp: true, indoorOutdoor: "benti",
    getsAlongWithOtherAnimals: true, urgent: false, featured: true,
    vaccinated: true, neutered: true, vaccinatedAt: true,
    pickupLine: "Kicsi vagyok, de a szívem hatalmas! 💛",
    createdAt: "2026-08-01", demo: true,
    images: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "9", name: "Picur", species: "madar", breed: "hullámos papagáj", age: "felnőtt",
    ageText: "2 éves", gender: "hím", size: "kicsi", coat: "rövid",
    location: "Székesfehérvár", shelter: "Rex Állatotthon", shelterId: "s2",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=400&fit=crop",
    description: "Picur egy beszédes papagáj, aki szereti a zenét és a társaságot. Színes tollazata van.",
    childFriendly: true, transportHelp: true, indoorOutdoor: "benti",
    getsAlongWithOtherAnimals: false, urgent: false, featured: true,
    vaccinated: true, neutered: false, vaccinatedAt: true,
    pickupLine: "Nevetnélek minden nap, ha hazavinnél! 🎶",
    createdAt: "2026-06-01", demo: true,
  },
  {
    id: "10", name: "Zöldi", species: "hullo", breed: "leopárdgekkó", age: "felnőtt",
    ageText: "3 éves", gender: "hím", size: "kicsi", coat: "rövid",
    location: "Szeged", shelter: "Rex Állatotthon", shelterId: "s2",
    image: "https://static.posters.cz/image/750/green-gecko-on-leaf-i240138.jpg",
    description: "Zöldi egy szelíd gekkó, könnyen tartható. Terráriumba való, nem igényel sok figyelmet.",
    childFriendly: true, transportHelp: true, indoorOutdoor: "benti",
    getsAlongWithOtherAnimals: false, urgent: false, featured: true,
    vaccinated: false, neutered: false, vaccinatedAt: false,
    pickupLine: "Különleges vagyok, mint a te életed! 🦎",
    createdAt: "2026-07-14", demo: true,
  },
];

export const shelters: Shelter[] = [
  // ── DEMO menhelyek ──
  {
    id: "s1",
    name: "Bogáncs Menhely",
    location: "Zalaegerszeg",
    county: "Zala",
    lat: 46.8407,
    lng: 16.8506,
    phone: "+36 92 312 456",
    email: "info@bogancs.hu",
    website: "https://bogancs.hu",
    description: "2005 óta működő állatmenhely Zalaegerszegen. Főleg kutyáknak és macskáknak adunk otthont, amíg gazdit találnak. Családias hangulatban, szerető gondozókkal várjuk az örökbefogadókat. Heti rendszerességgel szervezünk nyílt napokat és sétáltatásokat.",
    animalCount: 0,
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&h=500&fit=crop",
    demo: true,
  },
  {
    id: "s2",
    name: "Rex Állatotthon",
    location: "Budapest",
    county: "Budapest",
    lat: 47.4979,
    lng: 19.0402,
    phone: "+36 1 234 5678",
    email: "rex@allatotthon.hu",
    website: "https://rexallatotthon.hu",
    description: "Budapest egyik legnagyobb és legrégebbi állatotthona. Több mint 20 éve segítünk a rászoruló állatokon. Korszerű állatorvosi rendelővel, oktatási programokkal és önkéntesi lehetőségekkel várjuk a látogatókat.",
    animalCount: 0,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=500&fit=crop",
    demo: true,
  },
];

export const COUNTIES = [
  "Baranya", "Budapest", "Fejér", "Zala",
];

export interface Testimonial {
  id: string;
  name: string;
  animalName: string;
  animalImage: string;
  shelterName: string;
  text: string;
  date: string;
  rating: number;
  demo?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Kovács Anna",
    animalName: "Bodri",
    animalImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
    shelterName: "Bogáncs Menhely",
    text: "Bodrit a Bogáncs Menhelyről fogadtuk örökbe 2 hónapja. Azóta a családunk teljes értékű tagja lett. Imád a gyerekekkel játszani és minden este az ölembe bújik. Hálásak vagyunk, hogy rátaláltunk!",
    date: "2026-06-15",
    rating: 5,
    demo: true,
  },
  {
    id: "t2",
    name: "Nagy Péter",
    animalName: "Cirmi",
    animalImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop",
    shelterName: "Rex Állatotthon",
    text: "Először féltem a macska örökbefogadástól, de a Rex csapata végig segített. Cirmi azóta a lakás ura, és minden nap hálás vagyok, hogy örökbe fogadtam.",
    date: "2026-05-20",
    rating: 5,
    demo: true,
  },
];

/** Calculate days since animal was added */
export function daysWaiting(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Find similar animals (same species, similar size, excluding self) */
export function findSimilarAnimals(animal: Animal, limit = 3): Animal[] {
  return animals
    .filter((a) => a.id !== animal.id)
    .map((a) => {
      let score = 0;
      if (a.species === animal.species) score += 3;
      if (a.size === animal.size) score += 2;
      if (a.age === animal.age) score += 1;
      if (a.childFriendly === animal.childFriendly) score += 1;
      if (a.indoorOutdoor === animal.indoorOutdoor) score += 1;
      return { animal: a, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((a) => a.animal);
}

/** Get animal of the day (deterministic based on date) */
export function getAnimalOfTheDay(): Animal {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % animals.length;
  return animals[index];
}

/** Haversine distance between two coordinates in km */
export function getDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Sort shelters by distance from user */
export function sortSheltersByDistance(
  sheltersList: Shelter[],
  userLat: number,
  userLng: number
): (Shelter & { distance: number })[] {
  return sheltersList
    .map((s) => ({
      ...s,
      distance: getDistanceKm(userLat, userLng, s.lat, s.lng),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/** Share URL for an animal */
export function getShareUrl(animal: Animal): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/animals/${animal.id}`;
  }
  return `/animals/${animal.id}`;
}

export const SPECIES_FILTERS: { value: AnimalSpecies; label: string; icon: string }[] = [
  { value: "kutya", label: "Kutya", icon: "🐕" },
  { value: "macska", label: "Macska", icon: "🐱" },
  { value: "ragcsalo", label: "Rágcsáló", icon: "🐹" },
  { value: "madar", label: "Madár", icon: "🦜" },
  { value: "hullo", label: "Hüllő", icon: "🦎" },
];
