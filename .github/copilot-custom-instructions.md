# Escaleta.ai - Project Instructions & Context

You are an expert Tech Lead assisting in the development of "Escaleta.ai", a radio news management dashboard.

## 1. Project Context & Domain
**Goal:** Build a Real-Time Dashboard for a Radio Editor to manage news proposals sent by journalists via WhatsApp.

**Workflow:**
1.  **Ingest:** Journalists send text proposals via WhatsApp. An external service (n8n) processes these messages using AI to extract structured data (Title, Body, Topic) and inserts them into Supabase.
2.  **Triage:** The Editor sees incoming proposals in real-time. They can **Accept** or **Reject** them.
3.  **Rundown (Escaleta):** Accepted news are moved to the "Escaleta" (Rundown) view.
4.  **Ordering:** The Editor organizes the news order using Drag & Drop (`dnd-kit`) to fit the news hour schedule.
5.  **Export:** The final ordered list is exported to a Word document (`.docx`) for the locutors.

**Key Terminology (Use these variable names):**
-   `proposal`: A raw news submission from a journalist.
-   `rundown` / `escaleta`: The ordered list of approved news.
-   `status`: Can be `'pending'`, `'approved'`, `'rejected'`.
-   `journalist`: The source of the news (identified by phone number).

## 2. Tech Stack & Constraints

-   **Runtime:** Bun (Always use `bun install`, `bun run dev`).
-   **Framework:** Next.js 14+ (App Router).
-   **Language:** TypeScript (Strict Mode).
-   **Styling:** Tailwind CSS + `shadcn/ui` components.
-   **Icons:** Lucide React.
-   **Database & Auth:** Supabase (PostgreSQL).
-   **State Management:** Zustand (See specific pattern below).
-   **Date Handling:** `date-fns` (Use Spanish locale).
-   **Drag & Drop:** `@dnd-kit/core` + `@dnd-kit/sortable`.
-   **Export:** `docx` library.

## 3. Architecture & Coding Rules

### State Management (Zustand + Next.js App Router)
To avoid state pollution between requests in SSR:
-   **NEVER** create a global singleton store (`export const useStore = create(...)`).
-   **ALWAYS** use the Store Provider pattern:
    1.  Create a `createNewsStore` factory function.
    2.  Initialize the store in a `NewsStoreProvider` (Client Component).
    3.  Consume via a custom hook that accesses the context.

### Data Fetching & Mutations
-   **Fetching:** Use **Server Components** for initial data fetching directly from Supabase. Pass this data as initial props to the Zustand Store Provider.
-   **Realtime:** Use `supabase.channel` inside a `useEffect` in the Client Provider to listen for `INSERT` or `UPDATE` on the `news` table.
-   **Mutations:** Use **Server Actions** (`actions.ts`) for all DB operations (update status, reorder items). Call these actions from the UI components.

### Date Formatting
-   Always format dates for the user in Spanish.
-   Example: `format(new Date(), "EEEE d 'de' MMMM", { locale: es })`.

## 4. Database Schema (Context)
Assume the Supabase table `news` has the following structure. Use these exact field names:
-   `id` (uuid, primary key)
-   `created_at` (timestamptz)
-   `content` (text) - The body of the news.
-   `title` (text) - Extracted headline.
-   `status` (text) - Default: 'pending'.
-   `priority` (int) - For sorting order in the Escaleta.
-   `journalist_phone` (text) - References the sender.
-   `estimated_duration` (text) - e.g., "30s".

## 5. UI Guidelines
-   Design for high data density (Dashboard style).
-   Use a "Kanban" or "List" layout: Incoming (Left) -> Escaleta (Right).
-   Provide immediate visual feedback for Drag & Drop actions.
