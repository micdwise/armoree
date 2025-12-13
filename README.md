# Armoree

**Armoree** is a comprehensive inventory management system designed for firearm enthusiasts and professionals. It allows users to track their firearm collection, ammunition inventory, maintenance logs, and personnel assignments with precision and ease.

## Features

- **Firearm Inventory**: Track details like manufacturer, model, serial number, and location.
- **Ammunition Management**: Monitor ammo stock, lot numbers, and usage.
- **Maintenance Logs**: Keep a history of cleaning, repairs, and inspections.
- **Personnel & Assignments**: Manage users and assign equipment (if applicable).
- **Data Visualization**: View inventory statistics and trends with integrated charts.

## Tech Stack

- **Frontend**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Victory](https://formidable.com/open-source/victory/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 18+ recommended)
- A [Supabase](https://supabase.com/) account and project

## Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd armoree
    ```

2.  **Install Client Dependencies:**

    Navigate to the `client` directory and install the necessary packages.

    ```bash
    cd client
    npm install
    ```

3.  **Environment Configuration:**

    Create a `.env` file in the `client` directory based on the `.env.sample` (if available) or simply add your Supabase credentials.

    ```bash
    touch .env
    ```

    Add the following variables to `.env`:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup:**

    You need to set up the database schema in your Supabase project. SQL scripts are located in the `database` directory.

    - Open your Supabase Dashboard -> SQL Editor.
    - Run the contents of `database/database-supabase.sql` to create tables and relationships.
    - (Optional) Run `database/seed-data.sql` if you want initial test data.

5.  **Run the Application:**

    Start the development server:

    ```bash
    npm run dev
    ```

    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the app.

## Project Structure

- **`client/`**: The frontend application source code.
  - **`src/`**: React components, pages, and logic.
  - **`public/`**: Static assets.
- **`database/`**: SQL scripts for database initialization and seeding.

## Scripts

Inside the `client` folder, you can run:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.

## License

[Add License Information Here]
