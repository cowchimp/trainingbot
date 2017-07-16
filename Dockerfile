FROM node:8

WORKDIR /src

COPY package.json package.json
RUN npm install -q

COPY . .

ENTRYPOINT ["npm"]
CMD ["start"]
