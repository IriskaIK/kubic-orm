# TypeScript ORM

This project is a custom ORM (Object-Relational Mapping) built with TypeScript as part of my coursework project. The primary goal of this project is to develop a functional ORM, rather than to outperform existing alternatives. It focuses on implementing core ORM features like query building, model handling, and relationship mapping while providing support for complex queries.

## Features

- **Query Builder**: A query builder supporting SQL queries, joins, subqueries, and complex conditions.
- **Model Layer**: Define models with static methods for queries. Automatically maps database columns to model properties.
- **Relationship Mapping**: Supports various relationships such as `BelongsToOne`, `ManyToMany`, and more.
- **Results Mapping Layer**: Handles mapping database query results to model instances, ensuring a smooth conversion from raw database results to structured model data.
- **Execution Layer**: Responsible for executing the SQL queries constructed by the query builder and managing the connection to the database.
- **TypeScript Support**: Fully typed, providing type safety and IntelliSense for developers.
- **Chaining Support**: Chain methods for building queries like `.select()`, `.where()`, `.orWhere()`, and more.

## Tech Stack

- **TypeScript**: For static typing and code scalability.
- **PostgreSQL**: Works with PostgreSQL. In the future will be work with more SQL databases.
- **Node.js**: The environment to run the ORM.
- **pg**: Used to interact with the database.
- **Jest**: Unit testing framework.
- **TypeDoc**: For generating API documentation.
- **Pino**: Logger for tracking events and errors efficiently.

## Project Structure

This ORM project includes the following core components:

- **Query Builder**: Constructs SQL queries using a builder pattern.
- **BaseModel**: The base class for defining models. Handles mapping of data between the database and model properties.
- **Relationship Mapping**: Provides the ability to define relationships between models.
- **Results Mapping Layer**: Translates raw database query results into the correct structure based on the model definitions.
- **Execution Layer**: Responsible for executing queries and managing interactions with the database.

## About This Project
This ORM was developed as part of my coursework project. The focus is on building a functional ORM with features commonly found in modern ORMs, such as query building, model mapping, and relationship management. While the project is not designed to outperform existing ORM solutions, it aims to provide a learning experience in implementing core ORM functionalities from scratch.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

