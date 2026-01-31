---
trigger: always_on
---

The goal of this project is to create a comprehensive admin dashboard that will help school district admins manage the schools within their district.

It should have the following pages:

1. Main Dashboard page
This page will be the "wow" factor page.The center of this page should be a grid-like map with squares. Each square should represent a school within the district for that admin. Use the cubes.md file to get reference on how the grid should look.
When the user hovers over the cube they should be able to see statistics related to that specific school. Once they click into a cube, the poll page should zoom in to that cube and open a new page which leads to the district page. The home page should also have other tiles which give an overview of how the administrator's zone is doing. Use mock data to represent these tiles. Add animation effects that are stored in the bento.md file. 

2. District Page
This page should be a React Flow canvas which shows a set of schools within that district. Each node should show details about the school, for example, the number of students and how the school is performing, along with the number of teachers. If there are any alerts for the school that require action, it should be highlighted within that node. Once a user clicks into a node, again there should be a zoom in transition which takes them to the school specific page. 


3. School Page
Here the administrator can see all the details related to the school. The number one thing we want to show them at the top is insights and actions. The insights should show what are the immediate things that require exact action. For example if a teacher is not performing well, there can be a sentence describing which teacher is not performing well and why. The action button can say "Request bridge from the teacher". Similarly there can be a graph or a heat map which shows what areas of the school are doing well in which subjects and which areas are not doing well. Lastly we want to give some sort of predictive analytics so that they can see where the school will end up at the end of the year. There should also be a link to the teacher page on the school page itself. Again clicking this link should animate the entire page and zoom in to the teacher page. All the metrics and key insights should use the Bento design language. 


4. Teacher Page
On the teacher page there should be a list of teachers that are performing at the school. Our goal is to give insights to the user immediately so any teachers that require action should be shown right at the top. Once you click into the teacher, you should be able to see a timeline of events and show which teacher has done what at which point in time. Use a scrollable nav to make this happen. The scroll should use Linus scrolling as the library. 

5. Student Page
Similarly the student page should also be clickable from the school page. When the admin clicks on the student page, they should be redirected to a student profile which shows:
- which subject they're enrolled in
- key insights such as what teachers they have been interacting with
- what has been going well and what has not been going well


Tech stack:
  Framework & Runtime
  - Next.js 14.2 - App Router (React framework)
  - React 18 - UI library
  - TypeScript 5 - Type safety

  Styling
  - Tailwind CSS 3.4 - Utility-first CSS
  - PostCSS - CSS processing

  Animation & 3D
  - Framer Motion 12 - Page transitions, hover effects, spring animations
  - Three.js 0.160 + React Three Fiber + Drei - 3D California map on the home page
  - Lenis - Smooth scrolling

Components
- Use https://reactbits.dev/components/ unless already provided in rules folder

  Data Visualization
  - @xyflow/react 12 (React Flow) - District flow diagram with interactive nodes
  - Recharts 3 - Sparkline charts

  State Management
  - Zustand 5 - Lightweight store

  UI
  - Lucide React - Icon library

  Dev Tools
  - ESLint + eslint-config-next - Linting

Use mock data for everything


**coding practices**
1. Ensure that you initialize you git repository and you commit code after each major feature is complete.
  1. Co-locate related code - Keep components, hooks, and types close to where they're used rather than in global folders
  2. Derive state, don't sync it - If a value can be computed from props/state, use useMemo instead of useEffect + setState
  3. Type narrowing over any - Use discriminated unions and type guards instead of casting or any
  4. Components do one thing - If a component handles layout, data fetching, and business logic, split it
  5. Name things by what they do, not what they are - useTeacherPerformance over useData, formatGradeLabel over helper
  6. Avoid premature abstraction - Three similar blocks of JSX are fine; a wrapper component you'll use once is worse
  7. Handle loading and error states explicitly - Don't just handle the happy path
  8. Keep effects minimal - Most useEffect calls can be replaced with event handlers or derived values
  9. Avoid prop drilling past 2 levels - Use composition (children), context, or Zustand
  10. Write the simplest code that works - Clever code is expensive to maintain
  11. Memoize expensive renders - Use React.memo, useMemo, useCallback only when you've measured a performance problem, not preemptively
  12. Keep bundle size in check - Import { BookOpen } from "lucide-react" not import * as Icons. Use dynamic imports for heavy components (Three.js, React Flow)
  13. Don't repeat magic values - If #6C63FF or rounded-[32px] appears 50 times, it belongs in your design tokens (which this project already does in tailwind.config)
  14. Validate at boundaries, trust internally - Validate user input, API responses, URL params. Don't defensively check types between your own functions
  15. Commit small, commit often - One logical change per commit. Easier to review, revert, and bisect
  16. Delete dead code - Don't comment it out "just in case." Git has it if you need it
  17. Consistent file conventions - Pick one pattern (e.g., PascalCase for components, camelCase for utils, kebab-case for directories) and stick to it
  18. Accessibility isn't optional - Semantic HTML, keyboard navigation, ARIA labels on icon-only buttons, sufficient color contrast
  19. Tests cover behavior, not implementation - Test what the user sees and does, not internal state or method calls
  20. Read the error before you fix it - Most debugging time is wasted by guessing instead of reading the actual stack trace
