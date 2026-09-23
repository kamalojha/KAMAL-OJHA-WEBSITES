# Security Specification & Test Matrix

## Data Invariants
1. **Inquiries Invariant**:
   - Any guest can create an inquiry with valid fields (`name`, `email`, `subject`, `message`, `status == 'unread'`, `createdAt == request.time`).
   - Only admins (or the owner) can list and read inquiries. General public cannot read or list inquiries to protect recruiter contact information (PII protection).
   - Inquiries cannot be updated or deleted by public users. Only admin can update status.

2. **Endorsements Invariant**:
   - Authenticated users (via Google Auth) can create an endorsement.
   - `authorUid` must match `request.auth.uid`.
   - `authorEmail` must match `request.auth.token.email`.
   - `createdAt` must equal `request.time`.
   - Public read is allowed for endorsements so visitors and recruiters can see verified recommendations.
   - Authors can update or delete only their own endorsements, preserving `authorUid` and `createdAt`.

3. **Admin Invariant**:
   - Only existing admins can read or modify the `admins` collection.
   - Users cannot self-assign admin roles.
   - Bootstrapped admin is verified using `request.auth.token.email == "kamal19ojha@gmail.com" && request.auth.token.email_verified == true`.

4. **Payments Invariant**:
   - Any guest or authenticated client can record a completed transaction with valid payment payload and server timestamp (`createdAt == request.time || createdAt is timestamp`).
   - `amount` must be a valid positive number <= 1,000,000 INR.
   - `currency` must be 'INR'.
   - `gateway` must be 'razorpay' or 'paytm'.
   - Only admin can list payments (`allow list: if isAdmin()`) to protect customer financial PII.
   - Direct single-receipt reading is allowed (`allow get: if true`) so paying users can retrieve their invoice.
   - Public users cannot update or delete payment records; only admin can modify.

## The Dirty Dozen Payloads
1. **Spoofed Author UID on Endorsement Create**: `authorUid: "another_user_id"` while logged in as `user_123`. -> REJECT.
2. **Ghost Field Injection**: Adding `isAdmin: true` or `verified: true` to an endorsement or inquiry payload. -> REJECT via `keys().hasOnly()`.
3. **Forged Timestamp**: Setting `createdAt` to a client string rather than `request.time`. -> REJECT.
4. **Denial of Wallet Payload**: Submitting a 500KB message string. -> REJECT via `.size() <= 2000`.
5. **Unauthorized Inquiries Read**: Anonymous or non-admin authenticated user reading `/inquiries`. -> REJECT.
6. **Inquiry Status Tampering**: Non-admin user updating inquiry `status` to `reviewed`. -> REJECT.
7. **Endorsement Ownership Hijacking**: User B updating or deleting User A's endorsement. -> REJECT.
8. **Invalid Path Injection**: Creating document with invalid ID characters `../../bad_id`. -> REJECT via `isValidId()`.
9. **Unverified Email Spoof**: Attempting admin operations with forged email claims where `email_verified == false`. -> REJECT.
10. **Blanket Query Scraping**: Malicious client querying without security evaluation. -> REJECT.
11. **Negative / Out-of-Range Rating**: Endorsement rating set to 999 or -5. -> REJECT.
12. **Self-Promotion to Admin**: Unauthenticated or normal user writing to `/admins/{uid}`. -> REJECT.
13. **Forged Currency or Negative Amount in Payment**: Submitting negative amount or non-INR currency. -> REJECT via `amount > 0 && currency == 'INR'`.
14. **Tampering Payment Record After Creation**: Non-admin user attempting update on payment document. -> REJECT via `allow update: if isAdmin()`.
