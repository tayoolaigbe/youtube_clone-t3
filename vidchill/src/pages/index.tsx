import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Button from "~/Components/Buttons/Button";
import { Navbar, Sidebar, Layout } from "~/Components/Component";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Vidchill</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout closeSidebar={true}>
        <p>This is from the homepage</p>
      </Layout>
      {/* <Navbar />
      <Sidebar /> */}
    </>
  );
}
