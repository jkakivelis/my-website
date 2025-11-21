
import Alert from "@/components/alert";
import Container from "@/components/container";
import { Intro } from "@/components/intro";
import { RecentPosts } from "@/components/recent-posts";
import { getAllPosts } from "@/lib/api";

export default function Home() {

  
  const allPosts = getAllPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 via-orange-500 to-white">
      <Alert/>
      <Container>
        <Intro />
        <RecentPosts posts={allPosts} />
      </Container>
    </main>
  );
}
