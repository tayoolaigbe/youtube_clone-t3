import { NextPage } from "next";
import { useRouter } from "next/router";
import { LoadingMessage, ErrorMessage } from "~/Components/ErrorMessage";
import { api } from "~/utils/api";

const Playlist: NextPage = () => {
  const router = useRouter();
  const { playlistId } = router.query;
  const { data, isLoading, error } = api.playlist.getPlaylistById.useQuery(
    playlistId as string,
  );

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (error ?? !data) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Playlists are available"
          description="Go create some playlists."
        />
      );
    } else {
      return <></>;
    }
  };

  return <div>Playlist</div>;
};

export default Playlist;
