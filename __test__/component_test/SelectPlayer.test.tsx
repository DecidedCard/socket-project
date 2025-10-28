// __tests__/SelectPlayer.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SelectPlayer from "@/components/SelectPlayer";
import { Player } from "@/types";
import { GameBoardReturn } from "@/hooks/useGame";

// 전역 alert mock
vi.stubGlobal("alert", vi.fn());

describe("SelectPlayer", () => {
  let mockGame: Partial<GameBoardReturn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // 기본 mock 상태
    mockGame = {
      // 아직 돌 미선택인 유저 1명, 흑돌/백돌 배정된 유저 각각 1명씩
      members: [
        { id: "a1", nickname: "guestA", role: "player" }, // stone 없음 → '플레이어' 목록에 노출
        {
          id: "b2",
          nickname: "blackUser",
          role: "player",
          stone: Player.Black,
        },
        {
          id: "c3",
          nickname: "whiteUser",
          role: "player",
          stone: Player.White,
        },
      ],
      onClickUpdateStoneHandler: vi.fn(),
      onClickGameStartHandler: vi.fn(),
    } as Partial<GameBoardReturn>;
  });

  it("유저가 들어왔을 때 stone이 없는 멤버의 닉네임이 '플레이어' 목록에 표시된다", () => {
    render(<SelectPlayer game={mockGame as GameBoardReturn} />);

    // stone이 없는 멤버만 '플레이어' 섹션에 노출
    expect(screen.getByText("플레이어")).toBeInTheDocument();
    expect(screen.getByText("guestA")).toBeInTheDocument();

    // 흑/백 섹션에 각 사용자 노출
    expect(screen.getByText("흑돌")).toBeInTheDocument();
    expect(screen.getByText("blackUser")).toBeInTheDocument();

    expect(screen.getByText("백돌")).toBeInTheDocument();
    expect(screen.getByText("whiteUser")).toBeInTheDocument();
  });

  it("흑돌 '선택' 버튼 클릭 시 onClickUpdateStoneHandler(Player.Black) 호출", () => {
    render(<SelectPlayer game={mockGame as GameBoardReturn} />);

    const blackSelect = screen.getAllByText("선택")[0]; // 첫 번째 '선택'은 흑돌 영역
    fireEvent.click(blackSelect);

    expect(mockGame.onClickUpdateStoneHandler).toHaveBeenCalledTimes(1);
    expect(mockGame.onClickUpdateStoneHandler).toHaveBeenCalledWith(
      Player.Black
    );
  });

  it("백돌 '선택' 버튼 클릭 시 onClickUpdateStoneHandler(Player.White) 호출", () => {
    render(<SelectPlayer game={mockGame as GameBoardReturn} />);

    const whiteSelect = screen.getAllByText("선택")[1]; // 두 번째 '선택'은 백돌 영역
    fireEvent.click(whiteSelect);

    expect(mockGame.onClickUpdateStoneHandler).toHaveBeenCalledTimes(1);
    expect(mockGame.onClickUpdateStoneHandler).toHaveBeenCalledWith(
      Player.White
    );
  });

  it("게임시작 버튼 클릭 시 onClickGameStartHandler가 호출된다", () => {
    render(<SelectPlayer game={mockGame as GameBoardReturn} />);

    fireEvent.click(screen.getByText("게임시작"));

    expect(mockGame.onClickGameStartHandler).toHaveBeenCalledTimes(1);
  });

  it("게임시작 조건이 충족되지 않았을 때 alert가 뜨는지(핸들러에서 alert 호출을 모킹)", () => {
    const failStart = vi.fn(() =>
      alert("2명의 플레이어가 있거나 흑돌과 백돌을 선택해야합니다.")
    );

    render(
      <SelectPlayer
        game={
          {
            ...mockGame,
            onClickGameStartHandler: failStart,
          } as GameBoardReturn
        }
      />
    );

    fireEvent.click(screen.getByText("게임시작"));

    expect(failStart).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith(
      "2명의 플레이어가 있거나 흑돌과 백돌을 선택해야합니다."
    );
  });
});
