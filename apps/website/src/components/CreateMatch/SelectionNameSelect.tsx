import { Select, SelectItemProps, SelectProps, Text } from '@mantine/core';
import { C, V } from '@sushi-go-party/sushi-go-game';
import { forwardRef } from 'react';

const selectionData = C.selections.map((s) => ({
  value: s,
  label: s,
  desc: C.selectionToSelectionInfo[s].description,
}));

type SelectionData = typeof selectionData[number];

type SelectionNameItemProps = SelectItemProps & SelectionData;

const SelectionNameItem = forwardRef<HTMLDivElement, SelectionNameItemProps>(
  ({ value, label, desc, ...others }, ref) => {
    return (
      <div ref={ref} {...others}>
        <Text>{label}</Text>
        <Text size="xs" italic>
          {desc}
        </Text>
      </div>
    );
  }
);

SelectionNameItem.displayName = 'SelectionNameItem';

export interface SelectionNameSelectProps extends SelectProps {
  numPlayers: number;
}

const SelectionNameSelect = ({
  numPlayers,
  ...props
}: SelectionNameSelectProps) => {
  const checkDisabled = (s: SelectionData) => ({
    ...s,
    disabled: !(
      s.value === 'Custom' ||
      V.validSetup({
        numPlayers,
        selectionName: s.value,
        customSelection: [],
        passBothWays: false,
      })
    ),
  });

  return (
    <Select
      itemComponent={SelectionNameItem}
      searchable
      filter={(value, item) =>
        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.desc.toLowerCase().includes(value.toLowerCase().trim())
      }
      data={selectionData.map(checkDisabled)}
      {...props}
    />
  );
};

export default SelectionNameSelect;
