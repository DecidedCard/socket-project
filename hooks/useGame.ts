import { DIRS, SIZE } from "@/const";
import { Cell, Player } from "@/types";
import { inBounds } from "@/utill";
import { supabase } from "@/utill/supabase/client";
import { RealtimePresenceState } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type PresenceMeta = {
  id: string;
  nickname: string;
  role: "player" | "spectator";
  stone?: Player;
};

type PresenceRow = PresenceMeta & { presence_ref: string };

const useGameBoard = () => {
  const { id } = useParams();
  const [check, setCheck] = useState<Cell[][]>(
    Array.from({ length: SIZE + 1 }, () => Array(SIZE + 1).fill(null))
  );
  const [player, setPlayer] = useState<Player>(Player.Black);
  const [winner, setWinner] = useState<Player | null>(null);
  const [members, setMembers] = useState<PresenceMeta[]>([]);
  const [me, setMe] = useState<PresenceMeta | null>(null);
  const [selectPlayer, setSelectPlayer] = useState(false);

  const myIdRef = useRef<string>("");

  const channel = useMemo(
    () =>
      supabase.channel(`room:${id}`, {
        config: { presence: { key: myIdRef.current } },
      }),
    [id]
  );

  useEffect(() => {
    () => {
      const saved = localStorage.getItem("tab_id");
      if (saved) {
        myIdRef.current = saved;
        return;
      }
      const v = crypto.randomUUID();
      localStorage.setItem("tab_id", v);
      myIdRef.current = v;
    };
  }, []);

  // --- Presence 구독/트래킹 ---
  useEffect(() => {
    const meta: PresenceMeta = {
      id: myIdRef.current,
      nickname: "닉네임1",
      role: "player",
      stone: undefined,
    };

    const handleSync = () => {
      const state =
        channel.presenceState() as RealtimePresenceState<PresenceRow>;
      const list = Object.values(state)
        .flat()
        .map(({ presence_ref, ...meta }) => meta);

      setMembers(list);
      const mine = list.find((m) => m.id === myIdRef.current) ?? null;
      setMe(mine);
    };

    const handleJoin = (payload: any) => {
      // 새 입장자 정보 payload.newPresences
      // 필요 시 토스트/알림 등
      // console.log("join:", payload);
    };

    const handleLeave = (payload: any) => {
      // 퇴장자 정보 payload.leftPresences
      // console.log("leave:", payload);
    };

    channel
      .on("presence", { event: "sync" }, handleSync)
      .on("presence", { event: "join" }, handleJoin)
      .on("presence", { event: "leave" }, handleLeave)
      .on("broadcast", { event: "user_check" }, (payload: { payload: any }) => {
        console.log("user_check:", payload.payload);
      })
      .on(
        "broadcast",
        { event: "select_player" },
        (payload: { payload: any }) => {
          console.log("select_player:", payload.payload.value);
          setSelectPlayer(payload.payload.value);
        }
      )
      .on(
        "broadcast",
        { event: "message_sent" },
        (payload: { payload: any }) => {
          console.log("message_sent:", payload.payload);
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track(meta);
          channel.send({
            type: "broadcast",
            event: "user_check",
            payload: { user: meta.nickname, at: new Date().toISOString() },
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channel]);

  const onClickUpdateStoneHandler = async (stone: Player) => {
    if (!me) return;

    if (members.some((i) => i.stone === stone)) {
      console.log("이미 선택한 사람이 있습니다.");
      return;
    }

    await channel.track({
      ...me,
      stone,
    });
  };

  const onClickGameStartHandler = () => {
    const check =
      members.length === 2 &&
      members.some((i) => i.stone === Player.Black) &&
      members.some((i) => i.stone === Player.White);

    if (check) {
      setSelectPlayer(true);
      channel.send({
        type: "broadcast",
        event: "select_player",
        payload: { value: true },
      });
      return;
    }

    console.error("2명의 플레이어가 있거나 흑돌과 백돌을 선택해야합니다.");
  };

  const onClickhandler = () => {
    channel.send({
      type: "broadcast",
      event: "message_sent",
      payload: {
        text: "Hello, world!",
        user: "john_doe",
        timestamp: new Date().toISOString(),
      },
    });
  };

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

  return {
    check,
    player,
    members,
    selectPlayer,
    winner,
    onClickUpdateStoneHandler,
    onClickGameStartHandler,
    onClickHandler,
    onClickReset,
  };
};

export default useGameBoard;
