const adjectives = [
  "AMBER",
  "BRIGHT",
  "CALM",
  "CLEAR",
  "COOL",
  "CRISP",
  "DEEP",
  "EAGER",
  "FAIR",
  "FRESH",
  "GENTLE",
  "GREEN",
  "HAPPY",
  "HONEST",
  "KIND",
  "LIGHT",
  "LIVELY",
  "MELLOW",
  "OPEN",
  "PLAIN",
  "QUICK",
  "QUIET",
  "READY",
  "SHARP",
  "SMART",
  "SOLID",
  "STEADY",
  "SUNNY",
  "SWIFT",
  "WARM",
  "WISE",
  "ZESTY",
] as const;

const nouns = [
  "ANCHOR",
  "BAKER",
  "BEACON",
  "BRIDGE",
  "CANDLE",
  "CIRCLE",
  "FIELD",
  "GARDEN",
  "HARBOR",
  "LANTERN",
  "MAPLE",
  "MARKET",
  "MEADOW",
  "ORCHARD",
  "PATH",
  "PLANET",
  "RIVER",
  "SIGNAL",
  "SPARK",
  "STATION",
  "STREAM",
  "SUMMIT",
  "TABLE",
  "THREAD",
  "VALLEY",
  "WINDOW",
  "WORKSHOP",
  "WRITER",
  "YARD",
  "ZEPHYR",
  "ZONE",
  "COURTYARD",
] as const;

export const ROOM_CODE_PATTERN = /^[A-Z]+-[A-Z]+-\d{2}$/;
export const ROOM_CODE_SPACE_SIZE =
  adjectives.length * nouns.length * 100;

export function generateRoomCode(random = Math.random) {
  const adjective = adjectives[Math.floor(random() * adjectives.length)];
  const noun = nouns[Math.floor(random() * nouns.length)];
  const number = Math.floor(random() * 100)
    .toString()
    .padStart(2, "0");

  return `${adjective}-${noun}-${number}`;
}

export function normalizeRoomCode(input: string) {
  return input.trim().toUpperCase().replaceAll(/\s+/g, "-");
}

export function isValidRoomCode(input: string) {
  return ROOM_CODE_PATTERN.test(input);
}
