import { SIZE } from "@/const";
import { Cell, Player } from "@/types";
import { checkWin, inBounds, resetGame } from "@/util";
import { describe, expect, it, vi } from "vitest";

it("정해진 (상수 SIZE)크기안에 값이 있는지 검증한다", () => {
  expect(inBounds(13, 12)).toBe(true);
  expect(inBounds(17, 9)).toBe(false);
  expect(inBounds(11, 17)).toBe(false);
  expect(inBounds(17, 20)).toBe(false);
  expect(inBounds(5, 9)).toBe(true);
});

describe("checkWin test", () => {
  it("가로로 5개가 이어진 경우", () => {
    const b: Cell[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(null)
    );

    for (let i = 3; i < 8; i++) {
      b[10][i] = Player.Black;
    }

    expect(checkWin(b, 10, 5, Player.Black)).toBe(true);
  });

  it("세로로 5개가 이어진 경우", () => {
    const b: Cell[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(null)
    );

    for (let i = 2; i < 7; i++) {
      b[i][8] = Player.White;
    }

    expect(checkWin(b, 4, 8, Player.White)).toBe(true);
  });

  it("대각선 (↘ 방향)으로 5개", () => {
    const b: Cell[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(null)
    );

    for (let i = 0; i < 5; i++) {
      b[5 + i][5 + i] = Player.Black;
    }

    expect(checkWin(b, 7, 7, Player.Black)).toBe(true);
  });

  it("대각선 (↙ 방향)으로 5개", () => {
    const b: Cell[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(null)
    );

    for (let i = 0; i < 5; i++) {
      b[10 - i][4 + i] = Player.White;
    }

    expect(checkWin(b, 8, 6, Player.White)).toBe(true);
  });

  it("4개만 이어져서 승리 아님", () => {
    const b: Cell[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(null)
    );

    for (let i = 0; i < 4; i++) {
      b[5][i] = Player.Black;
    }

    expect(checkWin(b, 5, 2, Player.Black)).toBe(false);
  });
});

describe("resetGame", () => {
  it("보드, 플레이어, 승자를 초기화한다", () => {
    const setCheck = vi.fn();
    const setPlayer = vi.fn();
    const setWinner = vi.fn();

    resetGame({ setCheck, setPlayer, setWinner });

    expect(setPlayer).toHaveBeenCalledWith(Player.Black);
    expect(setWinner).toHaveBeenCalledWith(null);

    expect(setCheck).toHaveBeenCalledTimes(1);
    const board = setCheck.mock.calls[0][0] as Cell[][];

    expect(board).toHaveLength(SIZE);
    for (const row of board) {
      expect(row).toHaveLength(SIZE);
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });

  it("매 호출마다 새로운 2차원 배열 인스턴스를 만든다(불변성)", () => {
    const setCheck = vi.fn();
    const setPlayer = vi.fn();
    const setWinner = vi.fn();

    resetGame({ setCheck, setPlayer, setWinner });
    const board1 = setCheck.mock.calls[0][0] as Cell[][];

    setCheck.mockClear();
    resetGame({ setCheck, setPlayer, setWinner });
    const board2 = setCheck.mock.calls[0][0] as Cell[][];

    expect(board1).not.toBe(board2);
    expect(board1[0]).not.toBe(board2[0]);
  });
});
