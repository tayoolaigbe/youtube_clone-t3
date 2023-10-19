import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Button from "~/Components/Buttons/Button";
import {
  Navbar,
  Sidebar,
  Layout,
  MultiColumnVideo,
} from "~/Components/Component";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.video.getRandomVideos.useQuery(40);

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (error ?? !data) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Videos"
          description="Sorry there are no videos with that title."
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>VidChill</title>
        <meta
          name="description"
          content="Enjoy the videos and music you love, upload original content, and share it with friends, family, and the world on VidChill."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout closeSidebar={true}>
        {!data ? (
          <Error />
        ) : (
          <>
            <MultiColumnVideo
              videos={data?.videos.map((video) => ({
                id: video?.id ?? "",
                title: video?.title ?? "",
                thumbnailUrl: video?.thumbnailUrl ?? "",
                createdAt: video?.createdAt ?? new Date(),
                views: video?.views ?? 0,
              }))}
              users={data?.users.map((user) => ({
                name: user?.name ?? "",
                image: user?.image ?? "",
              }))}
            />
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
