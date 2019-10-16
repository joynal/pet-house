FROM node:10-alpine

# Set a working directory
RUN mkdir /app
WORKDIR /app

# Copy application files
COPY . /app

RUN npm i

CMD ["npm", "run", "start"]
