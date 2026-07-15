# EngiNet Copilot & AI Development Instructions

This document provides specific guidance for AI agents and developers contributing to EngiNet.

## Code Generation Standards

### Production-Ready Code
- Write complete, functional code on first attempt
- No placeholder comments ("TODO", "FIXME", "XXX")
- Include proper error handling in all functions
- Use meaningful names for variables, functions, and files

### File Organization
Follow the existing EngiNet structure:
```
Feature → 
  routes/featureName.routes.js → 
  controllers/featureName.controller.js → 
  services/featureName.service.js →
  utils/featureName*.js
```

### Never Create New Layers
Do not add:
- New directory types outside of: routes, controllers, services, utils, middleware, config
- New file structures inconsistent with existing patterns
- Utility functions outside of `utils/`

## Backend Development Patterns

### 1. Routes Layer (Thin Endpoint Definitions)

```javascript
// ✓ CORRECT: routes/job.routes.js
const express = require('express');
const jobController = require('../controllers/job.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', auth, jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router;
```

**Rules:**
- Only define endpoints and HTTP methods
- Map to controller functions
- Apply auth middleware where needed
- Never include business logic

### 2. Controllers Layer (Thin Request Handlers)

```javascript
// ✓ CORRECT: controllers/job.controller.js
const jobService = require('../services/job.service');
const { jobResponse } = require('../utils/jobResponse');
const { statusCodes } = require('../utils/statusCodes');

exports.createJob = async (req, res) => {
    try {
        // 1. Extract request data
        const { title, description, location, salary_min, salary_max } = req.body;
        
        // 2. Basic validation
        if (!title || !description) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Title and description required'
            });
        }
        
        // 3. Call service
        const job = await jobService.createJob({
            company_id: req.user.company_id,
            posted_by: req.user.id,
            title,
            description,
            location,
            salary_min,
            salary_max
        });
        
        // 4. Return formatted response
        return res.status(statusCodes.CREATED).json(jobResponse(job));
    } catch (error) {
        return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};
```

**Rules:**
- Extract and do basic validation of request data
- Never do business logic
- Call appropriate service
- Return formatted response
- Always wrap in try/catch
- Use consistent response format

### 3. Services Layer (Business Logic)

```javascript
// ✓ CORRECT: services/job.service.js
const supabase = require('../config/supabase');
const { logger } = require('../utils/logger');

exports.createJob = async (jobData) => {
    try {
        // 1. Validate data
        if (!jobData.title || jobData.title.trim() === '') {
            throw new Error('Job title cannot be empty');
        }
        
        if (jobData.salary_min < 0 || jobData.salary_max < 0) {
            throw new Error('Salary cannot be negative');
        }
        
        if (jobData.salary_min > jobData.salary_max) {
            throw new Error('Minimum salary cannot exceed maximum');
        }
        
        // 2. Database operation
        const { data, error } = await supabase
            .from('jobs')
            .insert([{
                company_id: jobData.company_id,
                posted_by: jobData.posted_by,
                title: jobData.title.trim(),
                description: jobData.description.trim(),
                location: jobData.location || null,
                salary_min: jobData.salary_min,
                salary_max: jobData.salary_max,
                status: 'open'
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        logger.info(`Job created: ${data.id}`);
        return data;
    } catch (error) {
        logger.error(`Job creation failed: ${error.message}`);
        throw new Error(`Failed to create job: ${error.message}`);
    }
};
```

**Rules:**
- Implement all business logic here
- Validate inputs thoroughly
- All database queries go here
- Use Supabase client from config
- Proper error handling with try/catch
- Meaningful error messages
- Return raw data (let controller format response)

### 4. Utils Layer (Response Formatters & Helpers)

```javascript
// ✓ CORRECT: utils/jobResponse.js
exports.jobResponse = (job) => {
    return {
        success: true,
        message: 'Job operation successful',
        data: {
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            salary: {
                min: job.salary_min,
                max: job.salary_max
            },
            status: job.status,
            posted_by: job.posted_by,
            created_at: job.created_at
        }
    };
};

// Multiple results
exports.jobsListResponse = (jobs, pagination) => {
    return {
        success: true,
        message: 'Jobs retrieved successfully',
        data: jobs,
        pagination
    };
};
```

**Rules:**
- One response formatter per feature
- Transform database data to API response
- Hide internal columns
- Include necessary metadata
- Keep consistent structure

## Supabase Usage Patterns

### Connection & Configuration
```javascript
// ✓ CORRECT: Always use service role key from config
const supabase = require('../config/supabase');

// ✗ INCORRECT: Creating new client instances
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key); // DON'T DO THIS
```

### Query with Error Handling
```javascript
// ✓ CORRECT
const { data, error } = await supabase
    .from('jobs')
    .select('id, title, description, salary_min, salary_max')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(20);

if (error) {
    throw new Error(`Database error: ${error.message}`);
}

return data;

// ✗ INCORRECT: No error handling
const { data } = await supabase.from('jobs').select();
```

### Respecting Row Level Security
```javascript
// ✓ CORRECT: RLS policies enforced by Supabase
// If user shouldn't see a record, RLS prevents it
const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient_id', userId);
// RLS policy ensures only their messages are returned

// ✗ INCORRECT: Bypassing RLS
// Never use admin-only functions unnecessarily
const { data } = await supabase.rpc('admin_function');
```

### Specific Column Selection
```javascript
// ✓ CORRECT: Only select needed columns
const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .eq('id', userId)
    .single();

// ✗ INCORRECT: SELECT *
const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
```

## Middleware Guidelines

### Authentication Middleware
The existing `auth.middleware.js` provides:
- `req.auth` - Supabase user object
- `req.user` - Complete profile from database

```javascript
// ✓ CORRECT: Using auth middleware
router.post('/protected', auth, (req, res) => {
    const userId = req.user.id;
    const userEmail = req.auth.email;
    // ... handle request
});
```

### Creating New Middleware
```javascript
// ✓ CORRECT: Middleware pattern
const myMiddleware = (req, res, next) => {
    try {
        // Do something
        next(); // Call next or send response
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = myMiddleware;
```

## Error Handling Strategy

### Controller Level
```javascript
// ✓ CORRECT
try {
    const result = await service.doSomething();
    res.json({ success: true, data: result });
} catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
    });
}
```

### Service Level
```javascript
// ✓ CORRECT
try {
    // Database operation
    if (!data) throw new Error('Record not found');
    return data;
} catch (error) {
    logger.error(error);
    throw error; // Let controller handle
}
```

### Never Expose Internal Errors
```javascript
// ✗ INCORRECT
res.json({ 
    error: error.stack,
    sql: error.query
});

// ✓ CORRECT
res.json({
    success: false,
    message: 'An error occurred while processing your request'
});
```

## File Upload Handling

### Using Existing Upload System
```javascript
// ✓ CORRECT: Use upload.middleware and storage.service
const { uploadFile } = require('../services/storage.service');

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        const url = await uploadFile(
            req.file,
            'avatars',
            req.user.id
        );
        
        // Update profile with new avatar
        await supabase
            .from('profiles')
            .update({ avatar_url: url })
            .eq('id', req.user.id);
        
        res.json({
            success: true,
            message: 'Avatar uploaded',
            data: { avatar_url: url }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
```

## Validation Guidelines

### Input Validation
```javascript
// ✓ CORRECT: Validate at controller
const email = req.body.email;

if (!email) {
    return res.status(400).json({
        success: false,
        message: 'Email is required'
    });
}

if (!email.includes('@')) {
    return res.status(400).json({
        success: false,
        message: 'Invalid email format'
    });
}
```

### Business Logic Validation
```javascript
// ✓ CORRECT: Validate at service
if (jobData.salary_min > jobData.salary_max) {
    throw new Error('Minimum salary cannot exceed maximum');
}
```

## Response Format Standards

All API responses must follow this structure:

### Success Response
```json
{
    "success": true,
    "message": "Operation description",
    "data": {
        "id": "...",
        "field1": "value1",
        "field2": "value2"
    },
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "pages": 5
    }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description"
}
```

## Logging Best Practices

```javascript
// ✓ CORRECT: Use logger utility
const { logger } = require('../utils/logger');

logger.info('User registered', { userId: user.id });
logger.error('Database connection failed', error);

// ✗ INCORRECT
console.log('User registered');
console.error(error);
```

## Security Rules - NEVER

1. ❌ Never hardcode secrets
2. ❌ Never expose Supabase service role key to frontend
3. ❌ Never log sensitive user data
4. ❌ Never bypass authentication
5. ❌ Never trust user input without validation
6. ❌ Never commit `.env` file
7. ❌ Never return database errors directly to client
8. ❌ Never modify RLS policies without understanding implications

## Adding New Features

### Step-by-Step Process

1. **Create Route** (`routes/newFeature.routes.js`)
   ```javascript
   router.post('/', auth, newFeatureController.create);
   ```

2. **Create Controller** (`controllers/newFeature.controller.js`)
   ```javascript
   exports.create = async (req, res) => {
       try {
           const data = await newFeatureService.create(req.body);
           res.json(newFeatureResponse(data));
       } catch (error) {
           res.status(400).json({ success: false, message: error.message });
       }
   };
   ```

3. **Create Service** (`services/newFeature.service.js`)
   ```javascript
   exports.create = async (featureData) => {
       const { data, error } = await supabase
           .from('table_name')
           .insert([featureData])
           .select()
           .single();
       if (error) throw error;
       return data;
   };
   ```

4. **Create Response Formatter** (`utils/newFeatureResponse.js`)
   ```javascript
   exports.newFeatureResponse = (feature) => ({
       success: true,
       message: 'Feature created',
       data: feature
   });
   ```

5. **Register Route** in `routes/index.js`
   ```javascript
   app.use('/api/newFeature', require('./routes/newFeature.routes'));
   ```

## Code Review Checklist

Before committing code:
- [ ] Follows existing project structure
- [ ] All async operations in try/catch
- [ ] Uses Supabase service from config
- [ ] No hardcoded secrets or credentials
- [ ] Proper error messages (no stack traces)
- [ ] Response format consistent
- [ ] Input validation at controller
- [ ] Business logic only in services
- [ ] Meaningful commit message
- [ ] No console.log (use logger)
- [ ] No TODO comments
- [ ] File named consistently with pattern
- [ ] Auth middleware applied where needed

## Testing Requirements

Before marking feature as complete:
- [ ] Endpoint tested with Postman/curl
- [ ] Error scenarios tested
- [ ] Auth/permission scenarios tested
- [ ] Database operations verified
- [ ] Response format validated

## Documentation Requirements

For each new feature:
- [ ] Route documented in routes file
- [ ] Controller methods have clear purpose
- [ ] Service functions documented
- [ ] Response format documented
- [ ] Error scenarios documented
