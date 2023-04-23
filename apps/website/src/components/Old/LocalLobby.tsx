import SushiGo, { C, V } from '@sushi-go-party/sushi-go-game';
import { ChangeEventHandler, useState } from 'react';

import GameView from './GameView';

const initialSelection = Object.fromEntries(
  C.groups.map((k) => [
    k,
    [...Array(V.validGroupCounts[k]).keys()].map(
      (i) => [...C.groupToTiles[k]][i]
    ),
  ])
) as Record<C.Group, C.Tile[]>;

const Lobby = () => {
  const [setupData, setSetupData] = useState<C.SetupData>({
    selectionName: 'My First Meal',
    numPlayers: SushiGo.minPlayers,
    customSelection: [],
    passBothWays: false,
  });

  const [customSelection, setCustomSelection] =
    useState<Record<C.Group, C.Tile[]>>(initialSelection);

  const [started, setStarted] = useState(false);

  const setNumPlayers: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSetupData({ ...setupData, numPlayers: Number(e.target.value) });
  };

  const setSelection: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSetupData({
      ...setupData,
      selectionName: e.target.value as C.Selection,
    });
  };

  const genSetGroup = (group: C.Group, index: number) => {
    const setGroup: ChangeEventHandler<HTMLSelectElement> = (e) => {
      const copied = structuredClone(customSelection);
      copied[group][index] = e.target.value as C.Tile;
      setCustomSelection(copied);
    };
    return setGroup;
  };

  const startGame = () => {
    const selection = Object.entries(customSelection)
      .map(([_, tiles]) => tiles)
      .flat();
    const realSetupData = { ...setupData, customSelection: selection };

    if (!V.validSetup(realSetupData)) {
      alert('invalid setup');
    } else {
      setSetupData(realSetupData);
      setStarted(true);
    }
  };

  if (started) {
    return <GameView setupData={setupData} />;
  }

  return (
    <div>
      <div>Game options</div>
      <div>
        <label>
          Number of players:
          <input
            type="number"
            placeholder="number of players"
            value={setupData.numPlayers}
            max={SushiGo.maxPlayers}
            min={SushiGo.minPlayers}
            onChange={setNumPlayers}
          />
        </label>
      </div>
      <div>
        selection:
        <select value={setupData.selectionName} onChange={setSelection}>
          {C.selections.map((s, index) => (
            <option key={index} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {setupData.selectionName === 'Custom' && (
        <div>
          {C.groups
            .filter((group) => V.validGroupCounts[group] > 0)
            .map((group) => (
              <div key={group}>
                <div>
                  <div>
                    {group}: {V.validGroupCounts[group]}
                  </div>
                  {customSelection[group].map((tile, index) => (
                    <select
                      key={index}
                      value={tile}
                      onChange={genSetGroup(group, index)}
                    >
                      {[...C.groupToTiles[group]].map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <button onClick={startGame}>start game</button>
    </div>
  );
};

export default Lobby;
