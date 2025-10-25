import { DIRS, SIZE } from "@/const";
import { Cell, Player } from "@/types";
import { inBounds } from "@/utill";
import { supabase } from "@/utill/supabase/client";
import { RealtimePresenceState } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type PresenceMeta = {
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

  console.log("members", members);
  console.log("me", me);

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

      const players = list.filter((m) => m.role === "player");
      const hasBlack = players.some((m) => m.stone === Player.Black);
      const hasWhite = players.some((m) => m.stone === Player.White);

      const i = list.findIndex((m) => m.id === myIdRef.current);
      if (i >= 0 && list[i].role === "player" && list[i].stone === undefined) {
        if (!hasBlack) list[i].stone = Player.Black;
        else if (!hasWhite) list[i].stone = Player.White;
        else {
          list[i].role = "spectator";
        }
      }

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

  useEffect(() => {
    channel
      .on("broadcast", { event: "user_check" }, (payload: { payload: any }) => {
        console.log("New message:", payload.payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  return { check, player, selectPlayer, winner, onClickHandler, onClickReset };
};

export default useGameBoard;
