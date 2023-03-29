import { C, U } from '@sushi-go-party/sushi-go-game';

import Card, { ListAction } from './Card';
import styles from './styles.module.css';

export interface CardListProps {
  hideTrayTitle?: boolean;
  G: C.GameState;
  loc: C.Location;
  x?: C.PlayerID;
  actions?: ListAction[];
  condensed?: boolean;
  last?: { add: boolean; card: C.Card };
}

const CardList = ({
  hideTrayTitle = false,
  G,
  loc,
  x = '',
  actions = [],
  condensed = false,
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
      <div key={index} style={{ border: '1px solid black' }}>
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

        {condensed ? (
          <span>{U.cardLabel(card)}</span>
        ) : (
          <Card key={index} card={card} index={index} actions={[]} />
        )}
      </div>
    );
  };

  const List = ({ list }: { list: C.IndexCard[] }) => {
    if (list.length === 0) {
      return (
        <div className={styles['hidden']}>
          <div className={condensed ? '' : styles['row-container']}>
            {cardInfo({ card: 'Flipped', index: 0 })}
          </div>
        </div>
      );
    }
    return (
      <div className={condensed ? '' : styles['row-container']}>
        {list.map(cardInfo)}
      </div>
    );
  };

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

    const fridgeCards = U.stateLoc(G, 'fridge', x).map((card, index) => ({
      index,
      card,
    }));

    return (
      <div>
        {hideTrayTitle || <div>Player {`${x}'s`} played cards</div>}
        <div className={condensed ? '' : styles['row-container']}>
          <div>
            <div>{U.locationLabel(loc)}</div>
            <List list={cards} />
          </div>
          <div>
            <div>New:</div>
            <List list={newCards} />
          </div>
          <div>
            <div>Fridge:</div>
            <List list={fridgeCards} />
          </div>
        </div>
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
