import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const playlistRouter = createTRPCRouter({
  getPlaylistByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const rawPlaylists = await ctx.prisma.playlist.findMany({
        where: {
          userId: input,
        },
        include: {
          user: true,
          videos: {
            include: {
              video: true,
            },
          },
        },
      });
      const playlists = await Promise.all(
        rawPlaylists.map(async (playlist) => {
          const videoCount = await ctx.prisma.playlistHasVideo.count({
            where: {
              playlistId: playlist.id,
            },
          });

          const firstVideoInPlaylist =
            await ctx.prisma.playlistHasVideo.findFirst({
              where: {
                playlistId: playlist.id,
              },
              include: {
                video: {
                  select: {
                    thumbnailUrl: true,
                  },
                },
              },
            });

          return {
            ...playlist,
            videoCount,
            playlistThumbnail: firstVideoInPlaylist?.video?.thumbnailUrl,
          };
        }),
      );
      return playlists;
    }),
  getSavePlaylistData: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const Playlist = await ctx.prisma.playlist.findMany({
        where: {
          userId: input,
          NOT: [{ title: "Liked Videos" }, { title: "History" }],
        },
        include: {
          videos: {
            include: {
              video: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      return Playlist;
    }),
  addPlaylist: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string(),
        description: z.string().min(5).max(50).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const playlist = await ctx.prisma.playlist.create({
        data: {
          title: input.title,
          userId: input.userId,
          description: input.description,
        },
      });
      return playlist;
    }),
});
