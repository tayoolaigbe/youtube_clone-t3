interface PlaylistPageProps {
  playlist: {
    id: string;
    title: string;
    description: string;
    videoCount: number;
    playlistThumbnail: string;
    createdAt: Date;
  };
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    createdAt: Date;
    views: number;
  }[];
  authors: {
    id: string;
    name: string;
    image: string;
  }[];
  user: {
    id: string;
    image: string;
    name: string;
    followers: number;
  };
}
// export const PlaylistPage: React.FC<PlaylistPageProps> = ( playlist,
//   videos,
//   authors,
//   user,) => {
//     if (!playlist || !videos || !authors || !user) {
//       return <></>;
//     }
//   }
