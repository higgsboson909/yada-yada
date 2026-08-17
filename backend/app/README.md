# Yada Yada API

A modern FastAPI-based backend application for managing notes and checklists with a clean, scalable architecture.

## Overview

Yada Yada API provides a RESTful backend for a note-taking and checklist management system. Built with FastAPI and SQLModel, it offers async/await support, automatic API documentation, and type-safe database operations.

## Features

- 📝 **Notes Management** - Create, read, update, and delete notes with title and content
- ✅ **Checklists** - Organize checklists with multiple items
- 🎯 **Checklist Items** - Track individual checklist items with completion status
- 📚 **Interactive API Documentation** - Scalar API reference and OpenAPI schemas
- 🔒 **Error Handling** - Comprehensive exception handling with custom exceptions
- 🗄️ **Database** - PostgreSQL with async support via SQLAlchemy and asyncpg
- ⚡ **Async-First** - Fully asynchronous request handling

## Tech Stack

- **Framework**: FastAPI 0.141.1+
- **ORM**: SQLModel 0.0.39 (SQLAlchemy + Pydantic)
- **Database**: PostgreSQL with asyncpg
- **Validation**: Pydantic 2.13.4+
- **Server**: Uvicorn (via FastAPI standard)
- **Documentation**: Scalar FastAPI 1.8.2+

## Project Structure

```
app/
├── api/
│   ├── router/              # API route handlers
│   │   ├── checklists.py    # Checklist endpoints
│   │   ├── notes.py         # Notes endpoints
│   │   └── checklist_items.py # Checklist item endpoints
│   ├── schemas/             # Request/response validation models
│   │   ├── checklist.py
│   │   ├── note.py
│   │   └── checklist_item.py
│   └── deps.py              # Dependency injection
├── models/                  # Database models
│   ├── checklists.py
│   ├── notes.py
│   └── checklist_items.py
├── services/                # Business logic layer
│   ├── checklists.py
│   ├── notes.py
│   └── checklists_items.py
├── data/                    # Data access layer
│   ├── checklists.py
│   ├── notes.py
│   └── session.py           # Database session management
├── main.py                  # Application entry point
├── config.py                # Configuration management
├── exceptions.py            # Custom exceptions
└── pyproject.toml          # Project metadata and dependencies
```

## Getting Started

### Prerequisites

- Python 3.14+
- PostgreSQL database
- UV package manager (recommended) or pip

### Installation

1. **Clone the repository**
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
   Create a `.env` file in the app directory:
   ```
   POSTGRES_SERVER=localhost
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=yada_yada
   POSTGRES_PORT=5432
   ```

4. **Run the application**
   ```bash
   fastapi run main.py
   ```

   The API will be available at `http://localhost:8000`

## API Endpoints

### Notes

- `GET /notes` - Get all notes
- `GET /notes/{id}` - Get a specific note
- `POST /notes/create/` - Create a new note
- `PATCH /notes/{id}` - Update a note
- `DELETE /notes/{id}` - Delete a note

### Checklists

- `GET /checklists` - Get all checklists
- `GET /checklists/{id}` - Get a specific checklist
- `POST /checklists/create` - Create a new checklist
- `PATCH /checklists/{id}` - Update a checklist
- `DELETE /checklists/{id}` - Delete a checklist

### Checklist Items

- `GET /checklist_items/{checklist_id}` - Get all items in a checklist
- `POST /checklist_items/{checklist_id}/create` - Create a new checklist item
- `PATCH /checklist_items/{checklist_item_id}` - Update a checklist item
- `DELETE /checklist_items/{checklist_item_id}` - Delete a checklist item

## Documentation

Access the interactive API documentation at:
- **Scalar UI**: `http://localhost:8000/scalar`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

## Database Models

### Notes
```python
- id: int (primary key)
- title: str
- content: str
```

### Checklists
```python
- id: int (primary key)
- title: str
- checklist_items: list[ChecklistItem] (relationship)
```

### Checklist Items
```python
- id: int (primary key)
- title: str
- is_done: bool (default: False)
- checklist_id: int (foreign key)
- checklist: Checklists (relationship)
```

## Error Handling

The API includes comprehensive error handling:
- **404 Not Found** - When an item cannot be found
- **500 Internal Server Error** - For database and unexpected errors
- Custom exception handlers for specific error types

## Architecture

The application follows a layered architecture:

1. **API Layer** - Defines routes and handles HTTP requests/responses
2. **Schema Layer** - Validates request/response data with Pydantic
3. **Service Layer** - Contains business logic and orchestration
4. **Data Layer** - Manages database operations and sessions
5. **Model Layer** - Defines database table structures

## Running Tests

```bash
# Tests coming soon
```

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style
- All endpoints have docstrings
- Error cases are properly handled
- Database changes are backward compatible

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
