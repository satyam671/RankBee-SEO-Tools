# RankBee - SEO Tools Web Application

## Overview

RankBee is a comprehensive full-stack SEO tools web application that provides a complete toolkit for keyword research, site analysis, and SEO optimization. The application features multiple tools including advanced keyword research, Website Authority (DA/PA) analysis, backlink analysis, meta tag extraction, and rank tracking. Built as a modern React frontend with an Express.js backend, it uses web scraping and algorithmic approaches to provide SEO insights without relying on paid external APIs.

## Recent Changes (August 2025)

### Latest Updates (August 7, 2025)
- **Deployment Issue Resolution**: Diagnosed and fixed critical deployment problems preventing content display across Firebase, Vercel, and GitHub platforms. Root cause was full-stack architecture requiring Node.js backend conflicting with static hosting requirements
- **Comprehensive Deployment Configuration**: Created deployment configs for multiple platforms (firebase.json, vercel.json, netlify.toml, GitHub Actions workflow) with proper build output directory (dist/public) and SPA routing rewrites
- **SEO-Optimized index.html**: Enhanced with comprehensive meta tags, Open Graph/Twitter Cards, structured data (JSON-LD), professional favicon, canonical URLs, and theme colors for better search rankings and social media sharing
- **Multi-Platform Support**: Configured for Firebase Hosting (static), Vercel (static/full-stack), Netlify, GitHub Pages with proper asset caching, URL rewrites, and build commands
- **Professional Branding**: Updated honeybee logo using user-provided image design with anatomically correct bee structure, golden stripes, translucent wings, and perfect square box alignment
- **Production Build Optimization**: Fixed build process to generate complete dist/public directory with all static assets, proper bundling, and deployment-ready structure for immediate hosting

## Historical Changes

- **Complete Site Redesign & Mobile Optimization**: Redesigned logo with proper "RankBee" and "Professional Tools" text alignment with square logo, implemented comprehensive mobile-friendly design with responsive navigation, mobile search functionality, and optimized layouts for all screen sizes
- **SEO Optimization & Content Enhancement**: Added comprehensive SEO meta tags, keywords, Open Graph tags, and enhanced content with relevant SEO keywords throughout the site for better search engine discoverability and SERP rankings. Updated page titles, descriptions, and structured data
- **Google Authentication Integration**: Implemented Firebase-based Google authentication with complete login/registration system, backend OAuth routes, and secure session management. Users can now sign in with Google or traditional email/password
- **Database Integration**: Successfully integrated PostgreSQL database with Drizzle ORM, updated schema for Google authentication support, and pushed database migrations. Includes user management, tool results storage, and session handling
- **Enhanced Tool Card Design**: Fixed text formatting and alignment issues in SEO guides section with proper icon positioning, improved spacing, and better typography consistency matching design specifications
- **Functional Quick Search**: Created responsive search functionality in header that filters tools in real-time, auto-scrolls to tools section, and works on both desktop and mobile with proper data attributes
- **Enhanced Keyword Research Tool**: Implemented advanced relevance scoring system with balanced keyword distribution (30% short-tail, 40% medium-tail, 30% long-tail) based on commercial intent and search volume estimation
- **New Website Authority (DA/PA) Tool**: Completely rebuilt domain authority checker with real-time web scraping for metadata extraction, removing all estimation functions for authentic data only
- **Real-time Backlink Analyzer**: Created comprehensive link analysis service that scrapes webpages to extract internal/external links with rel attributes, anchor text, and dofollow/nofollow status
- **Enhanced Rank Tracker with DuckDuckGo**: Streamlined rank tracking service focused on reliable DuckDuckGo scraping with intelligent caching (10-minute cache), batch keyword processing (up to 50 keywords), and comprehensive analytics. Includes respectful rate limiting, detailed summary statistics, and graceful error handling for production use
- **Real-time Web Scraping**: All SEO tools now use only live web scraping with no mock data, estimation functions, or fallback synthetic data - ensuring authentic results from real sources
- **Replit Migration Complete**: Successfully migrated from Replit Agent to standard Replit environment with proper security practices and client/server separation. Fixed Firebase authentication with popup-based login and comprehensive error handling for domain authorization
- **Navigation and UX Improvements**: Fixed all navigation buttons to properly scroll to tools section, removed redundant buttons, updated contact form with Formspree integration, removed social media icons, and improved typography with better spacing throughout the application
- **UI Redesign (August 2025)**: Complete header and hero section redesign based on user specifications featuring clean white background, updated bee logo, simplified navigation with Quick Search, gradient text for "RankBee" title, Free SEO Tools badge, and streamlined button layout matching provided design mockups
- **Competition Checker Bug Fix**: Fixed issue where only 5 competitors were displayed despite finding 16+ results. Enhanced error handling ensures all discovered competitors are shown, using fallback data when websites block analysis
- **Improved Competitor Display**: Modified competition analysis to immediately show all discovered competitors with basic data, then enhance with detailed metrics when possible, ensuring no competitors are lost due to analysis delays or failures
- **Enhanced Competition Checker**: Upgraded with advanced Puppeteer-based scraping to extract comprehensive top 20 search results from Google, Bing, Yahoo, and DuckDuckGo with improved selector strategies and fallback mechanisms
- **Improved Rank Tracker**: Rebuilt with advanced Puppeteer scraping supporting all 4 search engines (Google, Bing, Yahoo, DuckDuckGo) using engine-specific selectors, user-agent rotation, and intelligent fallback systems for better accuracy
- **New Top Search Queries Tool**: Created comprehensive keyword analysis tool that discovers what keywords websites rank for, including search volume, CPC estimates, difficulty scores, click estimates, and trending data. Uses multi-source scraping approach with Google suggestions, related queries, and live ranking verification across 20+ countries
- **New Top Referrers Tool**: Built advanced referrer analysis service that discovers websites linking to target domains through multi-source web scraping (Google, Bing, DuckDuckGo, social media). Provides comprehensive backlink profile with domain authority estimation, link type detection (dofollow/nofollow), domain age analysis, and detailed referrer metrics with no artificial limits on results returned
- **New Amazon Keyword Tool**: Created specialized Amazon keyword research tool with real-time web scraping for product keywords, autocomplete suggestions, and related terms. Provides search volume estimates, competition analysis, CPC calculations, difficulty scores, and commercial intent detection across 12+ Amazon marketplaces
- **New YouTube Keyword Tool**: Built comprehensive YouTube keyword analyzer with multi-source data collection from autocomplete, video titles, and trending content. Features country-specific analysis, tutorial keyword detection, content optimization suggestions, and video performance metrics across global YouTube markets

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: Zustand for authentication state with persistence
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with session management
- **Web Scraping**: Cheerio and Axios for HTML parsing and HTTP requests
- **Password Security**: bcrypt for password hashing

### Database Design
- **Users Table**: Stores user credentials and profile information
- **Tool Results Table**: Caches SEO analysis results for performance
- **User Sessions Table**: Manages JWT token sessions and expiration

### SEO Analysis Engine
- **Advanced Keyword Scraper**: Multi-source real-time scraping with Puppeteer stealth techniques, robots.txt compliance, and intelligent caching
- **Website Authority Analyzer**: Comprehensive DA/PA calculation using backlink estimation, WHOIS data, page speed measurement, technical SEO analysis, and metadata scoring
- **SEO Analyzer Service**: Enhanced keyword relevance scoring with balanced distribution and commercial intent detection
- **Meta Tag Extraction**: Parses HTML to extract title, description, Open Graph, and other meta tags
- **Keyword Density Analysis**: Calculates keyword frequency and density percentages
- **Content Quality Assessment**: Analyzes heading structure, image alt text, internal/external links, and content length

### Authentication & Security
- **Firebase Integration**: Google OAuth authentication with Firebase SDK
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Session Management**: Database-backed session tracking for token validation
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Multi-Provider Auth**: Support for Google OAuth and traditional email/password authentication
- **Middleware Protection**: Route-level authentication middleware for protected endpoints

### Development Architecture
- **Monorepo Structure**: Shared schema definitions between client and server
- **Hot Module Replacement**: Vite development server with automatic reloading
- **Type Safety**: End-to-end TypeScript with shared types and validation schemas
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe CSS class composition

### Backend Services
- **Cheerio**: Server-side jQuery-like HTML parsing
- **Axios**: HTTP client for web scraping requests
- **JWT**: Token-based authentication

### Development Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Fast JavaScript bundler for server builds
- **TypeScript**: Static type checking across the application