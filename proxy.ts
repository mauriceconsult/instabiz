import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-in/(.*)",
  "/sign-up",
  "/sign-up/(.*)",
  "/api/:shopId/:entity(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const isGet = request.method === "GET";
  const isPublicApi = request.url.includes("/api/") && isGet;

  if (isPublicRoute(request) || isPublicApi) {
    return;
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
