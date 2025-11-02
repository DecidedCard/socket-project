import { DIRS, SIZE } from '@/const'
import { Cell, Player } from '@/types'
import { SetStateAction } from 'react'

export const inBounds = (r: number, c: number) =>
  r >= 0 && r < SIZE && c >= 0 && c < SIZE

export const checkWin = (b: Cell[][], r: number, c: number, p: Player) => {
  for (const [dr, dc] of DIRS) {
    let cnt = 1

    let nr = r + dr,
      nc = c + dc
    while (inBounds(nr, nc) && b[nr][nc] === p) {
      cnt++
      nr += dr
      nc += dc
    }
    nr = r - dr
    nc = c - dc
    while (inBounds(nr, nc) && b[nr][nc] === p) {
      cnt++
      nr -= dr
      nc -= dc
    }

    if (cnt >= 5) return true
  }
  return false
}

export const resetGame = (value: {
  setCheck: (value: SetStateAction<Cell[][]>) => void
  setPlayer: (value: SetStateAction<Player>) => void
  setWinner: (value: SetStateAction<Player | null>) => void
}) => {
  value.setCheck(Array.from({ length: SIZE }, () => Array(SIZE).fill(null)))
  value.setPlayer(Player.Black)
  value.setWinner(null)
}
