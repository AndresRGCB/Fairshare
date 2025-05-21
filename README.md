# FairShare

A financial expense tracking and management application built with FastAPI backend and React frontend.

## Project Structure

- **Backend**: FastAPI application with PostgreSQL database
- **Frontend**: React application

## Features

- User authentication and account management
- Expense tracking and categorization
- Recurring expenses management
- Installment expense tracking
- Data visualization and analytics
- Label-based organization

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fairshare.git
   cd fairshare
   ```

2. Start the application:
   ```
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Development

### Backend

The backend is built with FastAPI and uses:
- PostgreSQL for database
- SQLAlchemy for ORM
- Alembic for migrations
- Redis for caching

### Frontend

The frontend is built with React and uses:
- React Router for navigation
- Modern UI components
- Responsive design

## Deployment

The application can be deployed using Docker Compose on any server that supports Docker.

## License

This project is licensed under the MIT License - see the LICENSE file for details.