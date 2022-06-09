CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
);


CREATE TABLE urls (
	id SERIAL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES users(id),
	"url" TEXT NOT NULL,
	"shortUrl" TEXT NOT NULL UNIQUE,
	"visitCount" INTEGER NOT NULL DEFAULT 0,
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
);


CREATE TABLE sessions (
	id SERIAL PRIMARY KEY,
	"userId" INTEGER NOT NULL REFERENCES users(id),
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
);
