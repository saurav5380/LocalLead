# LocalLead - Test Credentials for UAT

## Test User Account

Use these credentials to test all API endpoints and features in the LocalLead application.

### Credentials

```
Username: testuser
Password: Test@123
Email: testuser@gmail.com
Full Name: Test User
User ID: 2
```

## Testing the Login Endpoint

**Important:** The backend API runs on port **8000**, not port 3000 (which is the frontend).

### Using cURL (from same machine):

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123"
  }'
```

### Using cURL (from another device):

First, start the backend to listen on all interfaces:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then access via IP address:
```bash
curl -X POST http://YOUR_IP:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123"
  }'
```
Replace `YOUR_IP` with your machine's IP address (e.g., 10.0.0.6)

### Expected Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

## Using the Access Token

After logging in, use the returned access token to authenticate subsequent API requests:

```bash
curl -X GET http://localhost:8000/api/endpoint \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Testing Workflow

1. **Login** - Test the `/login` endpoint with the credentials above
2. **Get Access Token** - Save the returned JWT token
3. **Test Protected Endpoints** - Use the token to access protected API endpoints
4. **Test Lead Management** - Create, read, update, and delete leads
5. **Test Dashboard** - View statistics and filtered lead data

## Notes

- The access token expires after 30 minutes
- If you need to reset the test user, run: `python backend/scripts/create_test_user.py`
- For security, change these credentials in production environments

## Recreating Test User

If you need to recreate the test user, you can run:

```bash
cd backend
python scripts/create_test_user.py
```

---
Last Updated: 2026-02-02
