import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/mdToHtml";
import Alert from "@/components/alert";
import Container from "@/components/container";
import { PostHeader } from "@/components/post/post-header";
import { PostBody } from "@/components/post/post-body";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <article className="mb-32">
        <PostHeader
            title={post.title}
            date={post.datePosted}
        />
        <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};