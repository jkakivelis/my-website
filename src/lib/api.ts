import { join } from "path";
import matter from "gray-matter";
import fs from "fs"
import { Post } from "@/interfaces/post";

const postsDir = join(process.cwd(), "posts");

//TODO eventually need to replace this with something else. Could hosts posts in S3 and pull from there

export function getPostSlugs() {
  return fs.readdirSync(postsDir).map(slug => slug.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string) {
  const fullPath = join(postsDir, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: slug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => post.preview != true)
    .sort((post1, post2) => (post1.datePosted > post2.datePosted ? -1 : 1));
  return posts;
}