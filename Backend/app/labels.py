from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db  # Make sure get_db is defined in database.py
from app.models import Label
from app.schemas import LabelCreate, LabelResponse
from typing import List

router = APIRouter(prefix="/api/labels", tags=["Labels"])

# 🔹 Endpoint to Add Multiple Labels for a User
@router.post("/add")
def add_labels(labels: List[LabelCreate], db: Session = Depends(get_db)):
    try:
        new_labels = []
        for label_data in labels:
            new_label = Label(
                name=label_data.name,
                color=label_data.color,
                user_id=label_data.user_id
            )
            db.add(new_label)
            new_labels.append(new_label)
        
        db.commit()
        return {"message": "Labels added successfully", "labels": new_labels}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 Endpoint to Retrieve All Labels for a User
@router.get("/{user_id}", response_model=List[LabelResponse])
def get_labels(user_id: int, db: Session = Depends(get_db)):
    labels = db.query(Label).filter(Label.user_id == user_id).all()
    
    if not labels:
        return []  # ✅ Return an empty list instead of an error

    return labels

