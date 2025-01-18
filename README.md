# 📰 HackerNews Newsletter

A Next.js application that aggregates HackerNews stories and delivers them as personalized daily newsletters.

## ✨ Features
- 📧 Daily newsletter containing curated HackerNews stories
- ☁️ Vercel hosting integration

## 🚀 Future improvements
- ⏰ Cron every 10 minutes and reduce time delta to 10 minutes: people are more likely to open the newsletter if delivered around the time when they subscribed (if cron becomes not enough, then the cost of sending all the emails might be a bigger issue)

## 🛠️ Tech Stack
- ⚡ Next.js
- 🗄️ Prisma (Database ORM)
- 🚀 Vercel (Hosting)
- 📝 Custom email templates

## 🏁 Getting Started

### 📋 Prerequisites
- 📦 Node.js
- 🐳 Docker
- 🔧 Vercel CLI
- 🧶 Yarn package manager

### 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/RiccardoSenica/newsletter-hackernews
cd hackernews-newsletter
```

2. Install dependencies:
```bash
yarn install
```

3. Set up Vercel:
```bash
# Install Vercel CLI
yarn add -g vercel@latest

# Link to your Vercel project
yarn vercel:link

# Pull environment variables
yarn vercel:env
```

4. Set up the database:
```bash
# Push Prisma schema to database
yarn db:push

# Generate Prisma client
yarn prisma:generate
```

### 🔧 Development

Run locally with Docker:
```bash
docker-compose up --build
```

### 🗄️ Database Management

Reset database (⚠️ caution: this will delete all data):
```bash
yarn db:reset
```

## 🙏 Acknowledgments
- 🎨 [Gradient Buttons](https://gradientbuttons.colorion.co/)
- ✨ [Custom Animation Effects](https://codepen.io/alphardex/pen/vYEYGzp)
