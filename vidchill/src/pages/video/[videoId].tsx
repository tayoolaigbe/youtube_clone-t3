import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

import { useRouter } from "next/router";
import Layout from "~/Components/Layout";

import { api } from "~/utils/api";

const VideoPage: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { videoId } = router.query;

  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
  } = api.video.getVideoById.useQuery(
    {
      id: videoId as string,
      viewerId: sessionData?.user?.id,
    },
    { enabled: !!videoId && !!sessionData?.user?.id },
  );
  const video = videoData?.video;
  const user = videoData?.user;
  const errorTypes = videoError ?? !video ?? !user;
  return (
    <>
      <Head>
        <title>{video?.title}</title>
        <meta name="description" content={user?.description ?? ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout closeSidebar={true}>
        <p>Video Page</p>
      </Layout>
    </>
  );
};

export default VideoPage;
