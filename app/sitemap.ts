import type { MetadataRoute } from "next";
import { dsaLessons, lessonHref } from "@/lib/dsa-course";
import { systemDesignModules } from "@/lib/system-design";
import { caseStudies } from "@/lib/case-studies";
import { posts } from "@/lib/posts";
import { problems } from "@/lib/problems";
import { canonical } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: canonical("/"), lastModified: built, changeFrequency: "weekly", priority: 1 },
    { url: canonical("/dsa/"), lastModified: built, changeFrequency: "weekly", priority: 0.9 },
    { url: canonical("/system-design/"), lastModified: built, changeFrequency: "weekly", priority: 0.9 },
    { url: canonical("/case-studies/"), lastModified: built, changeFrequency: "weekly", priority: 0.8 },
    { url: canonical("/practice/"), lastModified: built, changeFrequency: "weekly", priority: 0.8 },
    { url: canonical("/posts/"), lastModified: built, changeFrequency: "monthly", priority: 0.7 },
    { url: canonical("/about/"), lastModified: built, changeFrequency: "monthly", priority: 0.4 },
  ];

  const course: MetadataRoute.Sitemap = dsaLessons.map((lesson) => ({
    url: canonical(lessonHref(lesson.slug)),
    lastModified: built,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const systems: MetadataRoute.Sitemap = systemDesignModules.map((module) => ({
    url: canonical(`/system-design/${module.slug}/`),
    lastModified: built,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cases: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: canonical(`/case-studies/${study.slug}/`),
    lastModified: built,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const practice: MetadataRoute.Sitemap = problems.map((problem) => ({
    url: canonical(`/practice/${problem.slug}/`),
    lastModified: built,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const notes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: canonical(`/posts/${post.slug}/`),
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...course, ...systems, ...cases, ...practice, ...notes];
}
