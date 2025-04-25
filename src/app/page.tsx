import Layout from "@/components/Layout";
import Head from "next/head";
import "../app/globals.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>NextJS MySQL CRUD tutorial</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="description" content="NextJS MySQL CRUD tutorial" />
        <meta name="author" content="anand346@BePractical" />
        <meta
          property="og:url"
          content="https://www.linkedin.com/in/anand346"
        />
      </Head>
      <main>
        <Layout />
      </main>
    </>
  );
}
