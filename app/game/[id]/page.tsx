"use client";

import GameBoard from "@/components/GameBoard";
import SelectPlayer from "@/components/SelectPlayer";
import useGameBoard from "@/hooks/useGame";
import { useParams } from "next/navigation";
import React from "react";

export default function Game() {
  const { id } = useParams();
  const game = useGameBoard(id);

  return game.selectPlayer ? (
    <GameBoard game={game} />
  ) : (
    <SelectPlayer game={game} />
  );
}
