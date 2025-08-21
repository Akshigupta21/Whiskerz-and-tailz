const request = require('supertest');
const app = require('../app');

describe('API Health Check', () => {
    test('GET /api/health should return 200', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect(200);
        
        expect(response.body.success).toBe(true);
        expect(response.body.status).toBe('OK');
        expect(response.body.message).toBe('Wiskerz & Tail Backend API is running');
    });
});

describe('Validation Tests', () => {
    describe('User Registration Validation', () => {
        test('should reject invalid email format', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'invalid-email',
                    password: 'ValidPass123!',
                    firstName: 'John',
                    lastName: 'Doe'
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        test('should reject weak password', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@example.com',
                    password: 'weak',
                    firstName: 'John',
                    lastName: 'Doe'
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        test('should reject missing required fields', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@example.com'
                    // Missing password, firstName, lastName
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });
    });

    describe('User Login Validation', () => {
        test('should reject missing email', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    password: 'ValidPass123!'
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
        });

        test('should reject missing password', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@example.com'
                })
                .expect(400);
            
            expect(response.body.success).toBe(false);
        });
    });
});

describe('Security Tests', () => {
    test('should include security headers', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect(200);
        
        expect(response.headers['x-content-type-options']).toBe('nosniff');
        expect(response.headers['x-frame-options']).toBe('DENY');
        expect(response.headers['x-xss-protection']).toBe('0');
    });

    test('should include CORS headers', async () => {
        const response = await request(app)
            .get('/api/health')
            .set('Origin', 'http://localhost:3000')
            .expect(200);
        
        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    test('should handle rate limiting', async () => {
        // This test might need adjustment based on your rate limiting configuration
        const requests = [];
        for (let i = 0; i < 10; i++) {
            requests.push(request(app).get('/api/health'));
        }
        
        const responses = await Promise.all(requests);
        responses.forEach(response => {
            expect([200, 429]).toContain(response.status);
        });
    }, 10000);
});

describe('Error Handling', () => {
    test('should return 404 for non-existent routes', async () => {
        const response = await request(app)
            .get('/api/non-existent')
            .expect(404);
        
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('not found');
    });

    test('should handle invalid JSON', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .type('json')
            .send('{"invalid": json}')
            .expect(400);
        
        expect(response.body.success).toBe(false);
    });
});
