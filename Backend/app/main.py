from fastapi import FastAPI
from app.routes import router  # Import routes
from app.auth import router as auth_router
from app.labels import router as labels_router
from app.expenses import router as expenses_router
from app.graphs import router as graphs_router
from fastapi.middleware.cors import CORSMiddleware

#lets do thi
app = FastAPI()

# Configure CORS to properly handle requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fairshare.andresroblesgil.com", "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,  # Enable credentials for cookies/auth
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Include routes
# Include routes with /api prefix
# Include routes WITHOUT adding duplicate /api prefix since router files already have it
app.include_router(auth_router)  # Already has /api/auth prefix
app.include_router(labels_router)  # Already has /api/labels prefix
app.include_router(expenses_router)  # Already has /api/expenses prefix
app.include_router(graphs_router)  # Already has /api/graphs prefix


@app.get("/")
def home():
    return {"message": "Welcome to Carne Asada Griller API"}


# Add this at the bottom of the file
@app.get("/routes")
def get_routes():
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "methods": route.methods
        })
    return {"routes": routes}
