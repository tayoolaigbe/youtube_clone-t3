import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ProfilePlaylists: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();
  return <div>This is ProfilePlaylists</div>;
};

export default ProfilePlaylists;
