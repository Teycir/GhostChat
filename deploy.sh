#!/bin/bash
set -e

export $(cat .env.local | xargs)

npm run build

npx wrangler pages deploy out --project-name=ghostchat
