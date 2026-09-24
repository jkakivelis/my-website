import Link from "next/link";

type Props = {
  title: string;
  slug: string;
  photoUrl: string | null;
};

export function RecipePreview({ title, slug, photoUrl }: Props) {
  return (
    <Link
      href={`/recipes/${slug}`}
      className="block bg-white border border-gray-200 rounded-xl shadow-sm
                 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No photo
          </div>
        )}
      </div>
      <h3 className="text-lg text-center p-3 leading-snug hover:underline">
        {title}
      </h3>
    </Link>
  );
}
