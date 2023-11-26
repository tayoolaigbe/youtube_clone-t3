import { EngagementType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const announcementRouter = createTRPCRouter({
  getAnnouncementsByUserId: publicProcedure
    .input(
      z.object({
        id: z.string(),
        viewerId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const announcementsWithUser = await ctx.prisma.announcement.findMany({
        where: {
          userId: input.id,
        },
        include: {
          user: true,
        },
      });
      const announcements = announcementsWithUser.map(
        ({ user, ...announcement }) => announcement,
      );
      const user = announcementsWithUser.map(({ user }) => user);

      const announcementsWithEngagements = await Promise.all(
        announcements.map(async (announcement) => {
          const likes = await ctx.prisma.announcementEngagement.count({
            where: {
              announcementId: announcement.id,
              engagementType: EngagementType.LIKE,
            },
          });
          const dislikes = await ctx.prisma.announcementEngagement.count({
            where: {
              announcementId: announcement.id,
              engagementType: EngagementType.DISLIKE,
            },
          });

          let viewerHasLiked = false;
          let viewerHasDisliked = false;

          if (input.viewerId && input.viewerId !== "") {
            viewerHasLiked =
              !!(await ctx.prisma.announcementEngagement.findFirst({
                where: {
                  announcementId: announcement.id,
                  userId: input.viewerId,
                  engagementType: EngagementType.LIKE,
                },
              }));
            viewerHasDisliked =
              !!(await ctx.prisma.announcementEngagement.findFirst({
                where: {
                  announcementId: announcement.id,
                  userId: input.viewerId,
                  engagementType: EngagementType.DISLIKE,
                },
              }));
          }

          const viewer = {
            hasLiked: viewerHasLiked,
            hasDisliked: viewerHasDisliked,
          };

          return {
            ...announcement,
            likes,
            dislikes,
          };
        }),
      );
      return { announcements: announcementsWithEngagements, user };
    }),
});
