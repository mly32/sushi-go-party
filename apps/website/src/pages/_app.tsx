import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { getCookie, setCookie } from 'cookies-next';
import NextApp, { AppContext, AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Layout, Show } from '../components/Layout';
import Loading from '../components/UI/Loading';
import { CONFIG } from '../config';
import { SITE_THEME, TITLE } from '../constants';
import { persistor, store } from '../store';

const showNonePaths: Set<string> = new Set(['/404', '/500']);
const showFreePaths: Set<string> = new Set(['/', '/game/[matchID]']);

interface AppProps extends NextAppProps {
  colorScheme: ColorScheme;
}

const App = (props: AppProps) => {
  const { Component, pageProps, router } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie(`${CONFIG.storagePrefix}-color-scheme`, nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const show = showNonePaths.has(router.pathname)
    ? Show.None
    : showFreePaths.has(router.pathname)
    ? Show.Free
    : Show.Contained;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest"></link>
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ ...SITE_THEME, colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ReduxProvider store={store}>
            <PersistGate loading={<Loading />} persistor={persistor}>
              <Layout show={show}>
                <Component {...pageProps} />
              </Layout>
            </PersistGate>
          </ReduxProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme:
      getCookie(`${CONFIG.storagePrefix}-color-scheme`, appContext.ctx) ||
      'light',
  };
};

export default App;
