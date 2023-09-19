import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-videos";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { genarationAIRoute } from "./routes/genarate-ai-completion";
import fastifyCors from "@fastify/cors";

const app = fastify()

app.register(fastifyCors, {
	origin: 'https://nlw-ai-mu.vercel.app/',
	credentials: true,
})


app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(genarationAIRoute)

app.listen({
	port: 3333, 
}).then(()=> {
	console.log('HTTP Server On Fire!')
})