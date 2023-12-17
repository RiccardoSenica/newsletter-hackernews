# Hackernews newsletter

## To do

- Check breakpoint for background: on mobile there are white bars
- Email layout (must contain link to newsletter page)
- Ico file

## Vercel basics

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
