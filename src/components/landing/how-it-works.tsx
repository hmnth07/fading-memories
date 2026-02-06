import { PenLine, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    title: "Describe Your Memory",
    description:
      "Answer a few gentle questions about the memory you want to preserve — who was there, where you were, how it felt.",
    iconColor: "text-[#C2410C]",
    bg: "bg-orange-100",
  },
  {
    icon: Wand2,
    title: "We Bring It to Life",
    description:
      "Our AI transforms your words into beautiful anime-style artwork that captures the emotion and atmosphere of your memory.",
    iconColor: "text-[#CA8A04]",
    bg: "bg-amber-100",
  },
  {
    icon: Download,
    title: "Keep It Forever",
    description:
      "Download your memory as a stunning image or an animated living photo — a moment preserved before it fades away.",
    iconColor: "text-[#78350F]",
    bg: "bg-[#F0E6D8]",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Three simple steps to preserve your most precious memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/60 transition-colors">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>

                {/* Step number */}
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Step {index + 1}
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
