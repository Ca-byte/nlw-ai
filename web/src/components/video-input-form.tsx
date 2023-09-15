import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";
import { FileVideo, Upload} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Converting...',
  generating: 'Genarating...',
  uploading: 'Uploading...',
  success: 'Success!',
}

 interface VideoInputFormProps {
 onVideoUploaded: (id: string) => void
}


export function VideoInputForm(props: VideoInputFormProps){
	const [videoFile, setVideoFile] = useState<File | null>(null)
	const [status, setStatus] = useState<Status>('waiting')

	const promptInputRef = useRef<HTMLTextAreaElement>(null)


	 function handleFileSelected(event: ChangeEvent<HTMLInputElement>){
		const { files } = event.currentTarget

		if(!files){
			return
		}
		const selectedFile = files[0]

		setVideoFile(selectedFile)

	 }
	const previewURL = useMemo(()=> {
		if(!videoFile){
			return null
		}
		return URL.createObjectURL(videoFile)

	}, [videoFile])

	async function convertVideoToAudio(video: File) {
    console.log('Convert started.')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // ffmpeg.on('log', log => {
    //   console.log(log)
    // })

    ffmpeg.on('progress', progress => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })
    const audioFile = new File([audioFileBlob], 'output.mp3', {
      type: 'audio/mpeg'
    })

    console.log('Convert finished.')

    return audioFile
  }

	async function handleUploadVideo(event: FormEvent<HTMLFormElement>){
		event.preventDefault()
		const prompt = promptInputRef.current?.value

		if(!videoFile){
			return
		}
		setStatus('converting')

		// converter o video em áudio
		

		const audioFile = await convertVideoToAudio(videoFile)

		const data = new FormData()

		data.append('file', audioFile)

		setStatus('uploading')

		const response = await api.post('/videos', data)

		const videoId = response.data.video.id

		setStatus('generating')

		await api.post(`/videos/${videoId}/transcription`, {
			prompt,
		})

		setStatus('success')

		props.onVideoUploaded(videoId)
		
	}

	return(
		<form onSubmit={handleUploadVideo} className="space-y-6">
			<label 
			htmlFor="video" 
			className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5">
				{previewURL ? (
					<video src={previewURL} controls={false} className="pointer-events-none inset-0 absolute aspect-video"/>
				): (
					<>
						<FileVideo className="w-4 h-4"/>
						 Select a video
					</>

				)}
			</label>
			<input type="file" name="video" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected} />

			<Separator />
			<div className="space-y-2">
				<Label htmlFor="transcription_prompt" className="text-sm">Transcription prompt</Label>
				<Textarea 
					disabled={status !== 'waiting'}
					ref={promptInputRef}
					id="transcription_prompt" 
					className="h-20 leading-relaxed resize-none"
					placeholder="Include keywords mentioned in the video, separated by commas (,)."
				/>
			</div>
			<Button
			data-success={status === 'success'} 
			disabled={status !== 'waiting'} 
			type="submit" 
			className="w-full first-line:items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/80 px-4 py-2 h-12 ease-in-out">
			{status === 'waiting'? (
          <>
            Upload video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : statusMessages[status]}
			</Button>
		</form>

	)
}