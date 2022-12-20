import Link from 'next/link';

export const Index = () => {
  return (
    <div>
      <h1>Sushi Go Party</h1>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/solo">play locally</Link>
        </li>
        <li>
          <Link href="/multi">play online</Link>
        </li>
      </ul>
    </div>
  );
};

export default Index;
