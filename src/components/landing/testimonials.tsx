import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "I could barely remember what my grandmother's kitchen looked like. Now I have a picture that feels exactly like being there again.",
    author: "Mika T.",
    detail: "Preserved a childhood memory",
  },
  {
    quote:
      "The summer evenings we spent by the river — I was afraid I'd forget them. This captured the feeling perfectly.",
    author: "James R.",
    detail: "Brought back a family moment",
  },
  {
    quote:
      "I described a walk I took with my dad when I was small. The image made me cry. It's exactly how it felt.",
    author: "Sarah L.",
    detail: "Relived a moment with her father",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-[#F0E6D8]/30 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Memories Preserved
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Stories from people who brought their fading memories back to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.author}
              className="border-0 shadow-sm bg-[#FAF6F1]/80 backdrop-blur-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
