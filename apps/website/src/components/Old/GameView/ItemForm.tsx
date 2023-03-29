import { C, U } from '@sushi-go-party/sushi-go-game';
import { ChangeEventHandler } from 'react';

export interface ItemFormProps {
  G: C.GameState;
  item: C.SpoonInfo;
  setItem: (item: C.SpoonInfo) => void;
}

const ItemForm = ({ G, item, setItem }: ItemFormProps) => {
  // TODO useForm (rename)
  const itemType: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === 'tile') {
      setItem({ kind: 'tile', tile: 'Flipped' });
    } else {
      setItem({ kind: 'card', card: 'Flipped' });
    }
  };

  const selectTile: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setItem({ kind: 'tile', tile: e.target.value as C.Tile });
  };

  const selectCard: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setItem({ kind: 'card', card: e.target.value as C.Card });
  };

  const cardSelection = G.selection
    .map((tile) => Array.from(C.tileToCards[tile]))
    .flat();

  return (
    <form>
      <div>
        <p>item type</p>
        <div>
          {['tile', 'card'].map((state) => (
            <label key={state}>
              <input
                type="radio"
                checked={item.kind === state}
                value={state}
                onChange={itemType}
              />
              {state}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p>item selection</p>
        {item.kind === 'tile' ? (
          <select value={item.tile} onChange={selectTile}>
            {['Flipped' as C.Tile, ...G.selection].map((tile) => (
              <option key={tile} value={tile} disabled={tile === 'Flipped'}>
                {U.tileLabel(tile)}
              </option>
            ))}
          </select>
        ) : (
          <select value={item.card} onChange={selectCard}>
            {['Flipped' as C.Card, ...cardSelection].map((card) => (
              <option key={card} value={card} disabled={card === 'Flipped'}>
                {U.cardLabel(card)}
              </option>
            ))}
          </select>
        )}
      </div>
    </form>
  );
};

export default ItemForm;
