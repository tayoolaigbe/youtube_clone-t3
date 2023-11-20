import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";
import Layout from "~/Components/Layout";
import ProfileHeader from "~/Components/ProfileHeader";
import { api } from "~/utils/api";

const ProfilePlaylists: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();
  const { data, isLoading, error } = api.playlist.getPlaylistByUserId.useQuery(
    userId as string,
  );
  const errorTypes = !data || data?.length === 0 || error;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (userId == sessionData?.user.id && errorTypes) {
      return (
        <ErrorMessage
          message="No Playlists Created"
          description="You have not yet created a playlist inside your library."
        />
      );
    } else if (errorTypes) {
      return (
        <ErrorMessage
          message="No libraries created"
          description="Profile has not yet created a playlist."
        />
      );
    } else {
      return (
        <>
          <Layout>
            <>
              <ProfileHeader />
              {errorTypes ? <Error /> : <>Playlist</>}
            </>
          </Layout>
        </>
      );
    }
  };

  return <div>This is ProfilePlaylists</div>;
};

export default ProfilePlaylists;
