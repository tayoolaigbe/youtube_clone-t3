import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";
import { api } from "~/utils/api";
import { UserImage } from "./Component";
import Image from "next/image";
import { Button, FollowButton } from "./Buttons/Buttons";
import { Edit } from "./Icons/Icons";

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
        <>
          <Image
            alt="error"
            className="h-32 w-full object-cover lg:h-64"
            width={1080}
            height={128}
            src={channel.backgroundImage ?? "/background.jpg"}
          />
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="!-mt-6 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <UserImage
                  className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                  image={channel.image ?? ""}
                />
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className=" mt-6 min-w-0 flex-1 md:block">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {channel.name}
                  </h1>
                  <p className="text-regular text-gray-600">{channel.handle}</p>
                  <div className="mt-1 flex items-center text-xs">
                    <p className="text-sm text-gray-600">
                      {channel.followers} Followers
                    </p>
                    <li className="pl-2 text-sm text-gray-500"></li>
                    <p className="text-sm text-gray-600">
                      {channel.followings} Following
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-stretch space-y-3 sm:space-x-4 sm:space-y-0">
                  {userId == sessionData?.user.id ? (
                    <Button
                      variant="primary"
                      className="ml-2 flex"
                      size="2xl"
                      href="/Settings"
                    >
                      <Edit className="mr-2 h-5 w-5 shrink-0 stroke-white" />
                      Edit
                    </Button>
                  ) : (
                    <FollowButton
                      followingId={userId as string}
                      viewer={{
                        hasFollowed: viewer.hasFollowed,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileHeader;
