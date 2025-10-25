import React from "react";

export default function SelectPlayer() {
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <article className="w-1/2 flex flex-col justify-center items-center">
        <div>
          <span>플레이어</span>
        </div>
        <div className="flex justify-evenly w-full">
          <div className="flex flex-col">
            <span>흑돌</span>
            <button>선택</button>
          </div>
          <div className="flex flex-col">
            <span>백돌</span>
            <button>선택</button>
          </div>
        </div>
      </article>
      <button>게임시작</button>
    </main>
  );
}
