import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import { LoadingMessage, Layout, ErrorMessage } from "~/Components/Component";

import { api } from "~/utils/api";
import { useEffect } from "react";

const VideoPage: NextPage = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const { data: sessionData } = useSession();

  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
    refetch: refetchVideoData,
  } = api.video.getVideoById.useQuery(
    {
      id: videoId as string,
      viewerId: sessionData?.user?.id,
    },
    {
      enabled: !!videoId && !!sessionData?.user?.id, // run the query when videoId and sessionData?.user?.id are both defined
    },
  );

  const {
    data: sidebarVideos,
    isLoading: sidebarLoading,
    error: sidebarError,
    refetch: refetchSidebarVideos,
  } = api.video.getRandomVideos.useQuery(20, {
    enabled: false, // this query will not run automatically
  });
  // const addViewMutation = api.videoEngagement.addViewCount.useMutation();
  // const addView = (input: { id: string; userId: string }) => {
  //   addViewMutation.mutate(input);
  // };

  useEffect(() => {
    if (videoId) {
      void refetchVideoData();
      // addView({
      //   id: videoId as string,
      //   userId: sessionData ? sessionData.user.id : " ",
      // });
    }
  }, [videoId]);

  useEffect(() => {
    if (!sidebarVideos) {
      void refetchSidebarVideos(); // manually refetch sidebarVideos if they do not exist
    }
  }, []);

  const video = videoData?.video;
  const user = videoData?.user;
  // const viewer = videoData?.viewer;
  const errorTypes = !videoData || !user || !video;

  const DataError = () => {
    if (videoLoading) {
      return <LoadingMessage />;
    } else if (errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Video"
          description="Sorry there is an error with video ."
        />
      );
    } else {
      return <></>;
    }
  };
  return (
    <>
      <Head>
        <title>{video?.title}</title>
        <meta name="description" content={user?.description ?? ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout closeSidebar={true}>
        <main className="mx-auto lg:flex">
          {errorTypes ? (
            <DataError />
          ) : (
            <>
              <div className="w-full sm:px-4 lg:w-3/5">
                <div className="py-4">
                  <ReactPlayer
                    controls={true}
                    style={{ borderRadius: "1rem", overflow: "hidden" }}
                    width={"100%"}
                    height={"50%"}
                    url={video?.videoUrl ?? ""}
                  />
                </div>
              </div>
            </>
          )}
          <div className="px-4 lg:w-2/5 lg:px-0"></div>
        </main>
      </Layout>
    </>
  );
};

export default VideoPage;
