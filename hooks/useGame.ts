import { DIRS, SIZE } from "@/const";
import { Cell, Player } from "@/types";
import { inBounds } from "@/utill";
import { useEffect, useState } from "react";

const useGame = () => {
  const [check, setCheck] = useState<Cell[][]>(
    Array.from({ length: SIZE + 1 }, () => Array(SIZE + 1).fill(null))
  );
  const [player, setPlayer] = useState<Player>(Player.Black);
  const [winner, setWinner] = useState<Player | null>(null);

  const checkWin = (b: Cell[][], r: number, c: number, p: Player) => {
    for (const [dr, dc] of DIRS) {
      let cnt = 1;

      let nr = r + dr,
        nc = c + dc;
      while (inBounds(nr, nc) && b[nr][nc] === p) {
        cnt++;
        nr += dr;
        nc += dc;
      }
      nr = r - dr;
      nc = c - dc;
      while (inBounds(nr, nc) && b[nr][nc] === p) {
        cnt++;
        nr -= dr;
        nc -= dc;
      }

      if (cnt >= 5) return true;
    }
    return false;
  };

  const onClickHandler = (r: number, c: number, player: Player) => {
    setCheck((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = player;

      if (checkWin(next, r, c, player)) {
        setWinner(player);
      }
      return next;
    });
    setPlayer((p) => (p === Player.Black ? Player.White : Player.Black));
  };

  const onClickReset = () => {
    setCheck(
      Array.from({ length: SIZE + 1 }, () => Array(SIZE + 1).fill(null))
    );
    setPlayer(Player.Black);
    setWinner(null);
  };

  return { check, player, winner, onClickHandler, onClickReset };
};

export default useGame;
