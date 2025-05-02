import type { Route } from "./+types/home";
import { BlogPostsGrid } from "../views/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog Posts" },
    { name: "description", content: "Explore our latest blog posts" },
  ];
}

export default function Home() {
  return <BlogPostsGrid title="Latest Articles" />;
}
