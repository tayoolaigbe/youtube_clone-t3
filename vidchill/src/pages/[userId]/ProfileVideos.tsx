import { NextPage } from "next";
import Layout from "~/Components/Layout";
import ProfileHeader from "~/Components/ProfileHeader";

const ProfileVideos: NextPage = () => {
  return (
    <>
      <Layout>
        <>
          <ProfileHeader />
          <p>This is Profile Following</p>
        </>
      </Layout>
    </>
  );
};

export default ProfileVideos;
