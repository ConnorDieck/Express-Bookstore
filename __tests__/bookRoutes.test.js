const { json } = require("express");
const request = require("supertest");
const { response } = require("../app");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

process.env.NODE_ENV = "test";

describe("Book routes tests", function() {
	beforeEach(async function() {
		{
			await db.query("DELETE FROM books");

			let b1 = {
				isbn: "0691161518",
				amazon_url: "http://a.co/eobPtX2",
				author: "Matthew Lane",
				language: "english",
				pages: 264,
				publisher: "Princeton University Press",
				title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
				year: 2017
			};

			let testBook = await Book.create(b1);
		}
	});

	describe("GET /books/", function() {
		test("response will include a list of books", async function() {
			let response = await request(app).get("/books");

			expect(Array.isArray(response.body.books)).toBe(true);
			expect(response.statusCode).toEqual(200);
		});
	});

	describe("GET /books/:isbn", function() {
		test("response will include obj of book with requested ISBN", async function() {
			let response = await request(app).get("/books/0691161518");

			expect(response.body.book.title).toEqual("Power-Up: Unlocking the Hidden Mathematics in Video Games");
			expect(response.statusCode).toEqual(200);
		});

		test("response will be an error if an ISBN that doesn't exist is requested", async function() {
			let response = await request(app).get("/books/1111111111");

			expect(response.statusCode).toEqual(404);
		});
	});

	describe("POST /books/", function() {
		test("posting with correct JSON will return a book obj", async function() {
			const data = {
				isbn: "0545582938",
				amazon_url: "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
				author: "JK Rowling",
				language: "english",
				pages: 464,
				publisher: "Scholastic Inc.",
				title: "Harry Potter and the Prisoner of Azkaban",
				year: 2013
			};

			let response = await request(app).post("/books").send(data);

			expect(response.body.book.title).toEqual("Harry Potter and the Prisoner of Azkaban");
			expect(response.statusCode).toEqual(201);
		});

		test("posting with incorrect JSON will return an error", async function() {
			const invalidData = {
				isbn: "0545582938",
				amazon_url: "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
				author: "JK Rowling",
				language: "english",
				pages: "464",
				publisher: "Scholastic Inc.",
				title: "Harry Potter and the Prisoner of Azkaban",
				year: 2013
			};
			let response = await request(app).post("/books", invalidData);

			expect(response.statusCode).toEqual(400);
		});
	});

	describe("PUT /books/:isbn", function() {
		test("sending with correct JSON and ISBN will return a book obj", async function() {
			const data = {
				isbn: "0545582938",
				amazon_url: "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
				author: "JK Rowling",
				language: "english",
				pages: 464,
				publisher: "Scholastic Inc.",
				title: "Harry Potter and the Prisoner of Azkaban",
				year: 2013
			};

			let response = await request(app).put("/books/0691161518").send(data);

			expect(response.body.book.title).toEqual("Harry Potter and the Prisoner of Azkaban");
			expect(response.statusCode).toEqual(200);
		});

		test("sending with incorrect JSON will return an error", async function() {
			const invalidData = {
				isbn: "0545582938",
				amazon_url: "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
				author: "JK Rowling",
				language: "english",
				pages: "464",
				publisher: "Scholastic Inc.",
				title: "Harry Potter and the Prisoner of Azkaban",
				year: 2013
			};
			let response = await request(app).put("/books/0691161518", invalidData);

			console.log(response);

			expect(response.statusCode).toEqual(400);
		});

		test("sending to a nonexistent ISBN will return 404", async function() {
			const invalidData = {
				isbn: "0545582938",
				amazon_url: "https://www.amazon.com/Harry-Potter-Prisoner-Azkaban-Book/dp/0545582938",
				author: "JK Rowling",
				language: "english",
				pages: 464,
				publisher: "Scholastic Inc.",
				title: "Harry Potter and the Prisoner of Azkaban",
				year: 2013
			};
			let response = await request(app).post("/books/1111111111", invalidData);

			expect(response.statusCode).toEqual(404);
		});
	});

	describe("DELETE /books/:isbn", function() {
		test("response will include a message indicating book was deleted", async function() {
			let response = await request(app).delete("/books/0691161518");

			expect(response.body.message).toEqual("Book deleted");
			expect(response.statusCode).toEqual(200);
		});

		test("response will be an error if an ISBN that doesn't exist is requested", async function() {
			let response = await request(app).delete("/books/1111111111");

			expect(response.statusCode).toEqual(404);
		});
	});
});

afterAll(async function() {
	await db.end();
});
