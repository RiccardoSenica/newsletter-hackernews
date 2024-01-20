# Hackernews newsletter

## Next up

- Adjust card size
- Batch email (Resend: ETA early 2024)
- Custom url shortener for links in the newsletter
- Cron every 10 minutes: people are more likely to open the newsletter if delivered around the time when they subscribed (if cron becomes not enough, then the cost of sending all the emails might be a bigger issue)

## Commands

Install vercel cli

```bash
yarn add -g vercel@latest
```

Link to vercel

```bash
yarn vercel:link
```

Pull env variables from vercel

```bash
yarn vercel:env
```

Push Prisma schema to vercel

```bash
yarn db:push
```

Generate Prisma client

```bash
yarn prisma:generate
```

Reset Prisma database

```bash
yarn db:reset
```

Run on Docker

```bash
docker-compose up --build
```
