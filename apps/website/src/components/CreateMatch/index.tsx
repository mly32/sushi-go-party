import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Input,
  NumberInput,
  Radio,
  Title,
  createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import SushiGo, { C, U, V } from '@sushi-go-party/sushi-go-game';
import { useEffect, useState } from 'react';

import Tile from '../Image/Tile';
import { HoverableMultiSelect } from '../UI/Hoverable';
import SelectionNameSelect from './SelectionNameSelect';

const useStyles = createStyles((theme) => {
  return {
    tileGroup: {
      marginTop: 0,
      marginBottom: `calc(${theme.spacing.xs}px / 2)`,
    },
    tileWrapper: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    tileGroupLabel: {
      fontSize: theme.fn.size({ size: 'md', sizes: theme.fontSizes }),
      fontWeight: 'bold',
    },
    selectLabel: {
      fontSize: theme.fn.size({ size: 'sm', sizes: theme.fontSizes }) - 2,
    },
    tile: {
      borderRadius: theme.fn.radius('sm'),
      width: 180,
    },
  };
});

const fromSelectionList = (selectionList: C.Tile[]) => {
  return Object.fromEntries(
    C.groups.map((k) => [
      k,
      selectionList.filter((tile) => C.tileToGroup[tile] === k),
    ])
  ) as Record<C.Group, C.Tile[]>;
};

const fromSelectionName = (selectionName: C.Selection) => {
  const selectionList = C.selectionToSelectionInfo[selectionName].selection;
  return fromSelectionList([...selectionList]);
};

const toSelectionList = (selection: Record<C.Group, C.Tile[]>) => {
  return Object.entries(selection)
    .map(([_, v]) => v)
    .flat();
};

const removeInvalid = (selection: Record<C.Group, C.Tile[]>, numPlayers) => {
  return Object.fromEntries(
    Object.entries(selection).map(([k, v]) => [
      k,
      v.filter((tile) => V.validTile(tile, numPlayers)),
    ])
  ) as Record<C.Group, C.Tile[]>;
};

export enum GameType {
  Public = 'Public',
  Private = 'Private',
}

export interface CreateMatchData {
  setupData: C.SetupData;
  gameType: GameType;
}

export interface CreateMatchProps {
  title?: boolean;
  matchData?: CreateMatchData | null;
  handleSubmit: (matchData: CreateMatchData) => void;
}

const CreateMatch = ({
  title = true,
  matchData = null,
  handleSubmit: callback,
}: CreateMatchProps) => {
  const { classes } = useStyles();

  const form = useForm({
    initialValues: matchData
      ? {
          numPlayers: matchData.setupData.numPlayers,
          selectionName: matchData.setupData.selectionName,
          selection: fromSelectionList(matchData.setupData.customSelection),
          gameType: matchData.gameType,
          passBothWays: matchData.setupData.passBothWays,
        }
      : {
          numPlayers: SushiGo.minPlayers,
          selectionName: 'Custom' as C.Selection,
          selection: fromSelectionName('My First Meal'),
          gameType: GameType.Public,
          passBothWays: false,
        },
    validate: (values) => {
      const { numPlayers, selectionName, selection, passBothWays, gameType } =
        values;
      const setupData: C.SetupData = {
        numPlayers,
        selectionName,
        customSelection: toSelectionList(selection),
        passBothWays,
      };
      return {
        numPlayers:
          numPlayers >= SushiGo.minPlayers && numPlayers <= SushiGo.maxPlayers
            ? null
            : 'Invalid number of players',
        selectionName:
          C.selections.findIndex((v) => v === selectionName) !== -1 &&
          (selectionName === 'Custom' || V.validSetup(setupData))
            ? null
            : `Invalid selection for ${setupData.numPlayers} players`,
        selection:
          selectionName !== 'Custom' || V.validSetup(setupData)
            ? null
            : 'Invalid custom selection',
        gameType:
          Object.values(GameType).indexOf(gameType) >= 0
            ? null
            : 'Invalid game type',
      };
    },
  });
  const { values, setFieldValue, setValues } = form;
  const [validateAll, setValidateAll] = useState(false);

  useEffect(() => {
    setValidateAll(true);
  }, [values]);

  if (validateAll) {
    form.validate();
    setValidateAll(false);
  }

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      selection: removeInvalid(prev.selection, prev.numPlayers),
    }));
  }, [values.numPlayers, setValues]);

  useEffect(() => {
    if (values.selectionName !== 'Custom') {
      setFieldValue('selection', fromSelectionName(values.selectionName));
    }
  }, [values.selectionName, setFieldValue]);

  const handleSubmit: Parameters<typeof form.onSubmit>[0] = (values) => {
    const { numPlayers, selectionName, selection, passBothWays, gameType } =
      values;
    const setupData: C.SetupData = {
      numPlayers,
      selectionName,
      customSelection: toSelectionList(selection),
      passBothWays,
    };
    callback({ setupData, gameType });
  };

  const tiles = (
    <Input.Wrapper
      label="Tiles"
      description="The individual tiles that form the menu selection"
      error={form.errors.selection}
      classNames={{ label: classes.tileGroupLabel }}
    >
      <Grid className={classes.tileGroup} grow>
        {C.groups
          .filter((group) => V.validGroupCounts[group] > 0)
          .map((group) => {
            const selectReadOnly = form.values.selectionName !== 'Custom';
            const selectLabel = `${U.groupLabel(group)}${
              selectReadOnly || group === 'Nigiri'
                ? ''
                : ` (pick ${V.validGroupCounts[group]})`
            }`;

            const numPlayers = form.values.numPlayers;

            const groupTiles = [...C.groupToTiles[group]].map((tile) => {
              const disabled = !V.validTile(tile, numPlayers);
              return {
                value: tile,
                label: U.tileLabel(tile),
                hover: (
                  <Tile
                    tile={tile}
                    numPlayers={numPlayers}
                    className={classes.tile}
                  />
                ),
                disabled,
              };
            });

            return (
              <Grid.Col
                key={group}
                span={V.validGroupCounts[group] >= 2 ? 12 : 6}
                xs={V.validGroupCounts[group] >= 3 ? 12 : 6}
                md={V.validGroupCounts[group] >= 3 ? 6 : 3}
                className={classes.tileWrapper}
              >
                <HoverableMultiSelect
                  label={selectLabel}
                  classNames={{ label: classes.selectLabel }}
                  clearable
                  maxSelectedValues={V.validGroupCounts[group]}
                  readOnly={selectReadOnly || group === 'Nigiri'}
                  overData={groupTiles}
                  {...form.getInputProps(`selection.${group}`)}
                />
              </Grid.Col>
            );
          })}
      </Grid>
    </Input.Wrapper>
  );

  const readOnly = matchData !== null;

  const numberLabel =
    'Number of players ' + `(${SushiGo.minPlayers}-${SushiGo.maxPlayers})`;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {title && (
        <>
          <Title>Create a new game</Title>
          <Divider />
        </>
      )}

      <Grid gutter="xs" gutterXs="md" grow>
        <Grid.Col span={6} md={3}>
          <Radio.Group
            label="Game type"
            {...form.getInputProps('gameType')}
            {...(readOnly ? { onChange: () => {} } : {})}
          >
            {Object.values(GameType).map((gameType) => (
              <Radio key={gameType} value={gameType} label={gameType} />
            ))}
          </Radio.Group>
        </Grid.Col>
        <Grid.Col span={6} md={3}>
          <Input.Wrapper label="Variant">
            <Checkbox
              pt="xs"
              label="Pass both ways"
              {...form.getInputProps('passBothWays', { type: 'checkbox' })}
              {...(readOnly ? { onChange: () => {} } : {})}
            />
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col xs={6} md={3}>
          <NumberInput
            label={numberLabel}
            min={SushiGo.minPlayers}
            max={SushiGo.maxPlayers}
            {...form.getInputProps('numPlayers')}
            readOnly={readOnly}
          />
        </Grid.Col>
        <Grid.Col xs={6} md={3}>
          <SelectionNameSelect
            label="Menu selection"
            numPlayers={form.values.numPlayers}
            {...form.getInputProps('selectionName')}
            readOnly={readOnly}
          />
        </Grid.Col>
      </Grid>
      <Divider />

      {readOnly || tiles}

      <Group position="center" spacing={2} mt="md">
        {toSelectionList(form.values.selection).map((tile) => (
          <Tile
            key={tile}
            tooltip
            showModal
            tile={tile}
            numPlayers={form.values.numPlayers}
            width={110}
          />
        ))}
      </Group>

      {readOnly || (
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      )}
    </form>
  );
};

export default CreateMatch;
