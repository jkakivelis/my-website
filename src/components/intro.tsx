
export function Intro() {
  return (
    <section className="max-w-3xl mx-auto mt-20 mb-16 px-5">
      <div
        className="bg-white 
                   border border-gray-200
                   text-gray-800
                   rounded-xl shadow-sm
                   px-6 py-8"
      >
        <h1 className="text-3xl font-bold mb-4 text-center md:text-center">
          Welcome to My Website!
        </h1>
        <p className="text-base md:text-lg leading-relaxed tracking-tight text-justify">
          My name is James Kakivelis, and I'm a software developer from New York City. I love talking about history, games, and the ways we can use technology to make everyone's life a little bit easier. As you can probably tell, graphic design is not my passion, however you can still find links to some things that I've decided to write down below.
        </p>
      </div>
    </section>
  );
}