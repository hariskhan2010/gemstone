# Gemstone Project - QWEN Context

## Project Overview
This is a Next.js 16 application called "Gemstone" that appears to be an e-commerce website for "Asian Gemstones" - a business dealing in rough, cut and polished gemstones, hand made stone carvings, and hand made jewelry. The site features a modern design with amber/gold color scheme, animations using Framer Motion, and responsive layout.

### Technologies Used
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom configurations
- **Animations**: Framer Motion
- **Fonts**: Google Fonts (Geist family)
- **UI Components**: Custom React components with Tailwind styling
- **Deployment**: Optimized for Vercel deployment

### Project Structure
```
gemstone/
├── app/                    # Next.js app router directory
│   ├── components/         # Reusable UI components
│   │   ├── hero.tsx        # Hero section with animations
│   │   ├── about.tsx       # About page section
│   │   ├── order.tsx       # Order section
│   │   └── navbar.tsx      # Navigation bar
│   ├── globals.css         # Global styles and Tailwind imports
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main home page
├── public/                 # Static assets (images)
├── .env                    # Environment variables
├── .gitignore
├── README.md               # Project documentation
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
```

## Key Features
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Animated UI**: Smooth animations using Framer Motion
- **Modern UI**: Amber/gold color palette with elegant design
- **Multi-section Layout**: Hero, About, Order sections on main page
- **Dark Mode Support**: Automatic dark/light theme based on system preferences

## Building and Running

### Prerequisites
- Node.js (v18 or newer)
- npm, yarn, pnpm, or bun

### Installation
1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Development Commands
- **Development Server**: 
  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  # or
  bun dev
  ```
  Then open [http://localhost:3000](http://localhost:3000) in your browser.

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Start Production Server**:
  ```bash
  npm run start
  ```

- **Linting**:
  ```bash
  npm run lint
  ```

## Development Conventions

### Styling
- Uses Tailwind CSS for utility-first styling
- Custom color palette with amber/gold primary colors
- Responsive design with mobile-first approach
- Dark mode support through CSS variables
- Custom shadows and gradients for gemstone aesthetic

### Components
- Located in `app/components/` directory
- All components use the "use client" directive for client-side rendering
- Animations implemented with Framer Motion
- Components follow Next.js best practices
- Reusable section components for main page layout

### File Naming
- Components use PascalCase (e.g., `Hero.tsx`)
- Pages use lowercase with appropriate extensions (e.g., `page.tsx`, `layout.tsx`)
- CSS files use camelCase (e.g., `globals.css`)

### Environment Variables
- Uses `.env` file for environment variables
- Contains GEMINI_API_KEY for potential AI integration

## Key Dependencies
- **next**: Next.js framework
- **react & react-dom**: Core React libraries
- **typescript**: Type checking
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library
- **styled-components**: CSS-in-JS styling (though Tailwind appears to be primary)

## Component Structure
The main page is composed of multiple sections:
1. **Navbar**: Navigation component
2. **Hero**: Main landing section with animated text and gemstone image
3. **AboutPage**: Company information with heritage and mission sections
4. **OrderPage**: Ordering section (implementation details in order.tsx)

## Assets
- Images are stored in the `public/` directory
- Includes gemstone images like "Aquamarine.jpg" and "gems cutting.png"
- Images are properly optimized with Next.js Image component

## Special Notes
- The project has a focus on gemstones and jewelry business
- Uses elegant animations to enhance user experience
- Includes ethical sourcing and craftsmanship messaging
- Features a 20+ year heritage story for the business