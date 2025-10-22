import { SIZE } from "@/const";

export const inBounds = (r: number, c: number) =>
  r >= 0 && r < SIZE && c >= 0 && c < SIZE;
