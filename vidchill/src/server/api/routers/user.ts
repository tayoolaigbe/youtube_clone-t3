import { EngagementType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  addFollow: publicProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingFollow = await ctx.prisma.followEngagement.findMany({
        where: {
          followingId: input.followingId,
          followerId: input.followerId,
          engagementType: EngagementType.FOLLOW,
        },
      });
      if (existingFollow.length > 0) {
        const deleteFollow = await ctx.prisma.followEngagement.deleteMany({
          where: {
            followingId: input.followingId,
            followerId: input.followerId,
            engagementType: EngagementType.FOLLOW,
          },
        });
        return deleteFollow;
      } else {
        const follow = await ctx.prisma.followEngagement.create({
          data: {
            followingId: input.followingId,
            followerId: input.followerId,
            engagementType: EngagementType.FOLLOW,
          },
        });
        return follow;
      }
    }),
  getUserFollowings: publicProcedure
    .input(
      z.object({
        id: z.string(),
        viewerId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          followings: {
            include: {
              following: {
                include: {
                  followings: true,
                },
              },
            },
          },
        },
      });

      // Ensure the user exists
      if (!user) {
        return null;
      }

      // Get a list of all followings
      const followings = user.followings;

      // Prepare new following list
      const followingsWithViewerFollowedStatus = await Promise.all(
        followings.map(async (following) => {
          let viewerHasFollowed = false;
          if (input.viewerId && input.viewerId !== "") {
            viewerHasFollowed = !!(await ctx.prisma.followEngagement.findFirst({
              where: {
                followingId: following.following.id,
                followerId: input.viewerId,
              },
            }));
          }
          return { ...following, viewerHasFollowed };
        }),
      );

      return { ...user, followings: followingsWithViewerFollowedStatus };
    }),
  getChannelById: publicProcedure
    .input(z.object({ id: z.string(), viewerId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!user) {
        throw new Error("User Not Found!");
      }

      const followers = await ctx.prisma.followEngagement.count({
        where: {
          followingId: user.id,
        },
      });

      const followings = await ctx.prisma.followEngagement.count({
        where: {
          followerId: user.id,
        },
      });

      let viewerHasFollowed = false;

      const userWithEngagement = { ...user, followers, followings };
      if (input.viewerId && input.viewerId !== "") {
        viewerHasFollowed = !!(await ctx.prisma.followEngagement.findFirst({
          where: {
            followingId: user.id,
            followerId: input.viewerId,
          },
        }));
        const viewer = {
          hasFollowed: viewerHasFollowed,
        };
        return { user: userWithEngagement, viewer };
      }
    }),
  getDashboardData: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input,
        },
        include: {
          videos: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const videosWithCounts = await Promise.all(
        user.videos.map(async (video) => {
          const likes = await ctx.prisma.videoEngagement.count({
            where: {
              videoId: video.id,
              engagementType: EngagementType.LIKE,
            },
          });
          const dislikes = await ctx.prisma.videoEngagement.count({
            where: {
              videoId: video.id,
              engagementType: EngagementType.DISLIKE,
            },
          });
          const views = await ctx.prisma.videoEngagement.count({
            where: {
              videoId: video.id,
              engagementType: EngagementType.VIEW,
            },
          });
          return {
            ...video,
            likes,
            dislikes,
            views,
          };
        }),
      );

      const totalLikes = videosWithCounts.reduce(
        (total, video) => total + video.likes,
        0,
      );
      const totalViews = videosWithCounts.reduce(
        (total, video) => total + video.views,
        0,
      );

      const totalFollowers = await ctx.prisma.followEngagement.count({
        where: {
          followingId: user.id,
        },
      });

      return {
        user,
        totalFollowers,
        videos: videosWithCounts,
        totalLikes,
        totalViews,
      };
    }),
});
