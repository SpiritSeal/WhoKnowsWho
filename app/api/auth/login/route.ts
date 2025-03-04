import { type NextRequest, NextResponse } from "next/server"

// Discord OAuth configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/api/auth/callback"

export async function GET(request: NextRequest) {
  console.log("Discord Client ID:", DISCORD_CLIENT_ID)
  console.log("Redirect URI:", REDIRECT_URI)

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15)

  // Create the authorization URL
  const authUrl = new URL("https://discord.com/api/oauth2/authorize")
  authUrl.searchParams.append("client_id", DISCORD_CLIENT_ID || "")
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI)
  authUrl.searchParams.append("response_type", "code")
  authUrl.searchParams.append("state", state)
  authUrl.searchParams.append("scope", "identify")

  // Create a simple HTML page that redirects to Discord
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting to Discord...</title>
        <meta http-equiv="refresh" content="0;url=${authUrl.toString()}">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f9fafb;
            color: #111827;
          }
          .container {
            text-align: center;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            background-color: white;
          }
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #5865F2;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 1rem auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Redirecting to Discord...</h2>
          <div class="loader"></div>
          <p>If you are not redirected automatically, <a href="${authUrl.toString()}">click here</a>.</p>
        </div>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}

