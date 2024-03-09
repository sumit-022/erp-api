#!/bin/sh

echo "Migrating database..."

npm run build
npx prisma generate
npx prisma db push