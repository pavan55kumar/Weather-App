import GlobeScene from "./GlobeScene";

export default function GlobeSection() {
  return (
    <section className="premium-card mt-8">

      <h2 className="text-3xl font-bold text-white mb-2">
        🌍 Explore the World
      </h2>

      <p className="text-slate-400 mb-6">
        Rotate the Earth and explore weather anywhere.
      </p>

      <div className="h-[600px] rounded-3xl overflow-hidden">

        <GlobeScene />

      </div>

    </section>
  );
}