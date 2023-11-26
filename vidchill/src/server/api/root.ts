import { videoRouter } from "~/server/api/routers/video";
import { videoEngagementRouter } from "./routers/videoEngagements";
import { userRouter } from "./routers/user";
import { playlistRouter } from "./routers/playlist";
import { commentRouter } from "./routers/comment";
import { announcementRouter } from "./routers/announcement";

import { createTRPCRouter } from "~/server/api/trpc";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  video: videoRouter,
  user: userRouter,
  playlist: playlistRouter,
  announcement: announcementRouter,
  comment: commentRouter,
  videoEngagement: videoEngagementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
