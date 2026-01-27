import { ArrowDown, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-muted-foreground">
            Scholar <span className="text-border-bright mx-1">•</span> Developer <span className="text-border-bright mx-1">•</span> Educator
          </span>
        </div>

        {/* Profile Image */}
        <div className="mb-10 flex justify-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-75" />
            <img
              src="/hero.png"
              alt="Dr. Hafiz Hanif"
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>

        {/* Name */}
        <h1
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <span className="gradient-text">Hafiz Hanif</span>
          <span className="text-muted">, PhD</span>
        </h1>

        {/* Tagline */}
        <p
          className="text-xl sm:text-2xl text-muted-foreground mb-6 animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          Building software that empowers
        </p>

        {/* Description */}
        <p
          className="text-muted max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-10 animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          Educational technology researcher turned indie developer.
          Crafting native macOS apps and web tools that solve real problems.
        </p>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12 animate-fade-in-up"
          style={{ animationDelay: '500ms' }}
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-white">15+</p>
            <p className="text-xs sm:text-sm text-muted uppercase tracking-wider">Years Research</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-white">2</p>
            <p className="text-xs sm:text-sm text-muted uppercase tracking-wider">Apps Shipped</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-white">27+</p>
            <p className="text-xs sm:text-sm text-muted uppercase tracking-wider">Students Mentored</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >
          <a
            href="#apps"
            className="inline-flex flex-col items-center gap-2 text-muted hover:text-white transition-colors group"
          >
            <span className="text-xs uppercase tracking-wider">Explore Apps</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
