import { type NextRequest, NextResponse } from "next/server"

// Discord OAuth configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/api/auth/callback"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    console.error("Discord auth error:", error)
    return createHtmlResponse({
      title: "Authentication Failed",
      message: `There was a problem authenticating with Discord. Error: ${error}`,
      success: false,
    })
  }

  if (!code) {
    console.error("No code received from Discord")
    return createHtmlResponse({
      title: "Authentication Failed",
      message: "No authorization code received from Discord.",
      success: false,
    })
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID || "",
        client_secret: DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const tokenData = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error("Failed to get user info")
    }

    const userData = await userResponse.json()

    // Format user data
    const user = {
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar ? `${userData.id}/${userData.avatar}` : "",
    }

    return createHtmlResponse({
      title: "Authentication Successful",
      message: `Welcome, ${user.username}!`,
      success: true,
      user,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return createHtmlResponse({
      title: "Authentication Failed",
      message: `There was a problem authenticating with Discord. Error: ${error.message}`,
      success: false,
    })
  }
}

function createHtmlResponse({
  title,
  message,
  success,
  user = null,
}: {
  title: string
  message: string
  success: boolean
  user?: any
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
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
          .success {
            color: #10B981;
          }
          .error {
            color: #EF4444;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="${success ? "success" : "error"}">${title}</h2>
          <p>${message}</p>
          ${success ? "<p>You can close this window now.</p>" : ""}
        </div>
        ${
          success && user
            ? `
          <script>
            // Send user data to parent window
            window.opener.postMessage({
              type: "DISCORD_AUTH_SUCCESS",
              user: ${JSON.stringify(user)}
            }, "*");
            
            // Close this window after a short delay
            setTimeout(() => window.close(), 1000);
          </script>
        `
            : ""
        }
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}

