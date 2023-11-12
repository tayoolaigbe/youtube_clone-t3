import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const playlistRouter = createTRPCRouter({
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
});
