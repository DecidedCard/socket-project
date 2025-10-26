"use client";

import GameBoard from "@/components/GameBoard";
import SelectPlayer from "@/components/SelectPlayer";
import useGameBoard from "@/hooks/useGame";
import { useParams } from "next/navigation";
import React from "react";

export default function Game() {
  const { id } = useParams();
  const {
    check,
    me,
    player,
    members,
    selectPlayer,
    winner,
    onClickUpdateStoneHandler,
    onClickGameStartHandler,
    onClickHandler,
    onClickReset,
  } = useGameBoard(id);

  return selectPlayer ? (
    <GameBoard
      check={check}
      me={me}
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
