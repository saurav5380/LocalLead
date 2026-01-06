from fastapi import APIRouter, status, Depends
from services.get_current_user import get_current_user

router = APIRouter()

@router.get("/currentuser",status_code=status.HTTP_200_OK)
async def user_details(user: dict = Depends(get_current_user)):
    return {"message": f"You are logged in as user: {user.username}",
            "full_name": f"Your full name is: {user.full_name}",
            "email": f"Your email is: {user.email}"
            }
    

        
