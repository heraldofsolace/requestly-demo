# Express CRUD API

This is a basic Express.js application demonstrating CRUD operations for a resource called `items`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints


- `GET /items` - List all items
- `GET /items/:id` - Get item by ID
- `POST /items` - Create a new item
- `PUT /items/:id` - Update an item (ID cannot be changed)
- `PATCH /items/:id` - Partially update an item (ID cannot be changed)
- `DELETE /items/:id` - Delete an item
- `POST /items/:id/category` - Add a category to an item
- `GET /httpbin` - Fetch data from httpbin.org

## Project Structure

- `index.js` - Main server file
- `package.json` - Project metadata and scripts

Feel free to extend this project for your needs.
