# GitHub View Counter

![Repo Views](https://githubbadge.mario22623.workers.dev/jaixmario/view-counter?label=repo%20views&color=%23c70000&labelColor=%23000000&textColor=%23ffffff&countColor=%23ffffff&fontSize=11&format=short)

A simple Cloudflare Worker that generates a dynamic SVG view counter badge for GitHub profiles or repositories.

## Features

- Count views per GitHub username or GitHub repo
- Generate an SVG badge on every request
- Customizable badge label, colors, font size, and number format
- Easy Cloudflare Workers + KV setup

## How it works

The worker handles requests to:

- `/USERNAME` — counts profile views for the given GitHub username
- `/USERNAME/REPO` — counts repo views for the given repository

Each request increments a counter in Cloudflare KV and returns an SVG badge.

## Deploy to Cloudflare

1. Log in to your Cloudflare account at [cloudflare.com](https://cloudflare.com).

2. From the left sidebar, search for "Workers & Pages" and select it.

3. Click "Create application".

4. Choose "Continue with GitHub login" if required.

5. Select "Clone a public repository via Git URL".

6. Enter the URL: `https://github.com/jaixmario/view-counter`

7. Click "Next" to create the repo.

8. If you want a custom subdomain, replace the project name with your preferred name.

9. In the "Select KV namespace" section, select "Create new" and enter `GITHUBBADGE` as the namespace name.

10. Click "Deploy".

11. Wait about 1 minute, then check the logs for your deployment URL, which will look something like `yourname.yourusername.workers.dev`.

## Usage

### Profile view counter

```text
https://your-worker.example.com/USERNAME
```

### Repo view counter

```text
https://your-worker.example.com/USERNAME/REPO
```

### Verify endpoint

```text
https://your-worker.example.com/verify
```

Returns JSON metadata about the service.

## Customization options

You can customize the badge using query string parameters:

- `label` — override the default label text
- `color` — badge right section background color (default `#c60000`)
- `labelColor` — badge left section background color (default `#555`)
- `textColor` — label text color (default `#ffffff`)
- `countColor` — count text color (defaults to `textColor`)
- `fontSize` — font size in pixels (default `11`)
- `format` — number format: `full` or `short`

### Example custom badge

```text
https://your-worker.example.com/USERNAME/REPO?label=repo%20views&color=%230068ff&labelColor=%23222&textColor=%23fff&countColor=%23ffeb3b&fontSize=12&format=short
```

## Example badge URLs

- Profile counter: `https://your-worker.example.com/octocat`
- Repository counter: `https://your-worker.example.com/octocat/hello-world`
- Short format: `...?format=short`
- Custom label: `...?label=profile%20hits`

## Notes

- The worker uses Cloudflare KV (`GITHUBBADGE`) for persistent counts.
- Each badge request increases the counter by one.
- SVG is returned with `Content-Type: image/svg+xml` and `Cache-Control: no-cache`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

## License

This project is open source and available under the [MIT License](LICENSE).

