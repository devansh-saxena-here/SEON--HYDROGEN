import React from 'react';
import { LandingNavbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { LandingSections } from '../components/landing/Sections';
import { LandingFooter } from '../components/landing/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <Hero />
        <LandingSections />
      </main>
      <LandingFooter />
    </div>
  );
}
