import { createStyles } from '@mantine/core';

export const playerIDColor = [
  'red',
  'blue',
  'green',
  'yellow',
  'grape',
  'orange',
  'lime',
  'violet',
];

export const useStyles = createStyles((theme) => {
  const darken =
    theme.colorScheme === 'dark'
      ? `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), `
      : '';
  return {
    hand: {
      backgroundImage: `${darken}url(/assets/rolling_background.png)`,
      backgroundSize: 'auto 42px',
      backgroundPosition: 'left bottom 0px',
      backgroundRepeat: 'repeat-x',
    },
    tray: {
      backgroundImage: `${darken}url(/assets/mat_background.png)`,
      backgroundSize: 'auto 125px',
      backgroundPosition: 'left bottom 0px',
      backgroundRepeat: 'repeat-x',
    },
    fridge: {
      backgroundImage: `${darken}url(/assets/fridge/fridge_closed.png)`,
      backgroundSize: '100% 100%',
      width: 110,
      height: 165,
    },
    notification: {
      boxShadow: 'none',
      borderWidth: '1px 0px 1px 0px',
      borderRadius: 0,
      background: 'none',
    },
    // cardLike: {
    //   backgroundColor:
    //     theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    // },
    dessertIcon: {
      verticalAlign: 'baseline',
      filter: `drop-shadow(0px 0px 1px black)`,
    },
  };
});
