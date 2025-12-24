from fastapi import APIRouter, status, Depends
from services.get_current_user import get_current_user


router = APIRouter()


@router.get("/currentuser",status_code=status.HTTP_302_FOUND)
async def user_details(user = Depends(get_current_user)):
    try:
        if user:
            return {"message": f"You are logged in as user: {user}"}
    except Exception as e:
        return {"error": f"Could not fetch user details due to error: {str(e)}"}
    

        
