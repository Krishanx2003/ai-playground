# AI Playground - Frontend Prototype

A comprehensive frontend-only prototype that combines the best features from leading AI interfaces into one polished application. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

![AI Playground Screenshot]

![alt text](<Screenshot (7)-1.png>)

## Research

**Leading AI UIs Analyzed:**
- **OpenAI Playground**: Clean parameter sliders, model selection dropdown, and real-time response streaming with excellent UX polish
- **Anthropic Claude**: Conversational interface with message persistence, elegant typography, and intuitive chat bubbles  
- **Hugging Face Spaces**: Template system for quick-start prompts, community-driven examples, and diverse model categories
- **Microsoft Copilot Lab**: Advanced parameter controls, export functionality, and professional enterprise-grade interface
- **Google AI Studio**: Multi-modal capabilities, structured input fields, and comprehensive model documentation

**Chosen Features (8 core features):**
1. **Advanced Model Selector** - Dropdown with provider categories, descriptions, and token limits (inspired by OpenAI + HF)
2. **Template-Powered Prompt Editor** - Load/save system with categorized templates (inspired by HF Spaces)
3. **Comprehensive Parameters Panel** - 6 key sliders with tooltips and real-time validation (inspired by OpenAI + Copilot)
4. **Interactive Chat Output** - Message bubbles with copy/export and streaming simulation (inspired by Claude)
5. **Persistent Theme System** - Light/dark mode with smooth transitions and localStorage (modern UX standard)
6. **Responsive Layout** - Mobile-first design with adaptive sidebars (accessibility best practice)
7. **Error/Loading States** - Professional loading skeletons and error handling (enterprise polish)
8. **Export & Accessibility** - JSON export, ARIA labels, keyboard navigation (inspired by Copilot Lab)

## Design

### Mockup
The interface features a three-panel layout:
- **Left Panel (25%)**: Model selector and parameters with collapsible sections
- **Center Panel (45%)**: Prompt editor with template dropdown and action buttons  
- **Right Panel (30%)**: Chat output with message history and export options

### Design System

**Typography:**
- Font: Inter (system font fallback)
- Headings: 600 weight, 120% line-height
- Body: 400 weight, 150% line-height  
- Code: Mono fallback, 140% line-height

**Color System:**
- Primary: `hsl(var(--primary))` - Brand blue (#3B82F6 equivalent)
- Secondary: `hsl(var(--secondary))` - Neutral gray variations
- Accent: `hsl(var(--accent))` - Subtle interaction highlights
- Success/Warning/Error: Semantic color ramps with 6 shades each
- Background: Gradient from `background` to `muted/20` for depth

**Spacing System:**
- Base unit: 8px (0.5rem)
- Component padding: 16px (1rem) standard, 24px (1.5rem) for cards
- Section margins: 32px (2rem) between major sections
- Grid gaps: 32px (2rem) on desktop, 16px (1rem) on mobile

**Components:**
- Border radius: 12px (0.75rem) for cards, 8px (0.5rem) for buttons
- Shadows: Subtle layered shadows with blur and opacity variations
- Borders: `border-border/50` for subtle division lines
- Backdrop blur: Applied to floating elements for modern glass effect

## Development  

### State Management
- **Model State**: Selected model object with provider, limits, and metadata
- **Parameters State**: Object with 6 parameters (temperature, tokens, top-p, top-k, penalties)
- **Messages State**: Array of message objects with role, content, timestamp, status
- **UI State**: Theme preference, loading states, dropdown visibility, error states

### Mock API Design
- **`/api/models`**: Returns 10 popular AI models with realistic metadata
- **`/api/templates`**: Returns 6 curated prompt templates across different categories
- **Simulated latency**: 500-1500ms delays to demonstrate loading states
- **Error simulation**: Random 5% failure rate to showcase error handling

### Theme Implementation
- **Context Provider**: React Context with localStorage persistence
- **System Detection**: Respects `prefers-color-scheme` on first visit  
- **Smooth Transitions**: CSS transitions on theme toggle with Framer Motion
- **SSR Handling**: Prevents hydration mismatch with `suppressHydrationWarning`

### Accessibility Features
- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Tab order, Enter/Space handlers, Escape to close
- **Focus Management**: Visible focus indicators and logical tab flow
- **Screen Reader**: Semantic HTML structure with proper headings
- **Color Contrast**: WCAG AA compliant contrast ratios in both themes

### Known Limitations
- **Frontend Only**: No real AI model integration - responses are simulated
- **No Authentication**: No user accounts or conversation persistence
- **Limited Export**: JSON export only, no PDF or other formats
- **No Real-time**: Simulated streaming, not actual token streaming
- **Static Templates**: Templates are hardcoded, no user-created templates
- **No Model Switching**: Can't switch models mid-conversation

### Tech Stack Details
- **Next.js 13.5**: App Router with TypeScript strict mode
- **Tailwind CSS**: Utility-first with custom CSS variables
- **Framer Motion**: Page transitions and micro-interactions
- **Storybook 7**: Component development and documentation
- **Deployment**: Static export ready for Vercel/Netlify/GitHub Pages

### Performance Optimizations  
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component with optimization disabled for export
- **Bundle Analysis**: Tree-shaking and minimal dependencies
- **CSS Optimization**: Tailwind purging and critical CSS inlining

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run Storybook
npm run storybook
```

## Storybook Components

4 documented components with interactive controls:
- `Button` - UI button variations and sizes
- `ModelSelector` - Model selection dropdown with states  
- `ParametersPanel` - Parameter sliders and controls
- `ChatOutput` - Message display and interaction patterns