````markdown
# 🚀 Blogging Platform API

A robust and scalable **Backend API** for a modern blogging platform, built with **Node.js, Express.js, and TypeScript**. It follows a clean, layered architecture (Controller, Service, Repository) for maintainability and separation of concerns.

---

## ✨ Features

- **Clean Architecture**: Clear separation between data access, business logic, and routing layers
- **TypeScript**: Full type safety and enhanced developer experience
- **Modular Design**: Domain-driven structure with organized modules
- **MongoDB Integration**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **Validation**: Comprehensive request validation
- **Error Handling**: Centralized error handling middleware
- **Testing**: Jest test suite with setup/teardown

---

## 🛠️ Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (Local or Cloud instance)

---

## ⚙️ Setup and Installation

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd blogging-platform-api
```
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/bloggingdb
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Run the Application

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm start
```

**Testing:**

```bash
npm test
```

The API will be available at `http://localhost:3000`

---

---

## 🧭 API Endpoints

### Authentication

| Method | Path                 | Description       |
| ------ | -------------------- | ----------------- |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login`    | User login        |

### Posts

| Method   | Path             | Description       |
| -------- | ---------------- | ----------------- |
| `GET`    | `/api/posts`     | Get all posts     |
| `POST`   | `/api/posts`     | Create a new post |
| `GET`    | `/api/posts/:id` | Get post by ID    |
| `PUT`    | `/api/posts/:id` | Update a post     |
| `DELETE` | `/api/posts/:id` | Delete a post     |

### Categories

| Method   | Path                  | Description        |
| -------- | --------------------- | ------------------ |
| `GET`    | `/api/categories`     | Get all categories |
| `POST`   | `/api/categories`     | Create a category  |
| `PUT`    | `/api/categories/:id` | Update a category  |
| `DELETE` | `/api/categories/:id` | Delete a category  |

### Comments

| Method   | Path                          | Description       |
| -------- | ----------------------------- | ----------------- |
| `GET`    | `/api/posts/:postId/comments` | Get post comments |
| `POST`   | `/api/posts/:postId/comments` | Add a comment     |
| `PUT`    | `/api/comments/:id`           | Update a comment  |
| `DELETE` | `/api/comments/:id`           | Delete a comment  |

---

## 🔧 Development Scripts

```json
{
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

---

## 🛡️ Error Handling

The API implements centralized error handling with custom `ApiError` class and error middleware for consistent error responses across all endpoints.

---

## 🧪 Testing

The project includes comprehensive test suites using Jest:

- Unit tests for services and controllers
- Integration tests for API endpoints
- Database connection tests
- Global setup and teardown for test environment

Run tests with:

```bash
npm test
```

Project URL:https://roadmap.sh/projects/blogging-platform-api
