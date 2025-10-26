"use client";

import GameBoard from "@/components/GameBoard";
import useGameBoard from "@/hooks/useGame";
import React from "react";

export default function Game() {
  const game = useGameBoard();

  return <GameBoard game={game} />;
}
