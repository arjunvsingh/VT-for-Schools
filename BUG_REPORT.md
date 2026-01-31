# VT4S Admin Dashboard – Bug Report

**Date:** January 31, 2026  
**Reviewed by:** Antigravity Code Review

---

## 🔴 Critical Bugs (Breaks Functionality)

### 1. Broken JSX Structure in School Page

**File:** [`src/app/school/[id]/page.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/app/school/%5Bid%5D/page.tsx#L106-L176)  
**Severity:** 🔴 Critical – Compilation Error  

A `BentoCard` is nested inside another `BentoCard` without proper closure, causing a TypeScript compilation error.

**Problem:**
- Line 106: `BentoCard` (Faculty Performance) is opened
- Line 141: The inner content div closes
- Line 142-175: A second `BentoCard` (Student Performance) is opened inside the first
- Line 176: The `</section>` tag closes prematurely

**Fix Required:**
```diff
- Line 141: Close the first BentoCard with </BentoCard>
- Line 175: Close the second BentoCard with </BentoCard>
- Line 176: Close the section properly
```

---

### 2. ESLint Configuration Error

**File:** [`eslint.config.mjs`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/eslint.config.mjs)  
**Severity:** 🔴 Critical – Tooling Broken

The ESLint configuration imports from `eslint/config` which is not exported in ESLint 8.x. This prevents linting from running.

**Error:**
```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './config' is not defined
```

**Fix Required:**
- Update to ESLint 9.x with flat config support, OR
- Revert to `.eslintrc.json` format for ESLint 8.x

---

## 🟠 High Priority Bugs (Functionality Impact)

### 3. Missing "Students" Navigation in TopBar

**File:** [`src/components/layout/TopBar.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/components/layout/TopBar.tsx#L22)  
**Impact:** Navigation gap – no way to access "Students" page from nav

**Current nav items:** `['Dashboard', 'Districts', 'Schools', 'Teachers']`

**Fix Required:** Add 'Students' to navigation array with corresponding link.

---

### 4. Unused Import in TeacherTimeline

**File:** [`src/components/teacher/TeacherTimeline.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/components/teacher/TeacherTimeline.tsx#L2)  
**Impact:** Unused code, bundle bloat

```tsx
const { scrollYProgress } = useScroll({ container: containerRef });
// scrollYProgress is never used
```

**Fix Required:** Either use `scrollYProgress` for scroll-based animations or remove the `useScroll` hook.

---

### 5. Hardcoded District Navigation in CaliforniaCubes

**File:** [`src/components/visuals/CaliforniaCubes.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/components/visuals/CaliforniaCubes.tsx#L228-L230)  
**Impact:** All cube clicks navigate to `/district/1` regardless of which district is clicked

```tsx
setTimeout(() => {
    router.push('/district/1'); // Always navigates to district 1
}, 200);
```

**Fix Required:** Calculate the actual district ID from `rowHit` and `colHit` and use dynamic routing.

---

### 6. Hardcoded Back Links on Subpages

**Files:**
- [`src/app/school/[id]/page.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/app/school/%5Bid%5D/page.tsx#L16) – Always links to `/district/1`
- [`src/app/teacher/[id]/page.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/app/teacher/%5Bid%5D/page.tsx#L14) – Always links to `/school/s1`
- [`src/app/student/[id]/page.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/app/student/%5Bid%5D/page.tsx#L11) – Always links to `/school/s1`

**Impact:** Back navigation is broken when coming from different parent pages.

**Fix Required:** Use router state or query params to track parent context.

---

## 🟡 Medium Priority Issues (Code Quality)

### 7. Type Safety: `any` Type in SchoolNode

**File:** [`src/components/district/SchoolNode.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/components/district/SchoolNode.tsx#L8)  
**Impact:** No type checking on node data, could lead to runtime errors

```tsx
export default memo(function SchoolNode({ data }: { data: any }) {
```

**Fix Required:** Define a proper interface for the `data` prop:
```tsx
interface SchoolNodeData {
    id: string;
    label: string;
    students: number;
    performance: number;
    status: 'good' | 'warning' | 'alert';
}
```

---

### 8. Missing Click Handler for SchoolNode Navigation

**File:** [`src/components/district/SchoolNode.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/components/district/SchoolNode.tsx)  
**Impact:** Per GEMINI.md spec, clicking a school node should navigate to the school page, but no click handler exists.

**Fix Required:** Add click handler with router navigation to `/school/${data.id}`.

---

### 9. Duplicate `<h3>` Heading in Components

**Files:**
- `PerformanceHeatmap.tsx` (line 26)
- `ProjectionGraph.tsx` (line 21)

**Impact:** When these components are inside BentoCards (which already have title props), the headings are redundant.

**Fix Required:** Remove internal headings or conditional render based on `showTitle` prop.

---

### 10. CSS Typo in Student Page

**File:** [`src/app/student/[id]/page.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/app/student/%5Bid%5D/page.tsx#L24-L25)  
**Impact:** Invalid CSS class, styling may not apply

```tsx
<span className="px-2 py-0.5 rounded textxs bg-acid-lime/10 ...">
// Should be "text-xs" not "textxs"
```

---

### 11. Missing Accessibility Labels

**Files:**
- `TopBar.tsx` – Search and Bell buttons lack `aria-label`
- `CaliforniaCubes.tsx` – Interactive cubes lack keyboard navigation
- `DistrictMap.tsx` – React Flow controls need ARIA descriptions

**Fix Required:** Add appropriate `aria-label` attributes to all interactive elements.

---

## 🔵 Low Priority (Enhancements/Cleanup)

### 12. Duplicate `:root` Declaration in globals.css

**File:** [`src/app/globals.css`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/app/globals.css#L15)  
**Impact:** Two `:root` blocks exist (lines 15-27 and lines 222-228), which is valid but confusing.

**Recommendation:** Merge CSS custom properties into a single `:root` block.

---

### 13. Missing Mobile Menu Toggle in TopBar

**File:** `src/components/layout/TopBar.tsx`  
**Impact:** Mobile nav is hidden (`hidden md:flex`) but no hamburger menu is implemented.

The `Menu` icon is imported but never used:
```tsx
import { Search, Bell, Menu } from 'lucide-react';
// Menu is never rendered
```

---

### 14. gridSize Prop Ignored in CaliforniaCubes

**File:** [`src/components/visuals/CaliforniaCubes.tsx`](file:///Users/arjunsingh/Desktop/Projects/VT4SAdminDashboards/V1/src/components/visuals/CaliforniaCubes.tsx#L11)  
**Impact:** The `gridSize` prop in the interface is documented as "Ignored if using shape" but is passed from `page.tsx` with value `20`.

**Recommendation:** Remove unused prop or document its behavior.

---

### 15. Missing Loading/Error States

**Files:** All page components

**Impact:** No skeleton loaders or error boundaries for async scenarios.

**Recommendation:** Add `<Suspense>` boundaries and error handling per coding practices #7.

---

## Summary

| Severity | Count | Action Needed |
|----------|-------|---------------|
| 🔴 Critical | 2 | Immediate fix required |
| 🟠 High | 4 | Fix before deployment |
| 🟡 Medium | 5 | Should fix soon |
| 🔵 Low | 4 | Nice to have |

---

## Quick Fix Priority Order

1. **Fix School Page JSX** (`school/[id]/page.tsx`) – Unblocks TypeScript compilation
2. **Fix ESLint Config** – Restores linting capabilities
3. **Add Students to TopBar nav**
4. **Fix hardcoded navigation links**
5. **Add proper types to SchoolNode**
