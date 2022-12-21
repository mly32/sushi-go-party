import Link from 'next/link';

export const Index = () => {
  console.log('port', process.env.PORT);
  console.log('server', process.env.NX_SUSHI_GO_SERVER_URL);
  console.log('debug', process.env.NX_SUSHI_GO_DEBUG);
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
