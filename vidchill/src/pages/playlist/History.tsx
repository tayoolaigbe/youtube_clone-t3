import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { LoadingMessage, ErrorMessage } from "~/Components/ErrorMessage";
import Layout from "~/Components/Layout";
import { PlaylistPage } from "~/Components/PlaylistComponent";
import { api } from "~/utils/api";

const History: NextPage = () => {
  const { data: sessionData } = useSession();
  const QueryTitle = "History" as string;
  const { data, isLoading, error } = api.playlist.getPlaylistsByTitle.useQuery({
    title: QueryTitle,
    userId: sessionData?.user.id as string,
  });

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (error ?? !data) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No current History"
          description="Watch some Videos to add history."
        />
      );
    } else {
      return <></>;
    }
  };

  const playlist = data?.playlist;

  return (
    <>
      <Layout>
        {!playlist ? (
          <Error />
        ) : (
          <PlaylistPage
            playlist={{
              id: data.playlist?.id || "",
              title: data.playlist?.title || "",
              description: data.playlist?.description ?? "",
              videoCount: data.videos.length || 0,
              playlistThumbnail: data.videos[0]?.thumbnailUrl ?? "",
              createdAt: data.playlist?.createdAt || new Date(),
            }}
            videos={data.videos.map((video) => ({
              id: video?.id ?? "",
              title: video?.title ?? "",
              thumbnailUrl: video?.thumbnailUrl ?? "",
              createdAt: video?.createdAt ?? new Date(),
              views: video?.views || 0,
            }))}
            authors={data.authors.map((author) => ({
              id: author?.id ?? "",
              name: author?.name ?? "",
              image: author?.image ?? "",
            }))}
            user={{
              id: data.user?.id ?? "",
              name: data.user?.name ?? "",
              image: data.user?.image ?? "",
              followers: data.user?.followers ?? 0,
            }}
          />
        )}
      </Layout>
    </>
  );
};

export default History;
