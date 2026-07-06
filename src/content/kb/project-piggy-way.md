# Piggy Way - production e-commerce

Piggy Way is a production e-commerce platform for guinea pig and rabbit supplies, built on Next.js 16 and React 19. The front end acts as a backend-for-frontend layer that proxies a dedicated backend with a Directus CMS upstream, so editors publish content without deploys.

The BFF keeps credentials server side, with silent token refresh and guest cart sessions that survive refreshes through session tokens. Stripe powers checkout, NextAuth handles Google and email sign-in, and Cloudflare Turnstile guards forms. The component library is documented in Storybook and tested with Vitest browser mode.

[[ASK ZANE: the hardest problem in Piggy Way and how you solved it; anything you would do differently]].

It is a private production codebase, so there is no public repository.
