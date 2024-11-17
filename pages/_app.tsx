// pages/_app.tsx
import Head from 'next/head';
import { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link 
          rel="icon" 
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/5pyzLwAAAAASUVORK5CYII=" 
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
