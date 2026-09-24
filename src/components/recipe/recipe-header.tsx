type Props = {
  title: string;
  photoUrl: string | null;
  servings: string | null;
  prepTime: string | null;
  cookTime: string | null;
  totalTime: string | null;
  categories: string[];
};

export function RecipeHeader({
  title,
  photoUrl,
  servings,
  prepTime,
  cookTime,
  totalTime,
  categories,
}: Props) {
  const meta = [
    servings && { label: "Servings", value: servings },
    prepTime && { label: "Prep", value: prepTime },
    cookTime && { label: "Cook", value: cookTime },
    totalTime && { label: "Total", value: totalTime },
  ].filter((m): m is { label: string; value: string } => !!m);

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none mb-6 text-center md:text-left">
        {title}
      </h1>

      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={title}
          className="w-full max-w-2xl mx-auto rounded-xl mb-6 object-cover"
        />
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
          {categories.map((c) => (
            <span
              key={c}
              className="text-sm bg-gray-200 text-gray-700 rounded-full px-3 py-1"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {meta.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start mb-8 text-gray-600">
          {meta.map((m) => (
            <div key={m.label}>
              <span className="font-semibold">{m.label}:</span> {m.value}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
