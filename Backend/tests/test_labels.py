import pytest
from app.models import Label, User

@pytest.fixture
def test_user(db_session):
    user = User(name="Label Tester", email="labeltester@example.com", password="hashed", is_verified=True)
    db_session.add(user)
    db_session.commit()
    return user

def test_add_labels_success(client, db_session, test_user):
    user_id = test_user.id  # ✅ Get ID before anything weird happens

    payload = [
        {"name": "Groceries", "color": "green", "user_id": user_id},
        {"name": "Work", "color": "blue", "user_id": user_id}
    ]

    response = client.post("/api/labels/add", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Labels added successfully"

    # ✅ Query DB using user_id directly (no detached instances)
    labels_in_db = db_session.query(Label).filter(Label.user_id == user_id).all()
    label_names = [label.name for label in labels_in_db]

    assert "Groceries" in label_names
    assert "Work" in label_names





def test_get_labels_existing_user(client, db_session, test_user):
    label1 = Label(name="Personal", color="pink", user_id=test_user.id)
    label2 = Label(name="Urgent", color="red", user_id=test_user.id)
    db_session.add_all([label1, label2])
    db_session.commit()

    response = client.get(f"/api/labels/{test_user.id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert any(label["name"] == "Personal" and label["color"] == "pink" for label in data)
    assert any(label["name"] == "Urgent" and label["color"] == "red" for label in data)

def test_get_labels_empty_for_new_user(client, db_session):
    user = User(name="Empty Tester", email="emptytester@example.com", password="hashed", is_verified=True)
    db_session.add(user)
    db_session.commit()

    response = client.get(f"/api/labels/{user.id}")
    assert response.status_code == 200
    assert response.json() == []
