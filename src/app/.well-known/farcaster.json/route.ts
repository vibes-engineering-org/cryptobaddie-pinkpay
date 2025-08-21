import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ",
      payload: "eyJkb21haW4iOiJjcnlwdG9iYWRkaWUtcGlua3BheS52ZXJjZWwuYXBwIn0",
      signature: "MHgzYWI1ZDIzNGViY2RiZGM2OTZmOGIzMDQxYzNkZTc3ZTg5ZDBjMGNhYjY3ZmRjZDZiY2EwMDI2YmE3M2ViNTViN2E0YzJjOWUyZjliYWY2MTU1ZGM2NTI0ZGU5ZTIxMmViYzA2YWVlZDAxZTc5OTFlMmY3ODgzODA4MDg1Mjk5ODFj",
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Open",
      webhookUrl: `${appUrl}/api/webhook`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#555555",
      primaryCategory: "finance",
      tags: ["crypto", "offramp", "mpesa", "africa", "finance"]
    },
  };

  return Response.json(config);
}
