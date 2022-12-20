import { C, U } from '@sushi-go-party/sushi-go-game';

import Card, { ListAction } from './Card';

export interface CardListProps {
  G: C.GameState;
  loc: C.Location;
  x?: C.PlayerID;
  actions?: ListAction[];
  condensed?: boolean;
  last?: { add: boolean; card: C.Card };
}

const CardList = ({
  G,
  loc,
  x = '',
  actions = [],
  condensed = true,
  last = { add: false, card: 'Flipped' },
}: CardListProps) => {
  const indexedList: C.IndexCard[] = U.stateLoc(G, loc, x).map(
    (card, index) => ({ index, card })
  );

  const cardInfo = ({ card, index }: C.IndexCard) => {
    const flipInfo =
      loc === 'tray'
        ? G.players[x].flipped.find(({ index: i }) => i === index)
        : undefined;
    const isCopied =
      !U.isDirect(loc) &&
      G.players[x].copied.some(
        ({ index: i, loc: l }) => i === index && l === loc
      );

    const metaInfo = (
      <span>
        {flipInfo && <span>(was {U.cardLabel(flipInfo.card)})</span>}
        {isCopied && <span>(copied)</span>}
      </span>
    );

    return (
      <li key={index} style={{ border: '1px solid black' }}>
        {condensed ? (
          <span>{U.cardLabel(card)}</span>
        ) : (
          <Card key={index} card={card} index={index} actions={[]} />
        )}

        {metaInfo}
        {actions
          .filter(({ enabled }) => enabled(index))
          .map(({ label, action, selected }) => (
            <button
              key={label}
              onClick={() => action(index)}
              style={{ color: selected(index) ? 'blue' : 'black' }}
            >
              {label}
            </button>
          ))}
      </li>
    );
  };

  const List = ({ list }: { list: C.IndexCard[] }) => (
    <ul>{list.map(cardInfo)}</ul>
  );

  if (!U.isDirect(loc)) {
    indexedList.sort(
      (a, b) => U.cardBackground(G, x, a) - U.cardBackground(G, x, b)
    );
  }

  if (loc === 'tray') {
    const cards = indexedList.filter(
      ({ index }) => index < G.players[x].newCard
    );
    const newCards = indexedList.filter(
      ({ index }) => index >= G.players[x].newCard
    );
    if (last.add) {
      newCards.push({ index: G.players[x].tray.length, card: last.card });
    }

    return (
      <div>
        <div>{U.locationLabel(loc)}</div>
        <List list={cards} />
        <hr style={{ borderTop: '1px solid black' }} />
        <List list={newCards} />
      </div>
    );
  }

  return (
    <div>
      <div>{U.locationLabel(loc)}</div>
      <List list={indexedList} />
    </div>
  );
};
export default CardList;
