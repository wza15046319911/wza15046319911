# Work experience

At Broadsheet Media in Melbourne (Feb 2025 to Jun 2026) I owned broadsheet.com.au end to end.
On the frontend (Next.js, TypeScript, TailwindCSS, Radix UI) I designed and built the user account area, the saved-articles page, and every screen in the subscription paywall flow at broadsheet.com.au/subscribe, with Redis caching for performance.
I independently designed, built and deployed the backend (Node.js, TypeScript, PostgreSQL with Drizzle ORM) to GCP GKE: it pulls reading data from Amplitude and exposes an API that returns the top three most-read articles, handles user payment requests through the Chargebee SDK, and exposes newsletter subscription capabilities through the Braze SDK.
I also designed and built a Directus headless CMS from zero to one: I modelled all the schemas, ran the data migration, and decoupled every synchronous flow into an asynchronous Pub/Sub message queue, so editors never wait on an operation - workers execute each task and write results back to the database.
On top of that I integrated the publishing flow with Apple News, so editors can syndicate an article to Apple News as part of the normal publish flow.

At AnyStay in Brisbane (Dec 2023 to Dec 2024) I built a stays marketplace across hosts, guests, and memberships on React, GraphQL, and an AWS serverless backend. I designed DynamoDB tables and access patterns for high-throughput, low-latency workloads and decoupled core systems with an event-driven service bus deployed via Amplify and Lambda pipelines.

At TikTok (ByteDance) in Beijing (Jul 2023 to Dec 2023) I independently designed and built the merge-request middleware that Douyin QA relies on as the last line of defence for client code quality.
A very high volume of MRs merges into Douyin's main repository and its satellite repositories every day, and QA defines custom gating rules such as no feature merges after 5pm, no bugfix merges after 4pm, and a mandatory extra +1 review once a change exceeds 50 lines.
I built the rule-checking engine to be customisable and extensible, and it sustains 100+ requests per second at peak: hot rules are cached in Redis, long-running checks are offloaded to a message queue and processed by workers that write results back to the database and cache, and the whole system runs on Kubernetes.

At Kexing EasyGo in Brisbane (Nov 2020 to Nov 2022) I was the founder.
I designed a campus WeChat mini-program for University of Queensland students with class timetables, course reviews, a grade calculator, and assignment deadline countdown reminders.
I led a squad of 3-5 frontend and backend developers inside a team of around 20 people that also covered UI/UX, product, operations, and user growth.
The frontend was built in React and the backend in Node.js, running serverless on AWS Lambda with DynamoDB.
The app grew to 2,000+ users across three campuses with 100-200 daily active users, and it was operated as a non-profit.

At Graviti in Shanghai (Jan 2021 to Jan 2022) I built dataset tooling for AI development: a React dashboard and a distributed Python web-crawling system coordinated through a RabbitMQ job queue, with Golang APIs behind a custom gateway and crawler workers scaled elastically on Kubernetes.
