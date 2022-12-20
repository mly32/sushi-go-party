import { useEffect, useState, useCallback } from 'react';

const backend = 'http://localhost:4201';

interface Game {
  id: string;
}

export interface GameProps {
  q: string;
  game: Game;
}

export function Game(props: GameProps) {
  const [search, setSearch] = useState(props.q);
  const [game, setGame] = useState<Game | null>(props.game);

  useEffect(() => {
    fetch(`${backend}/game/${encodeURIComponent(search)}`)
      .then((resp) => resp.json())
      .then((data) => setGame(data))
      .catch((err) => console.log(err));
  }, [search]);

  const onSetSearch = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(evt.target.value);
    },
    []
  );

  return (
    <div>
      <h1>Welcome to Game!</h1>
      <input value={search} onChange={onSetSearch} />
      <p>id: {game === null ? 'loading' : game.id}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  let game = null;
  if (context.query.q) {
    const res = await fetch(
      `${backend}/game/${encodeURIComponent(context.query.q)}`
    );
    game = await res.json();
  }

  return {
    props: {
      q: context.query.q ?? '',
      game,
    },
  };
}

export default Game;
