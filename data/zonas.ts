export type ZonaInfo = {
  nombre: string;
  centro: { latitude: number; longitude: number };
};

export const ZONAS_INFO: ZonaInfo[] = [
  { nombre: "Sopocachi",  centro: { latitude: -16.5107, longitude: -68.1287 } },
  { nombre: "Miraflores", centro: { latitude: -16.5076, longitude: -68.1193 } },
  { nombre: "San Pedro",  centro: { latitude: -16.5059, longitude: -68.1368 } },
  { nombre: "El Alto",    centro: { latitude: -16.5004, longitude: -68.1950 } },
  { nombre: "Centro",     centro: { latitude: -16.4957, longitude: -68.1334 } },
];