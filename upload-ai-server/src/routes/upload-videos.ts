import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import fastifyMultipart from "@fastify/multipart";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import pgPromise from "pg-promise";

const pump = promisify(pipeline)
const pgp = pgPromise();

const db = pgp("postgres://default:2iuIPAT1dYyQ@ep-purple-glitter-18800565-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15" || "postgres://default:2iuIPAT1dYyQ@ep-purple-glitter-18800565-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb");
export async function uploadVideoRoute(app:FastifyInstance) {
	app.register(fastifyMultipart,{
		limits: {
			fileSize: 1_048_576 * 25 //25mb
		}
	})
	app.post('/videos', async (request, reply) => {
    const data = await request.file()
		
		if (!data){
			return reply.status(400).send({ error: 'Missing file input.' })
		}

		const extension = path.extname(data.filename)

		if(extension !== '.mp3'){
			return reply.status(400).send({ error: 'Invalid input type, please upload a MP3.' })
		}

		const fileBaseName = path.basename(data.filename, extension)
		const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
		const uploadStore = path.resolve(__dirname, '../../tmp', fileUploadName)

		await pump(data.file, fs.createWriteStream(uploadStore));
		try {
      // Insert file metadata into the database
      const result = await db.one(
        'INSERT INTO videos (name, path) VALUES ($1, $2) RETURNING id',
        [data.filename, uploadStore]
      );
		const video = await prisma.video.create({
			data: {
				name: data.filename,
				path: uploadStore
			}
		})

		return { result, video };
	} catch (error) {
		console.error(error);
		return reply.status(500).send({ error: 'Internal Server Error' });
	}
});
}