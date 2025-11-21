import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  datePosted: string;
  slug: string;
};

export function PostPreview({
  title,
  datePosted,
  slug,
}: Props) {
  return (
    <div className="mx-100 outline-black outline-dashed focus:outline-hidden bg-white 
                   border border-gray-200
                   rounded-xl shadow-sm
                   px-6 py-8">
      <h3 className="text-3xl text-center md:text-center mb-3 leading-snug">
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-lg text-center md:text-center mb-4">
        <DateFormatter dateString={datePosted} />
      </div>
    </div>
  );
}
