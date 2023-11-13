import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";
import { api } from "~/utils/api";

const ProfileHeader = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();

  if (userId === sessionData?.user.id) {
    console.log("This is your profile");
  }

  const { data, isLoading, error } = api.user.getChannelById.useQuery({
    id: userId as string,
    viewerId: sessionData?.user?.id as string,
  });

  const channel = data?.user;
  const viewer = data?.viewer;
  const errorTypes = !channel || !viewer || error || !data;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPeople"
          message="Error loading Channel"
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
        <title>{channel?.name ? channel.name + " VidChill Channel" : ""}</title>
        <meta name="description" content={channel?.description || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {errorTypes ? (
        <Error />
      ) : (
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="!-mt-6 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <p>Hello Folks</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
