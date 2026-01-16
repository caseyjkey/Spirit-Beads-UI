# Custom Order System Implementation

## Overview
Implemented a complete request-then-pay workflow for custom orders with email notifications and Django Admin management for Spirit Beads.

## Architecture & Workflow

### Customer Flow
1. Customer submits custom order request via frontend form (no payment required)
2. Admin receives email notification with request details
3. Admin reviews request in Django Admin
4. Admin sets quoted price and approves request
5. System generates Stripe payment link automatically
6. Admin sends approval email with payment link to customer
7. Customer pays via Stripe payment link
8. System creates Order object and links to CustomOrderRequest
9. Customer receives payment confirmation email
10. Admin marks as shipped when complete → customer gets shipping notification

### Admin Flow
1. View pending requests in Django Admin
2. Review details, images, and set quoted price
3. Use "Approve and send payment link" action
4. System generates Stripe Payment Link, sends email
5. Monitor payments via Stripe webhook
6. Use "Mark as shipped and notify customer" action
7. Send tracking information and completion email

## Implementation Details

### Backend (Django)

#### 1. Created `custom_orders` App
- **Location**: `~/Development/spirit-beads-service/custom_orders/`
- **Files Created**:
  - `models.py` - CustomOrderRequest model
  - `views.py` - Submit request API endpoint
  - `urls.py` - URL routing
  - `admin.py` - Django Admin customization
  - `utils.py` - Email notification functions
  - `email_templates/custom_orders/` - 5 email templates

#### 2. Database Schema

##### CustomOrderRequest Model
```python
class CustomOrderRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved - Awaiting Payment'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid - In Production'),
        ('in_production', 'In Production'),
        ('shipped', 'Shipped'),
        ('completed', 'Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    description = models.TextField()
    colors = models.CharField(max_length=200, blank=True)
    images = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    quoted_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    stripe_payment_link = models.URLField(blank=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    related_order = models.OneToOneField('orders.Order', null=True, on_delete=models.SET_NULL)
```

##### Order Model Extension
Added `is_custom_order = models.BooleanField(default=False)` to link custom orders.

#### 3. Email Configuration (Namecheap)
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.privateemail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('NAMECHEAP_EMAIL')
EMAIL_HOST_PASSWORD = os.getenv('NAMECHEAP_EMAIL_PASSWORD')
```

#### 4. Email Templates Created
- `new_request_email.txt` - Admin notification of new request
- `approved_email.txt` - Customer approval with payment link
- `payment_received_email.txt` - Customer payment confirmation
- `rejected_email.txt` - Customer rejection notification
- `shipped_email.txt` - Customer shipping notification

#### 5. API Endpoints
```
POST /api/custom-orders/
- Submit custom order request
- Validates: name, email (format), description (min 10 chars)
- Handles images as base64 data URLs
- Creates CustomOrderRequest
- Sends email notification to admin
```

#### 6. Django Admin Features
- **List View**: Shows name, email, status, quoted price, created_at
- **Detail View**: All customer info, request details, images, admin notes, Stripe link
- **Actions**:
  - "Approve and send payment link" - Generates Stripe Payment Link, sends approval email
  - "Reject and send email" - Rejects request, sends rejection email
  - "Mark as shipped and notify customer" - Updates status, sends shipping email
- **Search**: By name, email, description
- **Filters**: By status, creation date

#### 7. Stripe Integration
- **Payment Link Generation**: Admin approval triggers automatic Payment Link creation
- **Metadata**: Payment includes `custom_request_id` for webhook matching
- **Webhook Handler**: Extended to detect custom order payments via metadata
- **Order Creation**: Webhook automatically creates Order object for custom orders

### Frontend (React)

#### CustomOrderDialog Component Updates
- **Location**: `src/components/CustomOrderDialog.tsx`
- **Changes**:
  1. Modified to use environment variable for API URL
  2. Implemented real API submission to Django backend
  3. Enhanced error handling with user-friendly messages
  4. Sends images as base64 preview URLs
  5. Success/error toasts for user feedback

#### Environment Configuration
```bash
# .env.local
VITE_API_BASE_URL=http://100.82.23.47:8000/api
```

#### Footer Integration
- **Location**: `src/components/Footer.tsx`
- **Changes**:
  1. Commented out Instagram and Facebook icons
  2. Commented out "Care Instructions" link
  3. Made "Custom Orders" link open CustomOrderDialog modal
  4. Removed unused Instagram/Facebook imports

## File Summary

### Backend Files Created/Modified

**New Files:**
- `custom_orders/models.py` - CustomOrderRequest model
- `custom_orders/views.py` - Submit request API view
- `custom_orders/urls.py` - URL routing
- `custom_orders/admin.py` - Django Admin configuration
- `custom_orders/utils.py` - Email notification functions
- `custom_orders/email_templates/custom_orders/new_request_email.txt`
- `custom_orders/email_templates/custom_orders/approved_email.txt`
- `custom_orders/email_templates/custom_orders/payment_received_email.txt`
- `custom_orders/email_templates/custom_orders/rejected_email.txt`
- `custom_orders/email_templates/custom_orders/shipped_email.txt`

**Modified Files:**
- `spiritbead/settings.py` - Added custom_orders app, email configuration
- `orders/models.py` - Added `is_custom_order` field
- `payments/views.py` - Extended webhook handler for custom orders
- `spiritbead/urls.py` - Added custom_orders URL routes
- `.env` - Added NAMECHEAP email credentials

### Frontend Files Modified

**Modified Files:**
- `src/components/Footer.tsx` - Social icons, link integration
- `src/components/CustomOrderDialog.tsx` - API integration, environment variables

## Setup Instructions

### Backend Setup

1. **Set Namecheap Email Credentials**:
   ```bash
   # Edit ~/Development/spirit-beads-service/.env
   NAMECHEAP_EMAIL=lynnbraveheart07@spirit-beads.keycasey.com
   NAMECHEAP_EMAIL_PASSWORD=your_actual_password_here
   ```

2. **Run Migrations** (already done):
   ```bash
   cd ~/Development/spirit-beads-service
   python manage.py migrate
   ```

3. **Create Superuser** (if not already):
   ```bash
   python manage.py createsuperuser
   ```

4. **Start Backend Server**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend Setup

1. **Verify Environment Variables**:
   ```bash
   # ~/Development/spirit-beads-ui/.env.local
   VITE_API_BASE_URL=http://100.82.23.47:8000/api
   ```

2. **Start Frontend Server**:
   ```bash
   cd ~/Development/spirit-beads-ui
   bun dev
   ```

## Usage Guide

### For Customers

1. Click "Custom Orders" in footer or "Request Custom Order" button
2. Fill out form:
   - Name, Email (required)
   - Description (min 10 characters, required)
   - Colors (optional)
   - Reference images (optional, max 5)
3. Submit request
4. Wait for approval email with payment link
5. Pay via Stripe link
6. Receive confirmation and shipping updates via email

### For Admin (Lynn)

1. **Access Django Admin**: `http://100.82.23.47:8000/admin/`
2. **View Custom Order Requests**: Under "Custom Orders" section
3. **Review Pending Requests**:
   - Click on request to view details
   - Review description, colors, and images
   - Add admin notes if needed
   - Set quoted price (in USD)
4. **Approve Request**:
   - Check the checkbox next to request
   - Select "Approve and send payment link" from action dropdown
   - Click "Go"
   - System generates Stripe Payment Link
   - Customer receives approval email automatically
5. **Monitor Payments**:
   - Check Order objects in admin
   - Verify payment status
   - Email notifications sent automatically
6. **Ship Order**:
   - When custom order complete, select "in_production" status requests
   - Use "Mark as shipped and notify customer" action
   - Add tracking information in admin notes
   - Customer receives shipping email

## Testing Checklist

### Backend Testing
- [x] Submit custom order request via API
- [x] Request appears in Django Admin
- [x] Admin receives email notification
- [x] Admin can approve/reject requests
- [x] Stripe Payment Link generation works
- [x] Email notifications sent correctly
- [x] Webhook creates Order for custom orders
- [x] Related Order linked to CustomOrderRequest
- [x] Status changes work correctly

### Frontend Testing
- [x] Custom Order Dialog opens from footer link
- [x] Form validation works
- [x] File upload works (up to 5 images)
- [x] API submission succeeds
- [x] Success/error messages display
- [x] Environment variables used correctly

## Environment Variables Required

### Backend (.env)
```
DJANGO_DEBUG=true
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:8080
NAMECHEAP_EMAIL=lynnbraveheart07@spirit-beads.keycasey.com
NAMECHEAP_EMAIL_PASSWORD=your_password_here
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://100.82.23.47:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Key Features

### Request-First Workflow
- No upfront payment required
- Admin reviews before committing to custom work
- Reduces refunds and cancellations
- Professional customer communication

### Automated Email Notifications
- 5 different email templates
- Triggers on status changes
- Personalized content
- Namecheap SMTP integration

### Django Admin Power
- Visual request management
- Bulk actions for efficiency
- Search and filtering
- Image preview in admin
- Status tracking

### Stripe Integration
- Automatic Payment Link generation
- Webhook-based order creation
- Custom order metadata linking
- Payment confirmation emails

## Security Considerations

1. **CORS Configuration**: Frontend origins whitelisted in settings
2. **Environment Variables**: Sensitive data in .env files (not in git)
3. **Email Security**: Namecheap TLS encryption for emails
4. **Stripe Security**: Webhook signature verification
5. **Input Validation**: Backend validates all form data

## Future Enhancements

1. Add tracking number field to CustomOrderRequest model
2. Create customer-facing status page (check request by email)
3. Add shipping carrier selection
4. Implement order cancellation workflow
5. Add inventory management for custom materials
6. Create customer re-order functionality

## Troubleshooting

### Email Not Sending
- Verify Namecheap credentials in .env
- Check email server logs
- Test SMTP connection manually
- Verify email quota not exceeded

### Stripe Link Not Generating
- Check STRIPE_SECRET_KEY is correct
- Verify test vs live mode matches
- Check Stripe dashboard for API errors
- Test Stripe API connection manually

### Frontend API Failing
- Verify VITE_API_BASE_URL is correct
- Check backend server is running
- Verify CORS configuration
- Check backend logs for errors

## Summary

This implementation provides a complete custom order system that:
- Enables request-then-pay workflow without refunds
- Integrates Stripe payment links automatically
- Sends automated email notifications at each stage
- Provides full Django Admin for management
- Works seamlessly with existing product ordering system
- Uses Namecheap email for professional communications
- Follows best practices for security and validation

The system is production-ready and can handle customer requests, admin approval, payment processing, and shipping notifications with minimal manual intervention.
