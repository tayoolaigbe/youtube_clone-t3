import { EngagementType, type PrismaClient } from "@prisma/client";
import { z } from "zod";
type Context = {
  prisma: PrismaClient;
};
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

async function getOrCreatePlaylist(
  ctx: Context,
  title: string,
  userId: string,
) {
  let playlist = await ctx.prisma.playlist.findFirst({
    where: {
      title,
      userId,
    },
  });
  if (playlist === null || playlist === undefined) {
    playlist = await ctx.prisma.playlist.create({
      data: { title, userId },
    });
  }
  return playlist;
}

async function createEngagement(
  ctx: Context,
  id: string,
  userId: string,
  type: EngagementType,
) {
  return await ctx.prisma.videoEngagement.create({
    data: { videoId: id, userId, engagementType: type },
  });
}

export const videoEngagementRouter = createTRPCRouter({
  addViewCount: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId && input.userId !== "") {
        const playlist = await getOrCreatePlaylist(
          ctx,
          "History",
          input.userId,
        );
        await ctx.prisma.playlistHasVideo.create({
          data: { playlistId: playlist.id, videoId: input.id },
        });
      }
      const view = await createEngagement(
        ctx,
        input.id,
        input.userId,
        EngagementType.VIEW,
      );
      return view;
    }),
});
