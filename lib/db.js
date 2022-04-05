import { MongoClient } from 'mongodb';

/**
 * Helped to connect to mongodb
 *
 * @return {object} Client of the db for further use
 */
export async function connectToDatabase() {
	const client = await MongoClient.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	return client;
}
