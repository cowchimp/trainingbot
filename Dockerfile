FROM node:6

WORKDIR /src

COPY package.json package.json
RUN npm install -q

COPY . .

RUN npm run-script build

ENTRYPOINT ["npm"]
CMD ["start"]
