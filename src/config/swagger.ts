import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Naze REST API',
    version: '1.0.0',
    description: 'Production REST API for naze.biz.id',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          200: {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    timestamp: { type: 'string' },
                    database: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/products': {
      get: {
        summary: 'List all products',
        tags: ['Products'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          200: {
            description: 'List of products',
          },
        },
      },
      post: {
        summary: 'Create product',
        tags: ['Products'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  stock: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Product created',
          },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        summary: 'Get product by ID',
        tags: ['Products'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Product details',
          },
        },
      },
      put: {
        summary: 'Update product',
        tags: ['Products'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Product updated',
          },
        },
      },
      delete: {
        summary: 'Delete product',
        tags: ['Products'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Product deleted',
          },
        },
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
}
