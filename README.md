# 🚀 QuizNova - Full-Stack Quiz Management Platform

QuizNova is a comprehensive, scalable, and interactive quiz management application built with a modern tech stack. It provides robust tools for administrators to manage educational content and an engaging, seamless experience for users to take quizzes and track their progress. 

This project demonstrates proficiency in full-stack development, including secure authentication, complex state management, RESTful API design, and responsive user interfaces.

---

## ✨ Key Features

### 👨‍💼 Administrator Portal
- **Comprehensive Dashboard:** Overview of system statistics, total users, subjects, and quizzes.
- **Content Management System (CRUD):** 
  - Manage **Subjects** (e.g., Programming, Mathematics).
  - Manage **Quiz Topics** under specific subjects (e.g., React Basics, Algebra).
  - Create, Edit, and Delete **Questions** with multiple-choice options.
- **User Management:** View registered users and their activities.

### 🎓 User Portal
- **Intuitive Dashboard:** Browse available subjects and explore quiz topics.
- **Interactive Quiz Interface:** Engaging quiz-taking experience with real-time feedback.
- **Result Analysis:** Detailed breakdown of performance after each quiz attempt.
- **Quiz History:** Track past quiz attempts, scores, and performance over time.
- **Profile Management:** Manage user details and settings.
- **PDF Generation:** Download quiz results/certificates (powered by OpenPDF).

### 🔒 Security & Architecture
- **Role-Based Access Control (RBAC):** Distinct roles for `ADMIN` and `USER` ensuring secure routing and data access.
- **JWT Authentication:** Stateless and secure authentication using JSON Web Tokens.
- **Responsive Design:** Fully responsive UI built with Tailwind CSS, ensuring a great experience on desktop and mobile.
- **Smooth Animations:** Integrated with Framer Motion for premium micro-interactions.

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **Framework:** React.js (v19) via Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend (Server-Side)
- **Language:** Java 17
- **Framework:** Spring Boot 3.2
- **Security:** Spring Security + JWT (io.jsonwebtoken)
- **Database Access:** Spring Data JPA (Hibernate)
- **Database:** MySQL / PostgreSQL
- **Utilities:** Lombok, OpenPDF (for PDF generation)

---

## 📂 Project Structure

```text
QuizNova/
├── backend/                  # Spring Boot Application
│   ├── src/main/java/com/quiznova/
│   │   ├── config/           # Application & Security configurations
│   │   ├── controller/       # REST API Endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA Entities (User, Subject, Question, etc.)
│   │   ├── exception/        # Global Exception Handling
│   │   ├── repository/       # Data Access Layer interfaces
│   │   ├── security/         # JWT Filters and Auth Logic
│   │   └── service/          # Business Logic
│   └── pom.xml               # Maven dependencies
│
└── frontend/                 # React Vite Application
    ├── src/
    │   ├── assets/           # Static assets (images, logos)
    │   ├── components/       # Reusable UI components (Buttons, Modals, Cards)
    │   ├── context/          # React Context (Auth context, Theme context)
    │   ├── layouts/          # Page layouts (Navbar, Sidebar wrappers)
    │   ├── pages/            # Application views (Admin, User, Auth, Public)
    │   ├── routes/           # App routing logic and Protected Routes
    │   └── services/         # Axios API calls
    ├── tailwind.config.js    # Tailwind configuration
    └── package.json          # Node dependencies
```

---

## 🚀 Installation and Setup

Follow these steps to run the project locally.

### Prerequisites
- **Node.js** (v18+) and npm/yarn
- **Java 17** Development Kit (JDK)
- **Maven**
- **MySQL / PostgreSQL** database instance

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database connection:
   Update the `src/main/resources/application.properties` (or `.yml`) file with your database credentials.
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/quiznova
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will typically run on `http://localhost:8080`.*

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically run on `http://localhost:5173`.*

---

## 💡 What Makes This Project Interview-Ready?

When discussing this project in an interview, highlight the following engineering decisions:
- **Separation of Concerns:** Clean architecture on the backend (Controller -> Service -> Repository) and component-driven design on the frontend.
- **Secure Authentication Flow:** Discuss how JWTs are created, stored, and attached to outgoing Axios requests via interceptors.
- **Scalability:** The use of DTOs prevents over-fetching and tight coupling between database entities and API responses.
- **Modern UI/UX:** Mention the use of Tailwind for rapid, consistent styling and Framer Motion for improving user retention through fluid animations.
- **Global Error Handling:** Explain how `@ControllerAdvice` in Spring Boot or Axios interceptors in React catch and gracefully handle errors.

---

> **Developed by [Your Name]** - Open to feedback and contributions!
