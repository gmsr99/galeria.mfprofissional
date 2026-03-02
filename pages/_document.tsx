import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Galeria online e portfólio de imagens. MF Profissional."
          />
          <meta property="og:site_name" content="MF Profissional" />
          <meta
            property="og:description"
            content="Galeria online e portfólio de imagens. MF Profissional."
          />
          <meta property="og:title" content="MF Profissional" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="MF Profissional" />
          <meta
            name="twitter:description"
            content="Galeria online e portfólio de imagens. MF Profissional."
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
