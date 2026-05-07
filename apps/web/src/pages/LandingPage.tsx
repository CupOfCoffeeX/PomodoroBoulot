import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Github, Star, GitFork,
  Timer, ListTodo, Bell, Users, Minimize2, Globe,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '../hooks/useInView';
import { useGitHubRepo } from '../hooks/useGitHubRepo';
import { translations, type Lang } from '../i18n/translations';

const GITHUB_SLUG = 'CupOfCoffeeX/PomodoroBoulot';
const GITHUB_URL = 'https://github.com/CupOfCoffeeX/PomodoroBoulot';

const COFFEE_URL = 'https://buymeacoffee.com/sraebischl';

const FEATURE_ICONS: LucideIcon[] = [Timer, ListTodo, Bell, Users, Minimize2, Globe];

// ─── Animation wrapper ────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

export function LandingPage() {
  const [lang, setLang] = useState<Lang>('fr');
  const navigate = useNavigate();
  const T = translations[lang];
  const { repo } = useGitHubRepo(GITHUB_SLUG);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base select-none">
            <span className="text-xl">🍅</span>
            <span>PomodoroBoulot</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Lang toggle */}
            <div className="relative flex bg-muted rounded-lg p-0.5 text-xs select-none mr-2">
              <div
                className="absolute inset-y-0.5 bg-background rounded-md shadow-sm transition-all duration-300 pointer-events-none"
                style={{
                  left: lang === 'fr' ? '2px' : 'calc(50% + 1px)',
                  width: 'calc(50% - 3px)',
                }}
              />
              <button
                className={`relative z-10 px-2.5 py-1 rounded-md transition-colors duration-200 ${lang === 'fr' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                onClick={() => setLang('fr')}
              >
                FR
              </button>
              <button
                className={`relative z-10 px-2.5 py-1 rounded-md transition-colors duration-200 ${lang === 'en' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
            >
              <Github className="h-4 w-4" />
              {repo !== null && (
                <span className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3" />
                  {repo.stargazers_count}
                </span>
              )}
            </a>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
              {T.nav.login}
            </Button>
            <Button size="sm" onClick={() => navigate('/app')}>
              {T.nav.start}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-32 px-6 text-center overflow-hidden">
        {/* Glow background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--primary) / 0.12) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            opacity: 1,
            animation: 'fadeUp 700ms ease both',
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-border/60 bg-muted/50 rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {T.hero.badge}
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 whitespace-pre-line">
            {T.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            {T.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/app')}>
              {T.hero.cta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              onClick={() => navigate('/app')}
            >
              {T.hero.ctaSecondary}
            </Button>
          </div>

          {/* Platform badges */}
          <div className="flex items-center justify-center gap-3 mt-10 text-xs text-muted-foreground">
            <span>{T.hero.platforms}</span>
            <span className="border border-border/60 rounded-full px-3 py-1 bg-muted/40">🌐 Web</span>
            <span className="border border-border/60 rounded-full px-3 py-1 bg-muted/40"> macOS</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {T.features.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">{T.features.subtitle}</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {T.features.items.map((item, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <FadeUp key={i} delay={i * 80}>
                  <div className="group h-full border border-border/60 bg-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {T.howItWorks.title}
            </h2>
            <p className="text-muted-foreground text-lg">{T.howItWorks.subtitle}</p>
          </FadeUp>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-9 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-px bg-border/60" />

            <div className="grid md:grid-cols-3 gap-10">
              {T.howItWorks.steps.map((step, i) => (
                <FadeUp key={i} delay={i * 120} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <span className="text-xl font-mono font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {T.pricing.title}
            </h2>
            <p className="text-muted-foreground text-lg">{T.pricing.subtitle}</p>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <FadeUp delay={0}>
              <div className="h-full border border-emerald-500/30 bg-card rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/60 to-emerald-400/30" />
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {T.pricing.free.badge}
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">{T.pricing.free.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold">{T.pricing.free.price}</span>
                    <span className="text-muted-foreground text-sm">{T.pricing.free.desc}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {T.pricing.free.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <span className="text-emerald-500 text-base">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate('/app')}>
                  {T.pricing.free.cta}
                </Button>
              </div>
            </FadeUp>

            {/* Premium */}
            <FadeUp delay={100}>
              <div className="h-full border border-border/60 bg-card rounded-2xl p-8 relative overflow-hidden opacity-80">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500/40 to-violet-400/20" />
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {T.pricing.premium.badge}
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">{T.pricing.premium.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold">{T.pricing.premium.price}</span>
                    <span className="text-muted-foreground text-sm">{T.pricing.premium.desc}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {T.pricing.premium.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="text-violet-400 text-base">◇</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  {T.pricing.premium.cta}
                </Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── GitHub ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-border/60 bg-card rounded-2xl p-8 hover:border-border transition-all duration-300 hover:shadow-lg"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/70 transition-colors">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">CupOfCoffeeX /</span>
                      <span className="font-semibold text-sm">PomodoroBoulot</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      {T.github.badge}
                    </span>
                  </div>
                </div>
                {/* Arrow */}
                <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 text-lg">↗</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {repo?.description ?? T.github.desc}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-5 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span className="font-medium text-foreground tabular-nums">
                    {repo?.stargazers_count ?? '—'}
                  </span>
                  <span>{T.github.stars}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <GitFork className="h-4 w-4" />
                  <span className="font-medium text-foreground tabular-nums">
                    {repo?.forks_count ?? '—'}
                  </span>
                  <span>{T.github.forks}</span>
                </div>
                {repo?.language && (
                  <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span>{repo.language}</span>
                  </div>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{T.github.desc}</span>
                <span className="text-xs font-medium text-primary group-hover:underline">
                  {T.github.cta} →
                </span>
              </div>
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── Support / Buy me a coffee ── */}
      <section className="py-24 px-6 bg-muted/30">
        <FadeUp className="max-w-xl mx-auto text-center">
          <div className="text-5xl mb-6">☕</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">{T.support.title}</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">{T.support.desc}</p>
          <a href={COFFEE_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="h-12 px-8 gap-2.5 text-base hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500 transition-colors">
              ☕ {T.support.cta}
            </Button>
          </a>
        </FadeUp>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium">
            <span>🍅</span>
            <span>PomodoroBoulot</span>
          </div>
          <p>{T.footer.tagline}</p>
          <p>{T.footer.rights}</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
