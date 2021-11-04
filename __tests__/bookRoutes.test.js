const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

process.env.NODE_ENV = "test";

describe("Book routes tests", function() {
	beforeEach(async function() {
		{
			return "to finish";
		}
	});
});
