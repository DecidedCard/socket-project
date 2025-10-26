import { SIZE } from "@/const";
import { Cell, Player } from "@/types";
import { checkWin } from "@/utill";
import { supabase } from "@/utill/supabase/client";
import { RealtimePresenceState } from "@supabase/supabase-js";
import { ParamValue } from "next/dist/server/request/params";
import { useEffect, useMemo, useRef, useState } from "react";

export type PresenceMeta = {
  id: string;
  nickname: string;
  role: "player" | "spectator";
  stone?: Player;
};

type PresenceRow = PresenceMeta & { presence_ref: string };

const useGameBoard = (id?: ParamValue) => {
  const [check, setCheck] = useState<Cell[][]>(
    Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
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
    [id, myIdRef]
  );

  useEffect(() => {
    if (!myIdRef.current) {
      const saved = localStorage.getItem("tab_id");
      if (saved) {
        myIdRef.current = saved;
      } else {
        const v = crypto.randomUUID();
        localStorage.setItem("tab_id", v);
        myIdRef.current = v;
      }
    }
  }, []);

  useEffect(() => {
    const meta: PresenceMeta = {
      id: myIdRef.current,
      nickname: myIdRef.current.slice(0, 6),
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
    };

    const handleLeave = (payload: any) => {
      // 퇴장자 정보 payload.leftPresences
    };

    if (id) {
      channel
        .on("presence", { event: "sync" }, handleSync)
        .on("presence", { event: "join" }, handleJoin)
        .on("presence", { event: "leave" }, handleLeave)
        .on(
          "broadcast",
          { event: "select_player" },
          (payload: { payload: any }) => {
            setSelectPlayer(payload.payload.value);
          }
        )
        .on("broadcast", { event: "point" }, (payload: { payload: any }) => {
          const { next, nextPlayer, winner } = payload.payload;
          setCheck(next);
          if (winner) {
            setWinner(winner);
          }

          setPlayer(nextPlayer);
        })
        .on("broadcast", { event: "reset" }, (payload: { payload: any }) => {
          setCheck(Array.from({ length: SIZE }, () => Array(SIZE).fill(null)));
          setPlayer(Player.Black);
          setWinner(null);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track(meta);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [channel]);

  const onClickUpdateStoneHandler = async (stone: Player) => {
    if (!me) return;

    if (members.some((i) => i.stone === stone)) {
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

  const onClickHandler = (r: number, c: number, player: Player) => {
    const nextPlayer = player === Player.Black ? Player.White : Player.Black;

    setCheck((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = player;
      let winCheck = "";

      if (checkWin(next, r, c, player)) {
        setWinner(player);
        winCheck = player;
      }

      if (id) {
        channel.send({
          type: "broadcast",
          event: "point",
          payload: { next, nextPlayer, winner: winCheck },
        });
      }

      return next;
    });

    setPlayer(nextPlayer);
  };

  const onClickReset = () => {
    if (id) {
      channel.send({ type: "broadcast", event: "reset", payload: true });
    }
    setCheck(Array.from({ length: SIZE }, () => Array(SIZE).fill(null)));
    setPlayer(Player.Black);
    setWinner(null);
  };

  return {
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
  };
};

export default useGameBoard;
