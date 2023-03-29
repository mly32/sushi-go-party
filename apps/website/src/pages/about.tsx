import { Anchor, Divider, Text, Title } from '@mantine/core';
import Link from 'next/link';

const About = () => {
  return (
    <>
      <Title>About</Title>

      <Text>
        Play{' '}
        <Text fw="bold" span>
          Sushi Go Party!
        </Text>{' '}
        online with friends.
      </Text>

      <Divider />

      <Text fs="italic">
        Pass sushi around a bigger table and take the best dishes. Save room for
        dessert!
      </Text>

      <Text>
        Read the game{' '}
        <Link
          href="/assets/Rules.pdf"
          target="_blank"
          rel="noopener noreferrer"
          passHref
        >
          <Anchor tt="uppercase">rules</Anchor>
        </Link>
        .
      </Text>
    </>
  );
};
export default About;
