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
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/map_logo-djHbsUU8M69ZuFazgsl8CFKRXtZ5zl.png" 
            alt="Community Map Logo" 
            className="max-w-md w-auto h-auto mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Meet the Kolibri community. Share your story
          </h1>
          <p className="text-lg text-foreground/80 mb-8 text-pretty">
            Connect with implementers using Kolibri to provide offline learning to teachers and learners across the globe. Share your story and find inspiration from others in the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/map" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore the Kolibri map
              </Button>
            </Link>
            <Link href="/submit" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                Add your program to the map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Voices from the Community Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Voices from the Community</h2>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Quote Card */}
          <div className="flex-1 p-8 rounded-lg bg-card border border-accent/30">
            <div className="text-accent text-5xl mb-4 leading-none">{"'"}</div>
            <p className="italic text-foreground mb-6 leading-relaxed text-lg">
              I&apos;m actually an undergraduate student. Last year, my country was undergoing a hard time due to there not being enough water in the hydroelectric power plants, so we had to endure months of electricity shortages. Being completely honest, I was failing my calculus class. I did some research and I came across your platform. I used it for about two months, it helped me greatly to study during the electricity cuts. I could say, thanks to all the hard work you&apos;ve poured into this amazing platform, I was able to pass my class during those times. Thanks a lot, I&apos;m forever grateful.
            </p>
            <p className="text-base font-medium text-foreground">— Student, Ecuador</p>
          </div>

          {/* CTA Block */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Share a Learner Story</h3>
            <p className="text-foreground/70 mb-6 leading-relaxed text-lg">
              We&apos;re collecting before-and-after moments from learners using Kolibri. Help us inspire others by sharing the emotional impact Kolibri has made on a student&apos;s learning journey.
            </p>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/5">
                Share a Learner Story
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className={`${caveat.className} text-4xl font-bold text-foreground mb-8`}>Ready to Share Your Kolibri Story?</h2>
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
