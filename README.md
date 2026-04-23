````markdown
# Naze REST API 🚀

Production-ready REST API built with Node.js, Express, and PostgreSQL for [naze.biz.id](https://naze.biz.id)

## Features

✅ **REST API with CRUD Operations** - Full-featured product management  
✅ **API Key Authentication** - Secure endpoints with x-api-key header  
✅ **PostgreSQL Database** - Robust relational database  
✅ **TypeScript** - Type-safe development  
✅ **Swagger/OpenAPI Documentation** - Interactive API docs at `/api/docs`  
✅ **Error Handling** - Comprehensive error handling middleware  
✅ **Docker Support** - Easy containerization with Docker & Docker Compose  
✅ **Production Ready** - Environment-based configuration, logging, health checks  
✅ **Render Ready** - Deploy to Render with one click  

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Render.com, Docker
- **Development**: TypeScript, ESLint, Prettier, Nodemon

## Project Structure

```
Website--Api/
├── src/
│   ├── config/
│   │   ├── database.ts          # PostgreSQL configuration
│   │   └── swagger.ts           # OpenAPI/Swagger spec
│   ├── middleware/
│   │   ├── auth.ts              # API key authentication
│   │   └── errorHandler.ts      # Error handling
│   ├── routes/
│   │   ├── health.ts            # Health check endpoint
│   │   └── products.ts          # Products CRUD endpoints
│   └── index.ts                 # Main application entry
├── database/
│   └── init.sql                 # Database initialization
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile                   # Docker image definition
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
├── .env.example                 # Environment variables example
├── render.yaml                  # Render deployment config
└── README.md                    # This file
```

## Quick Start

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 13+ (or Docker)
- npm or yarn

### 2. Installation

Clone the repository:

```bash
git clone https://github.com/HabibiOfficial/Website--Api.git
cd Website--Api
```

Install dependencies:

```bash
npm install
```

### 3. Environment Setup

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/naze_api
DB_HOST=localhost
DB_PORT=5432
DB_NAME=naze_api
DB_USER=postgres
DB_PASSWORD=postgres
API_KEY=your-secret-api-key-here-change-in-production
```

### 4. Database Setup

**Option A: Using Docker (Recommended)**

```bash
docker-compose up -d
```

This will start PostgreSQL and initialize the database.

**Option B: Manual Setup**

Create database and user:

```sql
CREATE DATABASE naze_api;
CREATE USER postgres WITH PASSWORD 'postgres';
ALTER ROLE postgres SUPERUSER;
```

Run initialization script:

```bash
psql -U postgres -d naze_api -f database/init.sql
```

### 5. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 6. Access API Documentation

Open in browser: http://localhost:3000/api/docs

## API Endpoints

### Health Check

```bash
GET /health
```

Returns API health status and database connection status.

### Products (CRUD)

All endpoints return JSON responses with `success` boolean and `data` object.

#### List Products

```bash
GET /api/products?page=1&limit=10
```

#### Get Product Detail

```bash
GET /api/products/:id
```

#### Create Product (Requires API Key)

```bash
POST /api/products
X-API-Key: your-secret-api-key-here
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 10
}
```

#### Update Product (Requires API Key)

```bash
PUT /api/products/:id
X-API-Key: your-secret-api-key-here
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 129.99
}
```

#### Delete Product (Requires API Key)

```bash
DELETE /api/products/:id
X-API-Key: your-secret-api-key-here
```

## API Key Authentication

All write operations (POST, PUT, DELETE) require API key authentication.

Add the API key in request header:

```
X-API-Key: your-secret-api-key-here
```

Change the default API key in `.env` file for production!

## Available Scripts

```bash
# Development
npm run dev         # Start dev server with hot reload

# Build
npm run build       # Compile TypeScript to JavaScript

# Production
npm start           # Run compiled JavaScript

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier

# Database
npm run db:migrate  # Run database migrations
```

## Docker Support

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Using Docker Only

Build image:

```bash
docker build -t naze-api .
```

Run container:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:password@host:5432/naze_api \
  -e API_KEY=your-secret-key \
  naze-api
```

## Deployment to Render

### Prerequisites

- GitHub repository connected
- Render.com account

### Step-by-Step

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Website--Api` repository

2. **Configure Service**
   - **Name**: naze-api
   - **Environment**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid as needed)

3. **Add Database**
   - Click "New +" → "PostgreSQL"
   - **Name**: naze-postgres
   - **Database Name**: naze_api
   - **User**: postgres
   - **Plan**: Free

4. **Environment Variables**
   - Set in Render dashboard:
     ```
     NODE_ENV=production
     API_KEY=your-secret-production-key
     ```
   - Database variables auto-populated by Render

5. **Deploy Custom Domain**
   - In Service Settings → Custom Domain
   - Add: `naze.biz.id`
   - Update DNS records pointing to Render

6. **Deploy**
   - Push to main branch
   - Render auto-deploys

### Database Initialization on Render

The `render.yaml` file handles automatic database creation. On first deployment:

1. Render creates PostgreSQL database
2. Run manual initialization if needed:
   ```bash
   cat database/init.sql | psql $DATABASE_URL
   ```

## Environment Variables

See `.env.example` for all available variables:

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development, production |
| DATABASE_URL | PostgreSQL connection string | postgresql://... |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | naze_api |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | postgres |
| API_KEY | Secret API key | your-secret-key |
| CORS_ORIGIN | CORS allowed origin | * |

## Error Handling

All errors return consistent JSON response:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error or stack trace"
}
```

## Security Best Practices

⚠️ **Important for Production:**

1. **Change API Key**: Set a strong, random API key in production
2. **HTTPS Only**: Always use HTTPS in production
3. **CORS**: Restrict CORS_ORIGIN to your domain
4. **Database**: Use strong password for PostgreSQL
5. **Environment**: Never commit `.env` file to repository
6. **Secrets Management**: Use Render's secret management for sensitive data

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running:

```bash
# Using Docker Compose
docker-compose up -d postgres

# Or manually start PostgreSQL service
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: Change PORT in `.env` or kill process:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API Key Not Working

```json
{
  "success": false,
  "message": "Invalid API key"
}
```

**Solution**: Verify:

1. API key is in `x-api-key` header
2. API key matches value in `.env`
3. Request method is POST/PUT/DELETE

## Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# List products
curl http://localhost:3000/api/products

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "x-api-key: your-secret-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99}'

# Update product
curl -X PUT http://localhost:3000/api/products/1 \
  -H "x-api-key: your-secret-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{"price":79.99}'

# Delete product
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: your-secret-api-key-here"
```

### Using REST Client Extensions

VSCode Rest Client, Insomnia, or Postman:

```http
### Health Check
GET http://localhost:3000/health

### List Products
GET http://localhost:3000/api/products?page=1&limit=10

### Create Product
POST http://localhost:3000/api/products
x-api-key: your-secret-api-key-here
Content-Type: application/json

{
  "name": "Test Product",
  "description": "Test description",
  "price": 99.99,
  "stock": 10
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit and push
4. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation at `/api/docs`
- Review database schema in `database/init.sql`

---

**Made with ❤️ by HabibiOfficial** | [GitHub](https://github.com/HabibiOfficial) | [naze.biz.id](https://naze.biz.id)
````
