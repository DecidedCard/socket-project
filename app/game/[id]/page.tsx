"use client";

import GameBoard from "@/components/GameBoard";
import SelectPlayer from "@/components/SelectPlayer";
import useGameBoard from "@/hooks/useGame";
import React from "react";

export default function Game() {
  const {
    check,
    player,
    members,
    selectPlayer,
    winner,
    onClickUpdateStoneHandler,
    onClickGameStartHandler,
    onClickHandler,
    onClickReset,
  } = useGameBoard();

  return selectPlayer ? (
    <GameBoard
      check={check}
      player={player}
      winner={winner}
      onClickHandler={onClickHandler}
      onClickReset={onClickReset}
    />
  ) : (
    <SelectPlayer
      members={members}
      onClickUpdateStoneHandler={onClickUpdateStoneHandler}
      onClickGameStartHandler={onClickGameStartHandler}
    />
  );
}
