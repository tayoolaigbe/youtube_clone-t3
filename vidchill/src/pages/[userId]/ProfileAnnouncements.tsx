import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const ProfileAnnouncements: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();
  const { data, isLoading, error, refetch } =
    api.announcement.getAnnouncementsByUserId.useQuery({
      id: userId as string,
      viewerId: sessionData?.user.id,
    });

  return <p>Announcement</p>;
};

export default ProfileAnnouncements;
