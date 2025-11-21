import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

type Props = {
    posts: Post[];
}

export function RecentPosts({posts}: Props) {
    return (
        <section>
            <div className="grid grid-cols-1 gap-x-16 gap-y-20 mb-32">
                {posts.map((post) => (
                    <PostPreview
                        key={post.slug}
                        title={post.title}
                        datePosted={post.datePosted}
                        slug={post.slug}
                    />
                ))}
            </div>
        </section>
    )
}