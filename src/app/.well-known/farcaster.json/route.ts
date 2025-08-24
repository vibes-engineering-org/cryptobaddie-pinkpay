import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjEwNDQ1MTQsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg2QzA4NTBmRjVhYzdEYjI4ZkU2NTMzRUYzNTgxMTlEZEFCN0VFZTQ1In0",
      payload: "eyJkb21haW4iOiJjcnlwdG9iYWRkaWUtcGlua3BheS52ZXJjZWwuYXBwIn0",
      signature:
        "MHgxZDU4NzM5YjIwN2NiZWU5YTU1OGRjM2RhYTMwZDA2OTdmYjBiNWI0NDM0NmUxMzk1ZTdkNWM0MjgwZDVhYjRkMjc2MWQxNjg5NTI0ODczYjc5YzNkMjQ1MDhkYzQ5OTdhODk0ODQ3YzVjNzhhZmUwOWNlYWVlOWUxMTUwMDYzNDFi",
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
      tags: ["crypto", "offramp", "mpesa", "africa", "finance"],
    },
  };

  return Response.json(config);
}
