# Yada Yada - Full Stack Note & Checklist Manager

A modern, full-stack web application for managing notes and checklists with a clean, scalable architecture. Built with FastAPI for the backend and a modern frontend framework for seamless user experience.

## 🎯 Project Overview

Yada Yada is a feature-rich note-taking and checklist management application designed to help users organize their thoughts, tasks, and goals efficiently. The project demonstrates best practices in full-stack development with clear separation of concerns, async-first architecture, and comprehensive documentation.

## 📋 Features

### Core Features
- ✍️ **Note Management** - Create, read, update, and delete notes with rich content
- ✅ **Checklists** - Organize tasks into checklists for better task management
- 🎯 **Checklist Items** - Track individual tasks with completion status
- 🔄 **Real-time Updates** - Instant UI updates across components
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

### Developer Experience
- 🚀 **Modern Stack** - FastAPI + [Frontend Framework]
- 📚 **Auto-Generated Docs** - Interactive API documentation via Scalar
- 🔒 **Type Safety** - Full type hints across backend and frontend
- 🏗️ **Layered Architecture** - Clean separation of concerns
- ⚡ **Async-First** - Non-blocking operations throughout the stack
- 🧪 **Production Ready** - Comprehensive error handling and logging

## 🏗️ Project Structure

```
yada-yada/
├── backend/
│   └── app/
│       ├── api/                 # API routes and schemas
│       │   ├── router/         # Endpoint definitions
│       │   │   ├── checklists.py
│       │   │   ├── notes.py
│       │   │   └── checklist_items.py
│       │   └── schemas/        # Pydantic models
│       ├── models/             # Database models (SQLModel)
│       ├── services/           # Business logic layer
│       ├── data/               # Data access layer
│       ├── main.py             # FastAPI application
│       ├── config.py           # Configuration management
│       ├── exceptions.py       # Custom exceptions
│       ├── pyproject.toml      # Backend dependencies
│       └── README.md           # Backend documentation
├── frontend/                    # Frontend application (TBD)
│   └── ...
└── README.md                    # This file

```

## 🚀 Quick Start

### Prerequisites

- **Python 3.14+** - For the backend
- **PostgreSQL 12+** - Database
- **Node.js 18+** - For frontend (when available)
- **UV** - Python package manager (recommended)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend/app
   ```

2. **Install dependencies**
   ```bash
   uv sync
   # or with pip:
   # pip install -e .
   ```

3. **Configure environment variables**
   Create a `.env` file in `backend/app/`:
   ```env
   POSTGRES_SERVER=localhost
   POSTGRES_USER=yada_user
   POSTGRES_PASSWORD=secure_password
   POSTGRES_DB=yada_yada_db
   POSTGRES_PORT=5432
   ```

4. **Run the backend server**
   ```bash
   cd backend/app
   fastapi run main.py
   ```
   
   Backend API available at: `http://localhost:8000`
   API Documentation: `http://localhost:8000/scalar`

### Frontend Setup

Frontend setup instructions coming soon...

## 📡 API Documentation

### Backend API

The backend provides a comprehensive RESTful API with three main resource groups:

#### **Notes Endpoints**
- `GET /notes` - Retrieve all notes
- `GET /notes/{id}` - Get a specific note
- `POST /notes/create/` - Create a new note
- `PATCH /notes/{id}` - Update a note
- `DELETE /notes/{id}` - Delete a note

#### **Checklists Endpoints**
- `GET /checklists` - Retrieve all checklists
- `GET /checklists/{id}` - Get a specific checklist
- `POST /checklists/create` - Create a new checklist
- `PATCH /checklists/{id}` - Update a checklist
- `DELETE /checklists/{id}` - Delete a checklist

#### **Checklist Items Endpoints**
- `GET /checklist_items/{checklist_id}` - Get items in a checklist
- `POST /checklist_items/{checklist_id}/create` - Add a new item
- `PATCH /checklist_items/{checklist_item_id}` - Update an item
- `DELETE /checklist_items/{checklist_item_id}` - Delete an item

For detailed API information, see [Backend README](./backend/app/README.md)

## 🗄️ Database Schema

### Notes Table
```sql
id: INTEGER PRIMARY KEY
title: VARCHAR
content: TEXT
```

### Checklists Table
```sql
id: INTEGER PRIMARY KEY
title: VARCHAR
```

### Checklist Items Table
```sql
id: INTEGER PRIMARY KEY
title: VARCHAR
is_done: BOOLEAN (default: false)
checklist_id: INTEGER FOREIGN KEY → Checklists(id)
```

## 🏛️ Architecture

### Backend Architecture

The backend follows a **layered architecture** pattern:

```
┌─────────────────────────┐
│   API Layer             │  ← HTTP requests/responses
│  (routes, status codes) │
├─────────────────────────┤
│   Schema Layer          │  ← Request/response validation
│   (Pydantic models)     │
├─────────────────────────┤
│   Service Layer         │  ← Business logic
│   (business rules)      │
├─────────────────────────┤
│   Data Layer            │  ← Database access
│   (queries, sessions)   │
├─────────────────────────┤
│   Model Layer           │  ← Database schema
│   (SQLModel)            │
├─────────────────────────┤
│   PostgreSQL            │  ← Data persistence
└─────────────────────────┘
```

### Key Design Patterns

- **Dependency Injection** - Services injected via FastAPI dependencies
- **Async/Await** - Non-blocking database operations
- **Type Safety** - Comprehensive type hints with Pydantic
- **Exception Handling** - Custom exceptions with meaningful error messages
- **Configuration Management** - Environment-based settings

## 🔧 Tech Stack

### Backend
- **Framework**: FastAPI 0.141.1+
- **ORM**: SQLModel 0.0.39 (SQLAlchemy + Pydantic)
- **Database**: PostgreSQL with asyncpg
- **Validation**: Pydantic 2.13.4+
- **API Docs**: Scalar FastAPI 1.8.2+
- **Python**: 3.14+

### Frontend (TBD)
- Framework: [To be decided]
- Build Tool: [To be decided]
- State Management: [To be decided]

### DevOps & Tools
- **Package Manager**: UV
- **Version Control**: Git
- **Database**: PostgreSQL

## 📚 Documentation

- [Backend Documentation](./backend/app/README.md) - Complete backend API and setup guide
- [API Interactive Docs](http://localhost:8000/scalar) - Scalar UI documentation (when server running)

## 🧪 Testing

Testing framework coming soon...

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Code follows the existing style and patterns
- All endpoints have descriptive docstrings
- Error cases are properly handled with meaningful messages
- Database changes maintain backward compatibility
- New features include appropriate tests

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "feat: description"`
3. Push to your branch: `git push origin feature/your-feature`
4. Open a Pull Request with a clear description

## 📝 Git Workflow

The project uses conventional commits for clear commit history:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation updates
- `style:` - Code style changes
- `test:` - Test additions/updates
- `chore:` - Build, dependencies, etc.

## 🚨 Error Handling

The application includes comprehensive error handling:

- **404 Not Found** - Resource doesn't exist
- **400 Bad Request** - Invalid request data
- **500 Internal Server Error** - Unexpected server errors
- **Database Errors** - Meaningful error messages for DB operations

## 📦 Deployment

Deployment instructions coming soon...

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support & Issues

For bugs, feature requests, or questions:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs

## 👥 Authors

- Developed as a full-stack learning project

## 🗺️ Roadmap

- [ ] Frontend implementation
- [ ] User authentication & authorization
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native)
- [ ] Search and filtering
- [ ] Tags and categories
- [ ] Sharing and collaboration
- [ ] Cloud backup & sync
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Performance optimization
- [ ] Analytics dashboard

## 📞 Questions?

Refer to the [Backend README](./backend/app/README.md) for backend-specific questions or check the interactive API documentation when the server is running.

---

**Last Updated**: August 2026  
**Project Status**: Active Development
