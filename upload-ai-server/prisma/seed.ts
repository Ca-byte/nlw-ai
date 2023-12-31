import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.prompt.deleteMany()

  await prisma.prompt.create({
    data: {
			title: 'Video Title',
			template: `Your task is to generate three titles for a YouTube video.
			
			Below, you will receive a transcription of this video. Use this transcription to generate the titles.
			Below, you will also receive a list of titles. Use this list as a reference for the titles to be generated.
			
			The titles must have a maximum of 60 characters.
			The titles should be catchy and appealing to maximize clicks.
			
			Return ONLY the three titles in list format as in the example below and in the English language:
			'''
			
			Title 1
			Title 2
			Title 3
			'''
Transcription: 		
'''
{transcription}
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
		title: 'Audio Description',
		template: `Your role is to generate a concise description for a YouTube video.

Below, you will receive a transcription of this video. Use this transcription to generate the description.

The description should have a maximum of 80 words in the first person and should contain the main points of the video.

Use attention-grabbing words to captivate the reader.

Additionally, at the end of the description, include a list of 3 to 10 hashtags in lowercase containing keywords from the video.

The return should follow the following format and in the English language:
'''
Description.

#hashtag1 #hashtag2 #hashtag3 ...
'''

Transcription: 
'''
{transcription}
'''`.trim()
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })