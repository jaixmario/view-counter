export default {
  async fetch(request, env) {

    const url = new URL(request.url)
    const parts = url.pathname.split("/").filter(Boolean)

    if (parts.length < 1) {
      return new Response("Usage: /USERNAME or /USERNAME/REPO", { status: 400 })
    }

    const username = parts[0]
    const repo = parts[1] || null

    const isProfile = !repo

    const label = isProfile ? "profile views" : "repo views"
    const key = isProfile
      ? `views:${username}`
      : `views:${username}/${repo}`

    // Get count
    let count = await env.GITHUBBADGE.get(key)
    count = parseInt(count || 0) + 1

    await env.GITHUBBADGE.put(key, count)

    // Telegram
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text: `👀 ${label}\nUser: ${username}\nRepo: ${repo || "N/A"}\nViews: ${count}`
      })
    })

    // 🔥 AUTO WIDTH SYSTEM
    const text = label
    const countText = count.toString()

    const charWidth = 6.5   // approx per char
    const padding = 10

    const leftWidth = Math.ceil(text.length * charWidth) + padding
    const rightWidth = Math.ceil(countText.length * charWidth) + padding

    const totalWidth = leftWidth + rightWidth

    const leftCenter = leftWidth / 2
    const rightCenter = leftWidth + (rightWidth / 2)

    // SVG
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>

  <mask id="a">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </mask>

  <g mask="url(#a)">
    <rect width="${leftWidth}" height="20" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="#c60000ff"/>
    <rect width="${totalWidth}" height="20" fill="url(#b)"/>
  </g>

  <g fill="#fff" text-anchor="middle"
     font-family="DejaVu Sans,Verdana,Geneva,sans-serif"
     font-size="11">

    <!-- Label -->
    <text x="${leftCenter}" y="15" fill="#010101" fill-opacity=".3">${text}</text>
    <text x="${leftCenter}" y="14">${text}</text>

    <!-- Count -->
    <text x="${rightCenter}" y="15" fill="#010101" fill-opacity=".3">${countText}</text>
    <text x="${rightCenter}" y="14">${countText}</text>
  </g>
</svg>
`

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    })
  }
}
