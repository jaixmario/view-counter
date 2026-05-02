export default {
  async fetch(request, env) {

    const url = new URL(request.url)
    const parts = url.pathname.split("/").filter(Boolean)

    if (parts.length < 1) {
      return new Response("Usage: /USERNAME or /USERNAME/REPO", { status: 400 })
    }

    const username = parts[0]
    const repo = parts[1] || null

    // 🎛️ Params
    const labelParam = url.searchParams.get("label")
    const color = url.searchParams.get("color") || "#c60000"
    const labelColor = url.searchParams.get("labelColor") || "#555"
    const format = url.searchParams.get("format") || "full"

    const textColor = url.searchParams.get("textColor") || "#ffffff"
    const countColor = url.searchParams.get("countColor") || textColor
    const fontSize = parseInt(url.searchParams.get("fontSize") || "11")

    const isProfile = !repo
    const label = labelParam || (isProfile ? "profile views" : "repo views")

    const key = isProfile
      ? `views:${username}`
      : `views:${username}/${repo}`

    // 🔢 Count
    let count = await env.GITHUBBADGE.get(key)
    count = parseInt(count || 0) + 1
    await env.GITHUBBADGE.put(key, count)

    // 🔢 Format
    function formatNumber(num) {
      if (format !== "short") return num.toString()

      if (num >= 1e9) return (num / 1e9).toFixed(1) + "B"
      if (num >= 1e6) return (num / 1e6).toFixed(1) + "M"
      if (num >= 1e3) return (num / 1e3).toFixed(1) + "K"
      return num.toString()
    }

    const countText = formatNumber(count)

    // 📏 Dynamic width (depends on font size too)
    const charWidth = fontSize * 0.6
    const padding = fontSize

    const leftWidth = Math.ceil(label.length * charWidth) + padding
    const rightWidth = Math.ceil(countText.length * charWidth) + padding

    const totalWidth = leftWidth + rightWidth

    const leftCenter = leftWidth / 2
    const rightCenter = leftWidth + (rightWidth / 2)

    const textY = 14 + (fontSize - 11) // adjust vertical alignment

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
    <rect width="${leftWidth}" height="20" fill="${labelColor}"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#b)"/>
  </g>

  <g text-anchor="middle"
     font-family="DejaVu Sans,Verdana,Geneva,sans-serif"
     font-size="${fontSize}">

    <!-- Label -->
    <text x="${leftCenter}" y="${textY+1}" fill="#000" fill-opacity=".3">${label}</text>
    <text x="${leftCenter}" y="${textY}" fill="${textColor}">${label}</text>

    <!-- Count -->
    <text x="${rightCenter}" y="${textY+1}" fill="#000" fill-opacity=".3">${countText}</text>
    <text x="${rightCenter}" y="${textY}" fill="${countColor}">${countText}</text>
  </g>
</svg>
`

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache"
      }
    })
  }
}
