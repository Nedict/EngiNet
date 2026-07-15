# EngiNet Downloads Module Documentation

## Overview

The Downloads Module provides secure file download functionality for marketplace products. It implements a complete workflow for verifying purchases, generating signed URLs, tracking downloads, and maintaining download history.

## Module Structure

```
backend/src/
├── routes/
│   └── download.routes.js          # Route definitions
├── controllers/
│   └── download.controller.js       # Request handlers
├── services/
│   └── download.service.js          # Business logic
├── validations/
│   └── download.validation.js       # Input validation
└── utils/
    └── downloadResponse.js          # Response formatters
```

## File Locations & Purposes

### 1. `backend/src/routes/download.routes.js`

**Purpose**: Define HTTP endpoints for download operations

**Routes**:
- `GET /api/downloads/history` - Fetch user's download history
- `GET /api/downloads/:downloadId` - Get specific download details
- `POST /api/downloads/initiate/:productId` - Start download process
- `POST /api/downloads/:downloadId/complete` - Track completion

**Key Features**:
- All routes require authentication via `auth` middleware
- Clean route definitions following EngiNet patterns
- Delegates all logic to controllers

### 2. `backend/src/controllers/download.controller.js`

**Purpose**: Handle HTTP requests and coordinate responses

**Functions**:
- `getDownloadHistory(req, res)` - Paginated download history
- `getDownloadDetails(req, res)` - Specific download information
- `initiateDownload(req, res)` - Start verified download
- `trackDownloadCompletion(req, res)` - Record completion

**Responsibilities**:
- Extract user ID from `req.user.id` (set by auth middleware)
- Extract parameters and query strings
- Call appropriate service functions
- Handle errors with specific HTTP status codes
- Return formatted responses using response utilities
- All operations wrapped in try/catch

**Error Handling**:
- 400 Bad Request - Missing or invalid parameters
- 403 Forbidden - Access denied or unpaid purchase
- 404 Not Found - Product or download not found
- 500 Server Error - Database or system errors

### 3. `backend/src/services/download.service.js`

**Purpose**: Implement all business logic and database operations

**Key Functions**:

#### `getDownloadHistory(userId, page, limit)`
- Fetches paginated download history
- Joins with products table to include product details
- Returns data with pagination metadata
- Orders by most recent first

#### `getDownloadDetails(downloadId, userId)`
- Retrieves specific download record
- Verifies ownership (user can only see own downloads)
- Joins with product details
- Throws error if unauthorized

#### `initiateDownload(userId, productId)` - **Core Function**
7-step verification and download process:

1. **Verify Product Exists**
   - Fetch product from database
   - Confirm file_path is set

2. **Verify Purchase Exists**
   - Query orders table for matching product + user
   - Ensure purchase record exists

3. **Verify Payment Status**
   - Check order.status === 'completed'
   - Reject if payment pending or failed

4. **Verify Product File**
   - Confirm product.file_path is valid
   - Check file exists in Supabase Storage

5. **Generate Signed URL**
   - Use Supabase `createSignedUrl()` method
   - Valid for 24 hours (86400 seconds)
   - Secure token-based access

6. **Create Download Record**
   - Insert into downloads table
   - Set status to 'initiated'
   - Record initiated_at timestamp
   - Store file metadata

7. **Increment Product Count**
   - Fetch current download_count
   - Increment by 1
   - Update products table

#### `trackDownloadCompletion(downloadId, userId)`
- Verifies download ownership
- Updates status to 'completed'
- Sets completed_at timestamp
- Used for analytics

#### `verifyDownloadAccess(userId, productId)` - Helper
- Check if user purchased specific product
- Verify payment is completed
- Used for authorization checks

#### `getProductDownloadCount(productId)` - Helper
- Return count of completed downloads
- Used for product statistics

#### `cleanupExpiredDownloads()` - Maintenance
- Find downloads older than 24 hours
- Mark status as 'expired'
- Called via periodic cron job

**Database Operations**:
- All use Supabase service client
- Proper error handling
- Logging for debugging
- Transaction-like behavior

### 4. `backend/src/validations/download.validation.js`

**Purpose**: Validate request inputs

**Functions**:

#### `validateProductId(productId)`
Returns: `{ isValid: boolean, errors: object }`
- Checks for presence
- Validates string format
- Non-empty requirement

#### `validateDownloadId(downloadId)`
Returns: `{ isValid: boolean, errors: object }`
- Checks for presence
- Validates string format
- Non-empty requirement

#### `validatePagination(page, limit)`
Returns: `{ isValid: boolean, errors: object, page: number, limit: number }`
- Page must be positive integer
- Limit must be 1-100
- Returns parsed values

### 5. `backend/src/utils/downloadResponse.js`

**Purpose**: Format API responses consistently

**Functions**:

#### `downloadResponse(download)`
Single download with expiry info
```json
{
    "success": true,
    "message": "Download initiated successfully",
    "data": {
        "id": "uuid",
        "productId": "uuid",
        "fileName": "file.pdf",
        "fileSize": 1024000,
        "fileType": "pdf",
        "downloadUrl": "signed-url",
        "status": "initiated",
        "initiatedAt": "2024-01-15T10:30:00Z",
        "completedAt": null,
        "expiresAt": "2024-01-16T10:30:00Z"
    }
}
```

#### `downloadHistoryResponse(downloads, pagination)`
Multiple downloads with pagination
```json
{
    "success": true,
    "message": "Download history retrieved successfully",
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "pages": 5
    }
}
```

#### `downloadDetailsResponse(download)`
Full download info with product context
```json
{
    "success": true,
    "message": "Download details retrieved successfully",
    "data": {
        "id": "uuid",
        "productId": "uuid",
        "fileName": "file.pdf",
        "product": {
            "id": "uuid",
            "name": "Product Name",
            "sellerId": "uuid",
            "price": 29.99
        }
    }
}
```

## Database Schema

### Required Table: `downloads`

```sql
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    download_url TEXT,
    status TEXT DEFAULT 'initiated',
    initiated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_product_id ON downloads(product_id);
CREATE INDEX idx_downloads_status ON downloads(status);
CREATE INDEX idx_downloads_initiated_at ON downloads(initiated_at);

-- RLS Policy
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Users can read their own downloads
CREATE POLICY "Users can read own downloads" ON downloads
    FOR SELECT USING (auth.uid() = user_id);
```

### Related Tables Modified

#### `products` table
Add or ensure these columns:
- `file_path` (TEXT) - Path in Supabase Storage
- `file_name` (TEXT) - Original filename
- `file_size` (INTEGER) - File size in bytes
- `file_type` (TEXT) - MIME type
- `download_count` (INTEGER DEFAULT 0) - Total completed downloads

#### `orders` table (must exist)
Columns used:
- `id` - Order identifier
- `buyer_id` - References profiles(id)
- `product_id` - References products(id)
- `status` - Text: 'completed', 'pending', 'failed'

## Integration Steps

### 1. Database Setup
```sql
-- Run migrations to create downloads table
-- Add columns to products table if missing
-- Create RLS policies
```

### 2. Route Registration
The `download.routes.js` must be registered in `backend/src/routes/index.js`:
```javascript
router.use("/downloads", require("./download.routes"));
```
*(This line has been added)*

### 3. Supabase Storage Setup
Ensure bucket exists:
- Bucket name: `products`
- File path format: `{product_id}/{filename}`

### 4. Environment Configuration
No additional env vars needed - uses existing:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## API Usage Examples

### Get Download History
```bash
GET /api/downloads/history?page=1&limit=20
Authorization: Bearer {token}
```

Response:
```json
{
    "success": true,
    "message": "Download history retrieved successfully",
    "data": [
        {
            "id": "download-uuid",
            "productId": "product-uuid",
            "productName": "PDF Course",
            "fileName": "course.pdf",
            "fileSize": 5242880,
            "status": "completed",
            "initiatedAt": "2024-01-15T10:30:00Z",
            "completedAt": "2024-01-15T10:32:15Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 45,
        "pages": 3
    }
}
```

### Initiate Download
```bash
POST /api/downloads/initiate/{productId}
Authorization: Bearer {token}
```

Response:
```json
{
    "success": true,
    "message": "Download initiated successfully",
    "data": {
        "id": "download-uuid",
        "productId": "product-uuid",
        "fileName": "course.pdf",
        "fileSize": 5242880,
        "downloadUrl": "https://..signed-url...",
        "status": "initiated",
        "expiresAt": "2024-01-16T10:30:00Z"
    }
}
```

### Track Completion
```bash
POST /api/downloads/{downloadId}/complete
Authorization: Bearer {token}
```

## Security Features

✅ **Authentication Required**
- All endpoints protected by `auth` middleware
- Extracts user from JWT token

✅ **Purchase Verification**
- Checks orders table before generating URL
- Verifies payment status = 'completed'
- Prevents unauthorized downloads

✅ **Secure URLs**
- Supabase generates signed URLs
- 24-hour expiration
- Token-based access control

✅ **Ownership Verification**
- Users can only access own downloads
- Authorization check on detail endpoint
- Prevents cross-user access

✅ **Audit Trail**
- Download initiated timestamp
- Download completed timestamp
- Status tracking
- Download history available

## Performance Considerations

✅ **Pagination**
- Download history limited to 20 records per page
- Prevents loading entire history

✅ **Database Indexes**
- `idx_downloads_user_id` - Fast user history lookup
- `idx_downloads_product_id` - Fast product statistics
- `idx_downloads_status` - Fast status queries

✅ **Supabase Optimization**
- Specific column selection (not SELECT *)
- Joins only when needed
- Limits applied to queries

## Error Scenarios

| Error | HTTP Status | Cause |
|-------|------------|-------|
| No authentication token | 401 | Missing auth middleware |
| Product not found | 404 | Invalid product ID |
| Purchase not found | 403 | User hasn't bought product |
| Payment not completed | 403 | Order status != 'completed' |
| Product file missing | 404 | file_path is null/empty |
| Invalid download ID | 404 | Download doesn't exist |
| Unauthorized access | 403 | User accessing another's download |
| Invalid pagination | 400 | Page/limit out of range |

## Maintenance Tasks

### Periodic Cleanup (Daily via Cron)
```javascript
// Call cleanup function to mark expired downloads
await downloadService.cleanupExpiredDownloads();
```

### Analytics
```javascript
// Get product download stats
const count = await downloadService.getProductDownloadCount(productId);
```

## Testing Checklist

- [ ] Test download history pagination
- [ ] Test get download details with authorization
- [ ] Test initiate download with valid purchase
- [ ] Test initiate download without purchase
- [ ] Test initiate download with incomplete payment
- [ ] Test track download completion
- [ ] Test unauthorized access to other's download
- [ ] Test with invalid product ID
- [ ] Test with invalid download ID
- [ ] Test with invalid pagination params
- [ ] Test expired download URLs (>24 hours)
- [ ] Test concurrent downloads
- [ ] Verify download count increments
- [ ] Verify download history ordering (newest first)

## Future Enhancements

- Rate limiting on download initiation
- Download speed limits (throttling)
- Geographic restrictions
- Download attempt tracking
- Abuse detection/prevention
- Multi-file downloads (zip)
- Resume support for large files
- Download notifications to seller
- Product version tracking
