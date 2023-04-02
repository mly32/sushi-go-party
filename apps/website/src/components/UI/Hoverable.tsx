import {
  Box,
  HoverCard,
  MultiSelect,
  MultiSelectProps,
  Select,
  SelectItem,
  SelectProps,
  Text,
  createStyles,
} from '@mantine/core';
import { forwardRef } from 'react';

const useStyles = createStyles((theme) => {
  return {
    disabledText: {
      color: theme.colors.dark[2],
    },
    disabled: {
      WebkitFilter: 'grayscale(100%)',
      filter: 'grayscale(100%)',
    },
    hoverDropdown: {
      padding: `calc(${theme.spacing.xs}px / 2)`,
    },
  };
});

interface HoverableProps {
  label: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Hoverable = ({ label, children, disabled = false }: HoverableProps) => {
  const { classes, cx } = useStyles();

  return (
    <HoverCard shadow="md" withinPortal openDelay={150} closeDelay={150}>
      <HoverCard.Target>
        <Text className={cx(disabled && classes.disabledText)}>{label}</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown className={classes.hoverDropdown}>
        <Box className={cx(disabled && classes.disabled)}>{children}</Box>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

type OverData = SelectItem & {
  hover: React.ReactNode;
};

const toData = (overData: OverData[]) =>
  overData.map(({ label, hover, disabled, ...item }) => ({
    label: (
      <Hoverable label={label} disabled={disabled}>
        {hover}
      </Hoverable>
    ),
    truelabel: label,
    disabled,
    ...item,
  }));

export interface HoverableSelectProps extends Omit<SelectProps, 'data'> {
  overData: OverData[];
}

const SelectItem = forwardRef<HTMLDivElement, OverData>(
  ({ label, description, hover, ...others }: OverData, ref) => (
    <div ref={ref} {...others}>
      <Hoverable label={label} disabled={others.disabled}>
        {hover}
      </Hoverable>
    </div>
  )
);
SelectItem.displayName = 'SelectItem';

export const HoverableSelect = ({
  overData,
  ...props
}: HoverableSelectProps) => {
  const { classes, cx } = useStyles();
  const info = overData.find(({ value }) => value === props.value);
  return (
    <HoverCard shadow="md" withinPortal openDelay={150} closeDelay={150}>
      <HoverCard.Target>
        <Select
          searchable
          data={overData}
          itemComponent={SelectItem}
          filter={(value, item) =>
            item.label.toLowerCase().includes(value?.toLowerCase().trim())
          }
          {...props}
        />
      </HoverCard.Target>

      {info?.hover !== undefined && (
        <HoverCard.Dropdown className={classes.hoverDropdown}>
          <Box className={cx(info.disabled && classes.disabled)}>
            {info.hover}
          </Box>
        </HoverCard.Dropdown>
      )}
    </HoverCard>
  );
};

export interface HoverableMultiSelectProps
  extends Omit<MultiSelectProps, 'data'> {
  overData: OverData[];
}

export const HoverableMultiSelect = ({
  overData,
  ...props
}: HoverableMultiSelectProps) => {
  return (
    <MultiSelect
      searchable
      data={toData(overData)}
      filter={(value, selected, item) =>
        !selected &&
        item.truelabel?.toLowerCase().includes(value?.toLowerCase().trim())
      }
      /* type cast */
      {...({} as { data: [] })}
      {...props}
    />
  );
};
