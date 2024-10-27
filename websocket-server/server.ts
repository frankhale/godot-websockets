interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface player {
  id: string;
  position: Vector3;
}

const port: number = 9876;
const players: player[] = [];

const ac = new AbortController();
Deno.serve(
  {
    port,
    signal: ac.signal,
  },
  (_req: Request) => {
    const { socket, response } = Deno.upgradeWebSocket(_req);
    socket.onopen = () => {
      const p: player = {
        id: crypto.randomUUID(),
        position: { x: 0, y: 0, z: 0 },
      };
      players.push(p);
      console.log(`client connected: ${p.id}`);
      socket.send(JSON.stringify(p));
    };
    socket.onmessage = (e) => {
      console.log(e.data);

      if (!e.data.id && !e.data.position) return;

      const p = players.find((p) => p.id === e.data.id);
      if (!p) return;

      p.position = e.data.position;
      const otherPlayers = players.filter((p) => p.id !== e.data.id);
      socket.send(JSON.stringify(otherPlayers));
    };
    return response;
  },
);
