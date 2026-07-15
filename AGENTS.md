EngiNet AI Development Guide

Project Overview

EngiNet is a professional engineering platform that combines networking, job opportunities, engineering communities, messaging, and an Engineering Marketplace where engineers can securely buy and sell digital engineering resources.

Technology Stack

- Backend: Node.js + Express
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Payments: Provider abstraction (currently Monnify)
- Frontend: React / Next.js
- Version Control: GitHub

Coding Standards

- Use async/await.
- Keep controllers thin.
- Place business logic inside services.
- Validate all request bodies before processing.
- Return consistent JSON responses.
- Use descriptive variable names.
- Handle errors with try/catch.
- Never expose secrets or API keys.
- Never hardcode credentials.

Folder Structure

- routes/
- controllers/
- services/
- validations/
- utils/
- middleware/

Architecture Rules

- Controllers only call services.
- Services contain business logic.
- Routes only define endpoints.
- Validation files contain request validation.
- Utility files contain reusable helpers.

Supabase Rules

- Use the existing Supabase client.
- Never bypass Row Level Security.
- Keep database queries inside services.
- Use generic table names for payment-related data (payments, orders, transactions).

Marketplace Rules

- Marketplace is independent of the payment provider.
- Products can be created, updated, deleted, listed and purchased.
- Buyers can only download products they have purchased.
- Sellers can manage only their own listings.

Payment Rules

- Marketplace communicates only with the Payment Service.
- Payment Service communicates with the selected payment provider.
- Payment providers must be replaceable without changing Marketplace code.

Code Quality

- Generate production-ready code.
- Prefer reusable functions.
- Avoid duplicated logic.
- Follow existing project structure.
- Include comments only where they improve clarity.
