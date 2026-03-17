# Real-Time Customers Dashboard

This implementation displays real-time customer data from Dodo Payments API in your website.

## Features

✅ Real-time customer data fetching from Dodo Payments API
✅ Auto-refresh every 30 seconds
✅ Beautiful, responsive UI with Framer Motion animations
✅ Customer statistics (total, active, recent 24h)
✅ Customer cards with avatars and details
✅ Manual refresh button
✅ Loading and error states
✅ Dark mode support

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Dodo Payments API key:

```env
DODO_PAYMENTS_API_KEY=your_actual_api_key_here
```

### 2. Get Your Dodo Payments API Key

1. Log in to your [Dodo Payments Dashboard](https://dashboard.dodopayments.com)
2. Navigate to Settings → API Keys
3. Copy your API key
4. Paste it in `.env.local`

### 3. Install Dependencies (if needed)

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the Customers Dashboard

Open your browser and navigate to:

```
http://localhost:3000/customers
```

## File Structure

```
app/
├── api/
│   └── customers/
│       └── route.ts          # API route that fetches from Dodo Payments
├── customers/
│   └── page.tsx              # Customers page
├── header.tsx                # Navigation header
└── layout.tsx                # Root layout with header

components/
└── customers-dashboard.tsx   # Main customers dashboard component
```

## API Endpoints

### GET /api/customers

Fetches customers from Dodo Payments API.

**Response:**
```json
{
  "customers": [...],
  "total": 10,
  "timestamp": "2026-03-17T..."
}
```

## Customization

### Change Auto-Refresh Interval

Edit `components/customers-dashboard.tsx`:

```tsx
// Change 30000 (30 seconds) to your desired interval in milliseconds
const interval = setInterval(() => {
  fetchCustomers(true)
}, 30000)
```

### Customize Styling

The component uses Tailwind CSS classes. You can customize colors, spacing, and animations by editing the className props in `components/customers-dashboard.tsx`.

### Filter or Limit Customers

Edit `app/api/customers/route.ts` to add filtering logic:

```tsx
// Example: Filter by email domain
const filteredCustomers = customers.filter(c => 
  c.email.endsWith('@example.com')
)

// Example: Limit results
const limitedCustomers = customers.slice(0, 20)
```

## Troubleshooting

### API Key Error

If you see "Failed to fetch customers":
- Check that `DODO_PAYMENTS_API_KEY` is set in `.env.local`
- Verify your API key is valid
- Check the terminal console for detailed error messages

### No Customers Appearing

- Ensure your Dodo Payments account has customers
- Check browser console for errors
- Verify the API endpoint is responding (check terminal logs)

### Styling Issues

- Ensure Tailwind CSS is properly configured
- Check that `globals.css` includes Tailwind directives
- Clear browser cache and restart dev server

## Features to Add

Here are some ideas to extend the dashboard:

1. **Search & Filter**: Add search by name/email and filter by date
2. **Pagination**: Add pagination for large customer lists
3. **Customer Details Modal**: Show detailed customer info on click
4. **Export to CSV**: Add export functionality
5. **Customer Analytics**: Add graphs showing customer growth over time
6. **Real-time Notifications**: Show toast notifications for new customers
7. **Customer Tags**: Display and filter by customer metadata/tags

## Support

For Dodo Payments API documentation, visit:
https://docs.dodopayments.com

For issues with this implementation, check the console logs and API responses.
