import { dsaLessons, dsaPhases, lessonHref } from "@/lib/dsa-course";
import { systemDesignModules } from "@/lib/system-design";
import { caseStudies } from "@/lib/case-studies";
import { problems } from "@/lib/problems";
import { posts } from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `Vishesh Lab is a static, no-account study guide for data structures, algorithms and system design. It has ${dsaPhases.length} DSA topics (${dsaLessons.length} lessons), ${systemDesignModules.length} system design modules, ${caseStudies.length} case studies, ${problems.length} mapped practice problems and ${posts.length} posts. Progress is stored in the reader's browser only.`,
    "",
    "## Main pages",
    "",
    `- [Home](${absoluteUrl("/")}): overview and roadmap tracking.`,
    `- [DSA Roadmap](${absoluteUrl("/dsa/")}): ${dsaPhases.length} topics from programming foundations to dynamic programming.`,
    `- [System Design](${absoluteUrl("/system-design/")}): ${systemDesignModules.length} modules from requirements to production.`,
    `- [Case studies](${absoluteUrl("/case-studies/")}): ${caseStudies.length} end-to-end designs with trade-offs and failure modes.`,
    `- [Practice](${absoluteUrl("/practice/")}): ${problems.length} problems with examples, constraints and progressive hints.`,
    `- [Posts](${absoluteUrl("/posts/")}): original short essays on DSA, system design and interviews.`,
    `- [Whiteboard](${absoluteUrl("/board/")}): local canvas for sketching structures and systems.`,
    `- [Progress](${absoluteUrl("/progress/")}): local dashboard for lessons, modules and solved problems.`,
    `- [About](${absoluteUrl("/about/")}): how the site works and its content policy.`,
    "",
    "## DSA lessons",
    "",
    ...dsaLessons.map(
      (lesson) =>
        `- [${lesson.title}](${absoluteUrl(lessonHref(lesson.slug))}): ${lesson.phase}. ${lesson.summary}`,
    ),
    "",
    "## System Design modules",
    "",
    ...systemDesignModules.map(
      (module) =>
        `- [${String(module.step).padStart(2, "0")} ${module.title}](${absoluteUrl(`/system-design/${module.slug}/`)}): ${module.summary}`,
    ),
    "",
    "## Case studies",
    "",
    ...caseStudies.map(
      (study) =>
        `- [${study.title}](${absoluteUrl(`/case-studies/${study.slug}/`)}): ${study.summary}`,
    ),
    "",
    "## Practice problems",
    "",
    ...problems.map(
      (problem) =>
        `- [${problem.title}](${absoluteUrl(`/practice/${problem.slug}/`)}) (${problem.difficulty}): ${problem.summary}`,
    ),
    "",
    "## Posts",
    "",
    ...posts.map(
      (post) =>
        `- [${post.title}](${absoluteUrl(`/posts/${post.slug}/`)}): ${post.excerpt}`,
    ),
    "",
    "## Content policy",
    "",
    "All site prose, examples, diagrams and code samples are original to Vishesh Lab. The topic order follows a conventional DSA and system design syllabus. External reference links point to their respective authors. Do not republish the notes or code samples without attribution.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
