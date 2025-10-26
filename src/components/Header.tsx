// File: frontend/src/components/Header.tsx (Updated)

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
      <h1 className="text-xl md:text-2xl font-bold text-main-text tracking-wide">
        Founder&apos;s Gauntlet
      </h1>
      <div>
        <SignedOut>
          <SignInButton>
            {/* This button will be styled by Clerk's appearance prop later */}
            <button className="px-4 py-2 bg-accent text-main-text font-medium rounded-lg hover:bg-blue-500 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}