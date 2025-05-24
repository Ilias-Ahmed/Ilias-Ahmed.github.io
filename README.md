# 🚀 Personal Portfolio - Ilias Ahmed

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iliasahmed/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A modern, interactive portfolio showcasing full-stack development expertise with stunning 3D visuals, smooth animations, and comprehensive skill demonstrations.

[![Portfolio Preview](https://img.shields.io/badge/Live_Demo-View_Portfolio-blue?style=for-the-badge)](https://your-portfolio-url.com)

![Portfolio Screenshot](https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=Portfolio+Screenshot)

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Key Sections](#-key-sections)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Customization](#-customization)
- [Performance](#-performance)
- [Accessibility](#-accessibility)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

### 🎨 Interactive Experience
- **3D Visualizations** - Immersive Three.js graphics and WebGL effects
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Custom Cursor** - Dynamic cursor that responds to user interactions
- **Voice Navigation** - Accessibility-first voice command support
- **Haptic Feedback** - Enhanced mobile experience with tactile responses
- **Interactive Background** - Mouse-following gradients and particle effects

### 📱 Responsive Design
- **Mobile-First Approach** - Seamless experience across all devices
- **Progressive Web App (PWA)** - Installable app with offline capabilities
- **Cross-Browser Compatibility** - Tested on Chrome, Firefox, Safari, Edge
- **Optimized Performance** - Lighthouse score 95+ across all metrics
- **Adaptive Loading** - Content loads based on connection speed

### 🔧 Advanced Features
- **Multiple View Modes** - Grid, mastery, comparison, and timeline views
- **Interactive Resume** - Dynamic PDF generation and real-time viewing
- **Skill Comparison** - Side-by-side technical skill analysis
- **Project Showcase** - Multiple presentation formats with live demos
- **Theme System** - Dark/light themes with 5 accent color options
- **Search & Filter** - Advanced filtering across projects and skills
- **Animations Control** - Respect for reduced motion preferences
- **Sound Effects** - Optional audio feedback for interactions

### 🛡️ Modern Development
- **TypeScript** - Full type safety throughout the application
- **Component Architecture** - Reusable, maintainable component system
- **Performance Monitoring** - Built-in analytics and performance tracking
- **Error Boundaries** - Graceful error handling and recovery
- **SEO Optimized** - Meta tags, structured data, and social sharing
- **Security Headers** - CSP and other security best practices

## 🛠️ Tech Stack

### **Frontend Framework**
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 18** - Latest React features with concurrent rendering
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript 5.0** - Type-safe development with latest features
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) **Vite 5.0** - Lightning-fast build tool and dev server

### **Styling & UI**
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS 3.0** - Utility-first CSS framework
- **PostCSS** - CSS processing and optimization
- **CSS Variables** - Dynamic theming system
- **Responsive Design** - Mobile-first approach with breakpoints

### **Animation & 3D**
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) **Framer Motion** - Production-ready motion library
- ![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white) **Three.js** - 3D graphics and WebGL rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **GSAP** - High-performance timeline animations
- **React Spring** - Spring-physics based animations

### **Data Visualization**
- **Recharts** - Composable charting library built on React components
- **D3.js** - Data-driven document manipulation
- **Custom SVG** - Hand-crafted graphics and icons
- **Canvas API** - High-performance drawing operations

### **Development Tools**
- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting and style consistency
- **Husky** - Git hooks for quality assurance
- **lint-staged** - Run linters on staged files
- **React Developer Tools** - Debugging and profiling

### **Routing & State**
- **React Router 6** - Client-side routing with nested routes
- **Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Persistent user preferences

### **Utilities & Libraries**
- **Sonner** - Beautiful toast notifications
- **Lucide React** - Beautiful & consistent icon library
- **clsx** - Conditional className utility
- **date-fns** - Modern JavaScript date utility library

## 🚀 Quick Start

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iliasahmed/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using pnpm
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   VITE_APP_TITLE=Ilias Ahmed - Portfolio
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_GOOGLE_ANALYTICS_ID=your_ga_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see your portfolio in action!

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Analyze bundle size
npm run analyze
```

## 📁 Project Structure

```
portfolio/
├── 📁 public/                 # Static assets
│   ├── 📁 audio/             # Background music and sound effects
│   │   ├── 🎵 ambient.mp3
│   │   └── 🔊 click.wav
│   ├── 📁 fonts/             # Custom web fonts
│   │   ├── 📝 Inter-Variable.woff2
│   │   └── 📝 Digital-7.woff2
│   ├── 📁 images/            # Images and graphics
│   │   ├── 🖼️ hero-bg.webp
│   │   ├── 👤 profile.jpg
│   │   └── 📁 projects/      # Project screenshots
│   ├── 📁 models/            # 3D models and assets
│   │   └── 🎲 scene.gltf
│   ├── 📄 manifest.json      # PWA manifest
│   └── 🔖 favicon.ico
├── 📁 src/
│   ├── 📁 components/        # Reusable UI components
│   │   ├── 📁 about/         # About section components
│   │   │   ├── 📄 About.tsx
│   │   │   ├── 📄 AboutCard.tsx
│   │   │   ├── 📄 Timeline.tsx
│   │   │   └── 📄 aboutData.ts
│   │   ├── 📁 contact/       # Contact form and info
│   │   │   ├── 📄 Contact.tsx
│   │   │   ├── 📄 ContactForm.tsx
│   │   │   └── 📄 SocialLinks.tsx
│   │   ├── 📁 navigation/    # Navigation components
│   │   │   ├── 📄 Navigation.tsx
│   │   │   ├── 📄 NavigationMenu.tsx
│   │   │   ├── 📄 DotsNavigation.tsx
│   │   │   ├── 📄 DockNavigation.tsx
│   │   │   ├── 📄 GestureNavigation.tsx
│   │   │   └── 📄 VoiceNavigation.tsx
│   │   ├── 📁 projects/      # Project showcase components
│   │   │   ├── 📄 Projects.tsx
│   │   │   ├── 📄 ProjectCard.tsx
│   │   │   ├── 📄 ProjectModal.tsx
│   │   │   └── 📄 projectsData.ts
│   │   ├── 📁 skills/        # Skills visualization
│   │   │   ├── 📄 Skills.tsx
│   │   │   ├── 📄 SkillCard.tsx
│   │   │   ├── 📄 SkillsGrid.tsx
│   │   │   ├── 📄 SkillsComparison.tsx
│   │   │   └── 📄 skillsData.ts
│   │   └── 📁 ui/           # Generic UI components
│   │       ├── 📄 Button.tsx
│   │       ├── 📄 Modal.tsx
│   │       ├── 📄 BackToTop.tsx
│   │       ├── 📄 CommandPalette.tsx
│   │       ├── 📄 LoadingSpinner.tsx
│   │       └── 📄 ThemeToggle.tsx
│   ├── 📁 contexts/         # React Context providers
│   │   ├── 📄 NavigationContext.tsx
│   │   ├── 📄 ThemeContext.tsx
│   │   └── 📄 AudioContext.tsx
│   ├── 📁 hooks/           # Custom React hooks
│   │   ├── 📄 use-mobile.ts
│   │   ├── 📄 use-intersection-observer.ts
│   │   ├── 📄 use-local-storage.ts
│   │   └── 📄 use-scroll-progress.ts
│   ├── 📁 lib/             # Utility libraries
│   │   ├── 📄 analytics.ts
│   │   ├── 📄 constants.ts
│   │   └── 📄 utils.ts
│   ├── 📁 pages/           # Page components
│   │   ├── 📄 HomePage.tsx
│   │   └── 📄 NotFound.tsx
│   ├── 📁 styles/          # Global styles
│   │   ├── 📄 globals.css
│   │   └── 📄 animations.css
│   ├── 📁 utils/           # Helper functions
│   │   ├── 📄 animations.ts
│   │   ├── 📄 performance.ts
│   │   └── 📄 seo.ts
│   ├── 📄 App.tsx          # Main App component
│   ├── 📄 main.tsx         # Application entry point
│   └── 📄 vite-env.d.ts    # Vite type definitions
├── 📄 .env.example         # Environment variables template
├── 📄 .eslintrc.cjs        # ESLint configuration
├── 📄 .gitignore           # Git ignore rules
├── 📄 index.html           # HTML template
├── 📄 package.json         # Project dependencies and scripts
├── 📄 postcss.config.js    # PostCSS configuration
├── 📄 prettier.config.js   # Prettier configuration
├── 📄 README.md           # Project documentation
├── 📄 tailwind.config.js   # Tailwind CSS configuration
├── 📄 tsconfig.json        # TypeScript configuration
├── 📄 tsconfig.node.json   # TypeScript config for Node.js
└── 📄 vite.config.ts       # Vite configuration
```

## 🎯 Key Sections

### **🏠 Hero Section**
- Animated greeting with typewriter effect
- Interactive background with mouse-following gradients
- Call-to-action buttons with micro-interactions
- Scroll indicator with smooth animations
- Dynamic particles system

### **👨‍💻 About Section**
- Interactive profile card with flip animations
- Professional timeline with milestone markers
- Certification gallery with smooth scrolling
- Quick facts and statistics visualization
- Downloadable resume with PDF generation

### **🛠️ Skills Section**
- **Grid View** - Visual skill cards with progress indicators
- **Mastery View** - Skill proficiency levels and experience
- **Comparison View** - Side-by-side skill analysis
- **Interactive Details** - Modal with detailed skill information
- **Search & Filter** - Real-time skill filtering and search

### **💼 Projects Section**
- **Showcase Mode** - Featured projects carousel with 3D effects
- **Grid Layout** - All projects in responsive grid
- **Timeline View** - Chronological project progression
- **Project Details** - Comprehensive project information
- **Live Demos** - Direct links to working applications

### **📞 Contact Section**
- Interactive contact form with validation
- Real-time form feedback and error handling
- Social media integration with hover effects
- Professional contact information
- Email integration with EmailJS

### **🧭 Navigation**
- Multiple navigation styles (dots, dock, menu)
- Voice command support
- Gesture navigation for mobile
- Command palette for quick access
- Keyboard shortcuts for power users

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# App Configuration
VITE_APP_TITLE="Ilias Ahmed - Full Stack Developer"
VITE_APP_DESCRIPTION="Modern portfolio showcasing full-stack development expertise"
VITE_APP_URL="https://your-portfolio-url.com"

# Email Configuration (EmailJS)
VITE_EMAILJS_SERVICE_ID="your_service_id"
VITE_EMAILJS_TEMPLATE_ID="your_template_id"
VITE_EMAILJS_PUBLIC_KEY="your_public_key"

# Analytics
VITE_GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"

# Features
VITE_ENABLE_VOICE_NAVIGATION="true"
VITE_ENABLE_SOUND_EFFECTS="true"
VITE_ENABLE_ANALYTICS="true"
```

### **Theme Customization**

The portfolio supports multiple themes defined in `src/styles/globals.css`:

```css
/* Available accent colors */
:root {
  --accent-purple: #8b5cf6;
  --accent-blue: #3b82f6;
  --accent-green: #10b981;
  --accent-pink: #ec4899;
  --accent-orange: #f59e0b;
}
```

### **Content Customization**

#### **Skills Data** (`src/components/skills/skillsData.ts`)
```typescript
export const skills: Skill[] = [
  {
    id: "react",
    name: "React",
    level: 95,
    category: "Frontend",
    icon: "⚛️",
    color: "#61DAFB",
    description: "Building scalable web applications",
    projects: 15,
    yearsExperience: 3,
    keywords: ["Components", "Hooks", "Context", "Redux"]
  },
  // Add more skills...
];
```

#### **Projects Data** (`src/components/projects/projectsData.ts`)
```typescript
export const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with React and Node.js",
    image: "/images/projects/ecommerce.jpg",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://demo.example.com",
    github: "https://github.com/username/project",
    color: "#8a2be2",
    featured: true,
    completionDate: "2024-01-15"
  },
  // Add more projects...
];
```

#### **About Information** (`src/components/about/aboutData.ts`)
```typescript
export const aboutData = {
  bio: "Full-Stack Developer with 3+ years of experience...",
  timeline: [
    {
      year: "2024",
      title: "Senior Full-Stack Developer",
      company: "Tech Company",
      description: "Leading development of web applications..."
    },
    // Add more timeline entries...
  ],
  certifications: [
    {
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      image: "/images/certs/aws.png"
    },
    // Add more certifications...
  ]
};
```

## 🚀 Deployment

### **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iliasahmed/portfolio)

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect the framework

2. **Configure Environment Variables**
   - Add your environment variables in Vercel dashboard
   - Go to Project Settings → Environment Variables

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Custom domains can be configured in the Domains section

### **Netlify**

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Environment Variables**
   - Add variables in Site settings → Environment variables

### **GitHub Pages**

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### **Manual Deployment**

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Upload dist/ folder to your hosting service
# The dist/ folder contains all static files needed
```

## 🎨 Customization Guide

### **Adding New Skills**

1. **Update Skills Data**
   ```typescript
   // src/components/skills/skillsData.ts
   {
     id: "new-skill",
     name: "New Skill",
     level: 85,
     category: "Frontend", // Frontend, Backend, DevOps, Database
     icon: "🚀",
     color: "#3B82F6",
     description: "Description of your new skill",
     projects: 10,
     yearsExperience: 2,
     keywords: ["keyword1", "keyword2"]
   }
   ```

2. **Add Skill Icon** (optional)
   - Add custom SVG or emoji icon
   - Update the icon property in skill data

### **Adding New Projects**

1. **Add Project Data**
   ```typescript
   // src/components/projects/projectsData.ts
   {
     id: "new-project",
     title: "New Project",
     description: "Detailed project description",
     image: "/images/projects/new-project.jpg",
     tags: ["React", "TypeScript", "Node.js"],
     link: "https://live-demo.com",
     github: "https://github.com/username/project",
     color: "#8a2be2",
     featured: true, // Will appear in featured section
     completionDate: "2024-01-01"
   }
   ```

2. **Add Project Images**
   - Add high-quality screenshots to `public/images/projects/`
   - Recommended size: 1200x800px
   - Format: WebP for better performance, with JPG fallback

### **Customizing Animations**

```typescript
// src/utils/animations.ts
export const customAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};
```

### **Adding New Themes**

1. **Define Theme Colors**
   ```css
   /* src/styles/globals.css */
   :root {
     --accent-custom: #your-color;
   }
   ```

2. **Update Theme Context**
   ```typescript
   // src/contexts/ThemeContext.tsx
   export type ThemeAccent = 'purple' | 'blue' | 'green' | 'pink' | 'orange' | 'custom';
   ```

## 📊 Performance

### **Lighthouse Scores**
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### **Optimization Techniques**

#### **Code Splitting**
```typescript
// Lazy loading components
const ProjectModal = lazy(() => import('./ProjectModal'));
const SkillsComparison = lazy(() => import('./SkillsComparison'));
```

#### **Image Optimization**
- WebP format with fallbacks
- Responsive images with `srcset`
- Lazy loading for below-the-fold images
- Optimized thumbnails for projects

#### **Bundle Optimization**
- Tree shaking for unused code
- Dynamic imports for large dependencies
- Vendor chunk splitting
- Gzip compression

#### **Caching Strategy**
```typescript
// Service Worker for caching
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
];
```

#### **Performance Monitoring**
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## ♿ Accessibility

### **WCAG 2.1 AA Compliance**
- Color contrast ratios meet AA standards
- All interactive elements are keyboard accessible
- Screen reader friendly with proper ARIA labels
- Focus indicators for keyboard navigation

### **Features**
- **Keyboard Navigation** - Full keyboard support for all interactions
- **Voice Commands** - Navigate using voice instructions
- **Screen Reader Support** - Comprehensive ARIA labels and semantic HTML
- **High Contrast Mode** - Accessible color schemes for better visibility
- **Reduced Motion** - Respects `prefers-reduced-motion` settings
- **Font Scaling** - Responsive to user font size preferences
- **Alternative Text** - Descriptive alt text for all images

### **Testing Tools**
- **axe-core** - Automated accessibility testing
- **WAVE** - Web accessibility evaluation
- **Lighthouse** - Accessibility audit
- **Screen Readers** - Tested with NVDA, JAWS, and VoiceOver

## 🔒 Security

### **Security Headers**
```typescript
// vite.config.ts - Security headers
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});
```

### **Best Practices**
- Input validation and sanitization
- XSS protection
- CSRF protection for forms
- Secure environment variable handling
- Regular dependency updates

## 🧪 Testing

### **Testing Stack**
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking for tests

### **Running Tests**
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### **Example Test**
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📱 PWA Features

### **Progressive Web App**
- **Offline Support** - Service worker for offline functionality
- **Install Prompt** - Add to home screen capability
- **App-like Experience** - Native app feel on mobile devices
- **Background Sync** - Sync data when connection is restored

### **Manifest Configuration**
```json
{
  "name": "Ilias Ahmed - Portfolio",
  "short_name": "Portfolio",
  "description": "Full-Stack Developer Portfolio",
  "theme_color": "#8b5cf6",
  "background_color": "#1a1a1a",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/"
}
```

## 🔍 SEO Optimization

### **Meta Tags**
```html
<meta name="description" content="Full-Stack Developer specializing in React, Node.js, and modern web technologies">
<meta name="keywords" content="Full Stack Developer, React, Node.js, TypeScript, Web Development">
<meta property="og:title" content="Ilias Ahmed - Full Stack Developer">
<meta property="og:description" content="Modern portfolio showcasing full-stack development expertise">
<meta property="og:image" content="/images/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
```

### **Structured Data**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ilias Ahmed",
  "jobTitle": "Full Stack Developer",
  "url": "https://your-portfolio-url.com",
  "sameAs": [
    "https://linkedin.com/in/iliasahmed",
    "https://github.com/iliasahmed"
  ]
}
```

## 🤝 Contributing

We welcome contributions to improve this portfolio! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### **Types of Contributions**
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- ♿ Accessibility improvements

### **Reporting Issues**
If you find a bug or have a suggestion, please [open an issue](https://github.com/iliasahmed/portfolio/issues) with:
- Clear description of the problem
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, etc.)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Ilias Ahmed

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and the following projects:

### **Core Technologies**
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at any scale
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

### **Animation & Graphics**
- [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library for React
- [Three.js](https://threejs.org/) - JavaScript 3D library
- [GSAP](https://greensock.com/gsap/) - Professional-grade animation library
- [React Spring](https://react-spring.dev/) - Spring-physics based animations

### **UI Components & Icons**
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon library
- [Recharts](https://recharts.org/) - Redefined chart library built with React
- [Sonner](https://sonner.emilkowal.ski/) - An opinionated toast component

### **Development Tools**
- [ESLint](https://eslint.org/) - Pluggable JavaScript linter
- [Prettier](https://prettier.io/) - Opinionated code formatter
- [Husky](https://typicode.github.io/husky/) - Modern native Git hooks

### **Deployment & Hosting**
- [Vercel](https://vercel.com/) - Platform for frontend frameworks and static sites
- [Netlify](https://netlify.com/) - Platform for modern web projects
- [GitHub Actions](https://github.com/features/actions) - Automate workflows

### **Inspiration**
- Various portfolio designs from the developer community
- Modern web design trends and best practices
- Accessibility guidelines from W3C and WebAIM

## 📧 Contact

**Ilias Ahmed** - Full Stack Developer

- 📧 **Email**: [ilias.ahmed@example.com](mailto:ilias.ahmed@example.com)
- 🔗 **LinkedIn**: [linkedin.com/in/iliasahmed](https://linkedin.com/in/iliasahmed)
- 🐙 **GitHub**: [github.com/iliasahmed](https://github.com/iliasahmed)
- 🌐 **Portfolio**: [iliasahmed.dev](https://iliasahmed.dev)
- 🐦 **Twitter**: [@iliasahmed_dev](https://twitter.com/iliasahmed_dev)

### **Let's Connect!**
I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and development. Feel free to reach out!

---

<div align="center">

### 🌟 If you found this portfolio helpful, please consider giving it a star!

[![GitHub stars](https://img.shields.io/github/stars/iliasahmed/portfolio?style=social)](https://github.com/iliasahmed/portfolio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/iliasahmed/portfolio?style=social)](https://github.com/iliasahmed/portfolio/network/members)

**Made with ❤️ and ☕ by [Ilias Ahmed](https://github.com/iliasahmed)**

*Last updated: January 2024*

</div>
