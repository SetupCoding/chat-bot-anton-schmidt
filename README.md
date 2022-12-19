# chat-bot-anton-schmidt

A simple chat bot to help you pick an insurance type.

## Install

Run `yarn`

## Run

Run `yarn dev`

## Build

Run `yarn build`

## Linting

Run `yarn lint`

## Testing

### Unit Tests

Run `yarn test:unit`

### E2E Tests

To execute cross browser tests with playwright run:
`yarn test:e2e`  
If it is your first time executing tests with playwright, you might need to run `yarn playwright install` to install Chrome, Firefox, Safari and Edge.

### All tests

If playwright browsers are installed  
Run `yarn test`

## Possible next features

- Preserve client side state and selected options upon refresh
- Use [Orval](https://orval.dev/) and [React Query](https://tanstack.com/query/v4) for leaner handling of requests, loading and error states based on OpenAPI specification
- Use [Orval](https://orval.dev/) to generate client code and mock data
- [Dockerize](https://nextjs.org/docs/deployment#docker-image) application
- [Deploy application](https://nextjs.org/docs/deployment#serverless) (e.g. using Vercel/ AWS Serverless / Terraform / Netlify)
- CI/CD Pipeline (e.g. using GitHub Actions) to run tests and deploy application
- [Dockerized E2E](https://playwright.dev/docs/docker) tests with playwright
- a11y tests using (e.g. [AXE](https://www.deque.com/axe/))
- Visual regression tests with [Playwright](https://playwright.dev/docs/screenshots)

## The idea behind the example

The project uses [Next.js](https://github.com/vercel/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5.
