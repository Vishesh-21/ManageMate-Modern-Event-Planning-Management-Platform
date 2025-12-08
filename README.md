<div align="center">
  <img src="./public/manage-mate-logo.png" alt="Manage-Mate Logo" width="200"/>
  <h1>Manage-Mate</h1>
  <p>A modern, full-stack event management and ticketing platform built with a cutting-edge tech stack.</p>
</div>

---

**Manage-Mate** is a comprehensive solution for creating, discovering, and managing events. From local meetups to large-scale conferences, users can seamlessly register for events, while organizers have a powerful dashboard to track attendance, view statistics, and manage their listings.

## ✨ Key Features

- **Event Discovery:** Explore a rich variety of events, filterable by category and location.
- **Seamless Registration:** Users can sign up for events with a single click.
- **Personalized "My Tickets" Page:** A dedicated space for users to view all their upcoming events.
- **Effortless Event Creation:** A multi-step form allows organizers to create detailed event pages, including Unsplash image integration for beautiful headers.
- **Organizer's Dashboard:** A powerful hub to manage created events, view key statistics, and see a list of attendees.
- **QR Code Check-in:** Each event comes with a unique QR code system. Organizers can scan attendee tickets for smooth and efficient check-ins.
- **User Authentication:** Secure and simple user sign-up and sign-in provided by Clerk.

## 🚀 Tech Stack & Architecture

Manage-Mate is built on a modern, decoupled architecture, ensuring a scalable and maintainable codebase.

- **Frontend:** **Next.js (App Router)** - For a fast, server-rendered React application.
- **Backend & Database:** **Convex** - Provides the real-time database, serverless functions (queries and mutations), and scheduled jobs. All backend logic is co-located in the `convex/` directory.
- **Authentication:** **Clerk** - Handles user management, sign-in/sign-up flows, and integration between the frontend and backend.
- **UI/UX:**
    - **shadcn/ui:** A collection of beautifully designed, accessible, and composable components.
    - **Tailwind CSS:** For utility-first styling.
    - **Framer Motion:** For smooth animations and transitions.
- **Form Management:** **React Hook Form** & **Zod** - For robust and type-safe form validation.

### Architecture Overview

- **`src/app`**: Contains the Next.js frontend, structured using the App Router.
  - **`(public)`**: Routes accessible to all users (e.g., `/explore`, `/events/[slug]`).
  - **`(main)`**: Authenticated routes for logged-in users (e.g., `/create-event`, `/my-events`).
  - **`(auth)`**: Authentication routes managed by Clerk.
- **`convex/`**: The heart of the backend.
  - **`schema.js`**: Defines the data model for the application.
  - **`*.js` files**: Contain all backend logic, including queries to fetch data and mutations to create or update data.
- **`src/components/`**: Shared React components used across the application, including a library of UI primitives built with `shadcn/ui`.

## 🏁 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- pnpm (or your preferred package manager)
- A Convex account ([Sign up here](https://www.convex.dev/))
- A Clerk account ([Sign up here](https://clerk.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/manage-mate.git
cd manage-mate
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables. You can get these from your Convex and Clerk project dashboards.

```env
# Convex
CONVEX_URL="<your_convex_project_url>"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<your_clerk_publishable_key>"
CLERK_SECRET_KEY="<your_clerk_secret_key>"

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Run the Development Servers

You need to run two processes in separate terminals:

1.  **Run the Convex development server:** This syncs your backend functions and schema with the Convex cloud.

    ```bash
    npx convex dev
    ```

2.  **Run the Next.js frontend server:**

    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action!

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.