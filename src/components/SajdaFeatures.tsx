import { Clock, Bell, MapPin, Calendar, Settings, Volume2 } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Precise Prayer Times',
    description: 'Accurate prayer times with real-time countdown. Never miss a prayer with timely notifications right from your menu bar.',
    image: '/screengrabs/Main Page.png',
  },
  {
    icon: Calendar,
    title: 'Hijri Calendar Integration',
    description: 'Stay connected with Islamic dates. View Hijri dates alongside important Islamic reminders and events.',
    image: '/screengrabs/Main Countdown & Hijri Dates Reminder.png',
  },
  {
    icon: Bell,
    title: 'Customizable Athan',
    description: 'Choose from beautiful Athan recitations or subtle chimes. Configure notifications exactly how you prefer.',
    image: '/screengrabs/Athan Options.png',
  },
  {
    icon: Volume2,
    title: 'Flexible Audio Options',
    description: 'Full control over prayer alerts. Enable Athan, chimes, or silent mode. Track your daily prayers with the built-in tracker.',
    image: '/screengrabs/Option Athan, Chime, Mute & Prayer Tracker.png',
  },
  {
    icon: MapPin,
    title: 'JAKIM & Global Methods',
    description: 'Official JAKIM prayer times for Malaysia, plus support for global calculation methods. Automatic location detection.',
    image: '/screengrabs/Location & Analytics Settings.png',
  },
  {
    icon: Settings,
    title: 'Thoughtful Settings',
    description: 'Fine-tune every aspect of your experience. From calculation methods to notification preferences, make Sajda truly yours.',
    image: '/screengrabs/Settings Page.png',
  },
];

export function SajdaFeatures() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Featured App
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Sajda — Your Daily Prayer Companion
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          A beautifully crafted menu bar app that keeps you connected to your prayers.
          Designed for macOS with native performance and elegant simplicity.
        </p>
      </div>

      {/* Features Grid */}
      <div className="space-y-20">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isReversed = index % 2 === 1;

          return (
            <div
              key={feature.title}
              className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}
            >
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative overflow-hidden rounded-xl border border-violet-500/20 bg-surface shadow-2xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <div className={`${isReversed ? 'md:text-right' : ''}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-4`}>
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <div className="inline-block p-8 rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent border border-violet-500/20">
          <h3 className="text-xl font-semibold mb-2">Ready to enhance your prayer routine?</h3>
          <p className="text-muted mb-6">Download Sajda for free and experience the difference.</p>
          <a
            href="https://github.com/apitlekays/Sajda/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 rounded-lg text-white font-medium transition-colors"
          >
            Download for macOS
          </a>
          <p className="mt-4 text-xs text-muted">
            Requires macOS 13.0 or later • Apple Silicon & Intel supported
          </p>
        </div>
      </div>
    </section>
  );
}
