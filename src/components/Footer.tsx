"use client";

import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import BrandLogo from "@/components/ui/BrandLogo";

const CircleIcon = () => (
  <svg
    className="e-font-icon-svg e-fas-circle"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
  </svg>
);

export default function Footer() {
  const t = useTranslations();

  const categories = useMemo(() => [
    { name: t("footer.hotels"), href: "#" },
    { name: t("footer.flights"), href: "#" },
    { name: t("footer.destinations"), href: "#" },
    { name: t("footer.traveling"), href: "#" },
    { name: t("footer.travelIntelligence"), href: "#" },
  ], [t]);

  const staticRecentPosts = useMemo(() => [
    {
      title: t("ticker.news1"),
      href: "#",
      author: "Matt Rosnor",
      views: `98 ${t("common.views")}`,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
    },
    {
      title: t("ticker.news2"),
      href: "#",
      author: "Matt Rosnor",
      views: `83 ${t("common.views")}`,
      image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=200&h=200&fit=crop",
    },
    {
      title: t("ticker.news3"),
      href: "#",
      author: "Matt Rosnor",
      views: `79 ${t("common.views")}`,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&h=200&fit=crop",
    },
  ], [t]);

  const { data: recentArticles, isSuccess } = useQuery({
    queryKey: ["footer-recent-posts"],
    queryFn: async () => {
      const res = await fetch("/api/articles?limit=3&status=published");
      if (!res.ok) throw new Error("Failed to load recent posts");
      const json = (await res.json()) as { items?: Array<{
        title: string; slug: string; image?: string;
        authorName?: string; views?: number;
      }> };
      return json.items || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const recentPosts = isSuccess && recentArticles?.length
    ? recentArticles.map((post) => ({
        title: post.title,
        href: `/posts/${post.slug}`,
        author: post.authorName || "RSTheme",
        views: `${post.views ?? 0} ${t("common.views")}`,
        image: post.image
          ? `${post.image}${post.image.includes("?") ? "&" : "?"}w=200&h=200&fit=crop`
          : staticRecentPosts[0].image,
      }))
    : staticRecentPosts;

  const tags = useMemo(() => [
    t("footer.hotels"),
    t("footer.flights"),
    t("footer.destinations"),
    t("footer.traveling"),
    t("footer.travelIntelligence"),
    t("tags.budget"),
    t("tags.luxury"),
    t("tags.adventure"),
    t("tags.visa"),
    t("tags.backpacking"),
  ], [t]);
  return (
    <footer className="rstb-footer">
      {/* Main Footer Content */}
      <div className="nerio-container">
        <div className="footer-main">
          {/* Column 1: Brand */}
          <div className="footer-brand" style={{ flex: "1 1 280px" }}>
            <div className="footer-logo">
              {/* <Image
                src="/assets/images/footer/logo.png"
                alt="Travel News"
                width={120}
                height={30}
                priority={false}
              /> */}
              <h2 className="text-[50px] text-white font-bold ml-0">
                <BrandLogo gap="-0.10rem" />
              </h2>
            </div>
            <p className="footer-desc">
              {t("footer.deepDiveDescription")}
            </p>
            <div className="footer-social">
              {/* Facebook */}
              <a href="#" aria-label="Facebook">
                <svg
                  aria-hidden="true"
                  className="e-font-icon-svg e-fab-facebook-f"
                  viewBox="0 0 320 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram">
                <svg
                  aria-hidden="true"
                  className="e-font-icon-svg e-fab-instagram"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn">
                <svg
                  aria-hidden="true"
                  className="e-font-icon-svg e-fab-linkedin-in"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" aria-label="Twitter">
                <svg
                  aria-hidden="true"
                  className="e-font-icon-svg e-fab-x-twitter"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </a>
            </div>
            <div className="footer-app-buttons">
              <Image
                src="/assets/images/footer/spp_01.png"
                alt="Download on the App Store"
                width={140}
                height={42}
                priority={false}
              />
              <Image
                src="/assets/images/footer/spp_02.png"
                alt="Get it on Google Play"
                width={140}
                height={42}
                priority={false}
              />
            </div>
          </div>

          {/* Column 2: Top Categories */}
          <div className="footer-categories" style={{ flex: "1 1 200px" }}>
            <h5 className="footer-heading">{t("footer.topCategories")}</h5>
            <div className="footer-divider" />
            <ul className="footer-category-list">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <a href={cat.href}>
                    <CircleIcon />
                    <span>{cat.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Recent Posts */}
          <div className="footer-recent" style={{ flex: "1 1 300px" }}>
            <h5 className="footer-heading">{t("footer.recentPost")}</h5>
            <div className="footer-divider" />
            <div className="footer-recent-list">
              {recentPosts.map((post, i) => (
                <div className="footer-post-card" key={i}>
                  <div className="footer-post-thumb">
                    <a href={post.href}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={100}
                        height={100}
                        priority={false}
                      />
                    </a>
                  </div>
                  <div className="footer-post-content">
                    <h6 className="footer-post-title">
                      <a href={post.href}>{post.title}</a>
                    </h6>
                    <ul className="footer-post-meta">
                      <li>
                        <span className="fpg-meta">
                          <span>
                            By{" "}
                            <a href="#" className="fpg-author-link">
                              {post.author}
                            </a>
                          </span>
                        </span>
                      </li>
                      <li>
                        <span className="fpg-meta">
                          <svg
                            className="fpg-view-icon"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                              fill="currentColor"
                            />
                          </svg>
                          {post.views}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Tags */}
          <div className="footer-tags" style={{ flex: "1 1 350px" }}>
            <h5 className="footer-heading">{t("footer.tags")}</h5>
            <div className="footer-divider" />
            <div className="footer-tags-container">
              <div className="footer-tags-list">
                {tags.map((tag) => (
                  <a key={tag} href="#" className="footer-tag">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-copyright-bar">
        <div className="nerio-container">
          <div className="footer-copyright-inner">
            <p className="footer-copyright-text">
              &copy; {t("footer.copyright")}{" "}
              <a href="https://rstheme.com/">RSTheme</a>
            </p>
            <div className="footer-copyright-links">
              <a href="#" className="footer-bottom-btn">
                <span className="button-text" data-text={t("footer.privacyPolicyLink")}>
                  {t("footer.privacyPolicyLink")}
                </span>
              </a>
              <a href="#" className="footer-bottom-btn">
                <span className="button-text" data-text={t("footer.termsAgreements")}>
                  {t("footer.termsAgreements")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
