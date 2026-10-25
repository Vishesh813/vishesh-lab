import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Brand } from "./brand";

const columns = [
  {
    title: "DSA",
    links: [
      { label: "Roadmap", href: "/dsa/" },
      { label: "Practice", href: "/practice/" },
      { label: "Progress", href: "/progress/" },
    ],
  },
  {
    title: "System Design",
    links: [
      { label: "Curriculum", href: "/system-design/" },
      { label: "Case studies", href: "/case-studies/" },
      { label: "Board", href: "/board/" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Posts", href: "/posts/" },
      { label: "About", href: "/about/" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p className="footer-copy">
              DSA and System Design, kept separate. Short lessons, mapped
              practice and progress that stays in your browser.
            </p>
          </div>

          {columns.map((column) => (
            <div className="footer-col" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <Link href="#main">Back to top</Link>
        </div>
      </div>
    </footer>
  );
}
