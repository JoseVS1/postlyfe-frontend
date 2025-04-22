# Postlyfe (Social Media App) - Frontend

The frontend user interface for the Postlyfe social media application, built with React.

## Overview

Postlyfe Frontend is a single-page application (SPA) built using React and Vite. It provides the user interface for interacting with the Postlyfe social media platform. Users can sign up, log in, create posts, view feeds, comment, like, follow users, and manage their profiles. It communicates with the Postlyfe Backend API to fetch and manipulate data.

## Features

-   **User Authentication UI:** Forms for user signup and login.
-   **Home Feed:** Displays a feed of posts from users.
-   **Post Creation:** Allows authenticated users to create new posts.
-   **Post Interaction:** View posts, like/unlike posts, view comments.
-   **Commenting System:** Add comments to posts, view nested replies, edit/delete own comments.
-   **User Profiles:** View user profiles, including their posts and basic information.
-   **Profile Editing:** Allows users to edit their own profile details.
-   **User Discovery:** View a list of all users, manage follow requests (send, accept, reject, unfollow).
-   **Navigation:** Persistent navigation bar for easy access to different sections.
-   **Protected Routes:** Restricts access to certain pages based on authentication status.
-   **Responsive Design:** Basic responsiveness for different screen sizes (as per `index.css`).

## Technology Stack

-   **Framework/Library:** React
-   **Build Tool:** Vite
-   **Routing:** React Router
-   **State Management:** React Context API
-   **Styling:** CSS (potentially with CSS Modules if refactored, currently global `index.css`)
-   **HTTP Client:** Fetch API
-   **Linting:** ESLint
-   **Icons:** Font Awesome

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/postlyfe-frontend.git
    cd postlyfe-frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory with the following variable, pointing to your running backend server:

    ```env
    VITE_API_BASE_URL=http://localhost:3000
    ```

4.  Start the development server:

    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Project Structure

```
└── ./
├── src
│ ├── components
│ │ ├── pages
│ │ │ ├── HomePage.jsx
│ │ │ ├── LoginPage.jsx
│ │ │ ├── PostPage.jsx
│ │ │ ├── ProfilePage.jsx
│ │ │ ├── SignupPage.jsx
│ │ │ └── UsersPage.jsx
│ │ ├── Comment.jsx
│ │ ├── CommentForm.jsx
│ │ ├── Comments.jsx
│ │ ├── EditPostForm.jsx
│ │ ├── EditProfileForm.jsx
│ │ ├── ErrorHandler.jsx
│ │ ├── Errors.jsx
│ │ ├── Navbar.jsx
│ │ ├── Post.jsx
│ │ ├── PostForm.jsx
│ │ ├── Profile.jsx
│ │ ├── ProtectedRoute.jsx
│ │ └── UserCard.jsx
│ ├── context
│ │ └── UserContext.js
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── eslint.config.js
├── index.html
└── vite.config.js
```

## Usage

### Authentication

1.  Navigate to the `/signup` page to create a new account.
2.  Navigate to the `/login` page to log in with existing credentials.
3.  Once logged in, you will be redirected to the home page.

### Core Features

-   **Home Feed (`/`):** View posts, create new posts using the form.
-   **View Post (`/posts/:id`):** Click on a post to view its details and comments. Add comments using the form. Reply to existing comments.
-   **Like/Unlike:** Click the heart icon on a post to like or unlike it.
-   **View Profile (`/users/:id`):** Click on a username or profile picture to view a user's profile page.
-   **Edit Profile:** If viewing your own profile, click "Edit Profile" to modify details.
-   **View Users (`/users`):** See a list of other users. Send follow requests, or accept/reject incoming requests.

## Components Overview

-   **`App.jsx`:** Root component managing routing and global context.
-   **Pages (`src/components/pages`):** Components representing distinct views/pages (Home, Login, Profile, etc.).
-   **Reusable Components (`src/components`):**
    -   `Navbar.jsx`: Top navigation bar.
    -   `Post.jsx`: Displays a single post item.
    *   `Comment.jsx`: Displays a single comment or reply item.
    -   `UserCard.jsx`: Displays a user summary card with follow actions.
    -   `*Form.jsx`: Various forms for creating/editing data (Posts, Comments, Profile).
    -   `ProtectedRoute.jsx`: Wraps routes that require authentication.
    -   `ErrorHandler.jsx`/`Errors.jsx`: Handle and display errors.
-   **Context (`src/context`):**
    -   `UserContext.js`: Provides global user state and potentially other shared data.

## Security

-   Route access is controlled using the `ProtectedRoute` component, which relies on the authentication status provided by the backend via the `UserContext`.
-   Sensitive operations (creating posts, commenting, liking, following, editing) require API calls that are authenticated on the backend.

## Contributing

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## License

[MIT License](LICENSE)

## Acknowledgements

-   [React](https://reactjs.org/)
-   [React Router](https://reactrouter.com/)
-   [Vite](https://vitejs.dev/)
-   [Font Awesome](https://fontawesome.com/)
