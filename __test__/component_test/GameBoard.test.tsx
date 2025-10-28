import GameBoard from "@/components/GameBoard";
import { Player } from "@/types";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as NextNav from "next/navigation";
import { SIZE } from "@/const";
import { GameBoardReturn } from "@/hooks/useGame";

// ✅ Next.js router mock
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// ✅ 전역 alert mock
vi.stubGlobal("alert", vi.fn());

describe("GameBoard component", () => {
  let mockGame: Partial<GameBoardReturn>;

  beforeEach(() => {
    mockGame = {
      check: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
      player: Player.Black,
      winner: null,
      me: { id: "", nickname: "", role: "player", stone: Player.Black },
      onClickHandler: vi.fn(),
      onClickReset: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it("돌을 클릭하면 onClickHandler가 호출되고 보드가 업데이트된다", () => {
    render(<GameBoard game={mockGame as GameBoardReturn} />);

    const firstButton = screen.getAllByRole("button")[1]; // 첫 번째 돌 버튼
    fireEvent.click(firstButton);

    expect(mockGame.onClickHandler).toHaveBeenCalledTimes(1);
    expect(mockGame.onClickHandler).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      Player.Black
    );
  });

  it("승리자가 생기면 승리 모달이 나타난다", () => {
    mockGame.winner = Player.Black;
    render(<GameBoard game={mockGame as GameBoardReturn} />);

    expect(screen.getByText(/흑돌이 승리했습니다/i)).toBeInTheDocument();
  });

  it("초기화 버튼 클릭 시 onClickReset이 실행된다", () => {
    mockGame.winner = Player.White;
    render(<GameBoard game={mockGame as GameBoardReturn} />);

    const resetButton = screen.getByText("초기화");
    fireEvent.click(resetButton);

    expect(mockGame.onClickReset).toHaveBeenCalledTimes(1);
  });

  it("뒤로가기 버튼 클릭 시 router.replace('/')가 실행된다", () => {
    const replace = vi.fn();
    const back = vi.fn();
    vi.spyOn(NextNav, "useRouter").mockReturnValue({ replace, back } as any);

    render(<GameBoard game={mockGame as GameBoardReturn} />);
    const backButton = screen.getByText("뒤로가기");
    fireEvent.click(backButton);

    expect(replace).toHaveBeenCalledWith("/");
  });

  it("winner 모달에서 '처음으로' 버튼 클릭 시 router.back()이 호출된다", () => {
    const replace = vi.fn();
    const back = vi.fn();
    vi.spyOn(NextNav, "useRouter").mockReturnValue({ replace, back } as any);

    mockGame.winner = Player.Black;
    render(<GameBoard game={mockGame as GameBoardReturn} />);

    const firstButton = screen.getByText("처음으로");
    fireEvent.click(firstButton);

    expect(back).toHaveBeenCalled();
  });
});
