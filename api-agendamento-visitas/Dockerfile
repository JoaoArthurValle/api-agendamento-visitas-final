FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Adiciona uma URL dummy para a validação do Prisma durante o build
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]