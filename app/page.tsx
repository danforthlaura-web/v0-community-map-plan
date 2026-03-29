import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Caveat } from 'next/font/google'

const caveat = Caveat({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kolibri-logo-FBRiDzMv5OsQ140bWgi7Cvj6milUQW.png" 
              alt="Kolibri Logo" 
              className="w-8 h-8"
            />
            <span className="font-bold text-lg text-foreground">Kolibri Map</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary text-sm">
              Map
            </Link>
            <Link href="/submit" className="text-foreground hover:text-primary text-sm">
              Submit Project
            </Link>
            <Link href="/admin" className="text-foreground hover:text-primary text-sm">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <img 
            src="/images/kolibri-logo.png" 
            alt="Kolibri Logo" 
            className="w-24 h-24 mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Meet the global Kolibri community. Share your story
          </h1>
          <p className="text-lg text-foreground/80 mb-8 text-pretty">
            Connect with implementers using Kolibri to provide offline learning to teachers and learners across the globe. Share your story and find inspiration from others in the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/map" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore the Map
              </Button>
            </Link>
            <Link href="/submit" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                Submit Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Submit Your Story</h3>
              <p className="text-foreground/70">
                Fill out our simple form with details about your Kolibri implementation, learners, and impact.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Our Team Reviews</h3>
              <p className="text-foreground/70">
                The Learning Equality team reviews your submission and gets back to you within a few days.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Go Live on the Map</h3>
              <p className="text-foreground/70">
                Your implementation appears on the map for the global community to discover and connect with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className={`${caveat.className} text-3xl font-bold text-foreground mb-8`}>Ready to Share Your Kolibri Story?</h2>
          <Link href="/submit">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Submit Your Project Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-foreground/60 text-sm">
          <p>© 2026 Learning Equality. Kolibri Community Map.</p>
        </div>
      </footer>
    </main>
  )
}
