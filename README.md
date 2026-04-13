# 🔗 Project Links

### Product Link

https://main.d6wp2xgt6t4gv.amplifyapp.com

---

# ⚙️ Dev

### Clone the repository & install dependencies

```bash
git clone https://github.com/minsukyou/Amazon_Shopbop_Capstone.git
cd Amazon_Shopbop_Capstone
npm install
```

### Create a `.env` file in the project root and add the following:

```
VITE_LOGIN_URL= AWS gateway/lambda goes here
VITE_VOTE_URL= AWS gateway/lambda goes here
VITE_T1_API= AWS gateway/lambda goes here
VITE_T2_API= AWS gateway/lambda goes here
VITE_S_API= AWS gateway/lambda goes here
VITE_S2_API= AWS gateway/lambda goes here
```

### Run in development mode

```bash
npm run dev
```

---

# 🔍 Overview of How the Code Works

## 1. Main Entry Point

### App.tsx (+ main.tsx)

- Based on React Router navigation.
- Loads the shared Header component.
- Manages:
  - Login persistence (via localStorage)
  - Backend session validation (/isLoggedIn)
  - Automatic login modal triggering

---

## 2. Global State (Context)

### AuthContext

- Current username
- Login status
- Setters for updating both

### ItemsContext

- Stores items selected across ranking trials
- Supports session summary and guest storage logic

### CategoriesContext

- Stores a string array of selectable categories.

---

## 3. Components (UI + Helpers)

### Header.tsx

- Displays navigation bar
- Handles login/logout
- Shows username
- Opens login modal
- Controls mobile hamburger menu (unfinished)
- Clears temporary items when navigating

### LoginModal.tsx

- Handles login submission
- Updates global auth state
- Uploads guest session data on login

### PostGuestSession.tsx

- Reads guest vote history from sessionStorage
- Rewrites sessions with the authenticated username
- Sends them to backend one by one
- Clears local guest storage

### PriceSlider.tsx

- Reusable price slider component for filtering leaderboard results

---

## 4. Pages (Route-Level Logic)

### LandingPage

- Fullscreen hero landing page introducing StyleSync
- Buttons to begin ranking or learn more

### CategorySelectionPage

- Shows list of categories with images and descriptions
- Navigates to `/pair-rank/:category`

### PairRankingPage

- Fetches 16 random items for the selected category
- Displays 8 pairwise comparisons
- Tracks:
  - Winner & loser relations
  - Undo history
  - Skip logic
  - Selection order
- Submits final results to backend
- Stores data in:
  - sessionStorage (guest)
  - API database (logged-in users)
- Redirects to Session Summary

### SessionSummaryPage

- Displays all selected items
- Provides image preview modal
- Prompts guest to log in after 3 seconds
- On login, migrates guest data using PostGuestSession
- Provides navigation options:
  - Viewing past rankings
  - Starting new sessions
  - Returning home

### GlobalLeaderboardPage

- Shows globally trending fashion items
- Fetches ranking list → fetches product metadata
- Displays top 3 podium + grid of others
- Category selector tabs
- Price slider filtering
- Modal shows:
  - Item details
  - Similar item recommendations

### PastRankingsPage

- Logged-in users only
- Fetches complete ranking history
- Provides filters for:
  - Category
  - Brand
  - Price range
  - Most/Least recent
  - Sorting
- Summary statistics

### LearnMorePage

Explains:

- What StyleSync does
- Mission, values, vision
- How the ranking flow works

---

## 5. Global Styling — index.css

- Imports Tailwind
- Defines global fonts
- Implements animations (fadeIn, fadeOut)
- Styles custom slider UI

---

# 😄 What works & 😢 what doesn’t

What works:
All core features function correctly, and the code includes solid error handling.

What doesn’t:
The UI is not fully responsive and struggles on different screen sizes, especially small mobile devices.
Without our AWS lambdas/gateway routes/DB, the application will no longer work. So in the future if we stop providing access to any one of those things, the application will no longer work.

# ❓What would you work on next

- Create an onboarding quiz to identify the user’s style
- Build user-based product recommendations
- Add more filters (Occasion, Fabric, Fit, etc.)
- Improve responsive design for all device sizes, including mobile
