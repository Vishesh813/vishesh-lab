import type { MetadataRoute } from "next";
import { canonical, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/progress/"],
      },
    ],
    sitemap: canonical("/sitemap.xml"),
    host: `${siteConfig.url}${siteConfig.basePath}`,
  };
}
