import { Github, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue  } from "./components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleThemeMode } from "@/components/ui/toggle-theme-mode";
import { VideoInputForm } from "@/components/video-input-form";
import { useState } from "react";
import { useCompletion } from 'ai/react'
import { PromptSelect } from "@/components/prompt-select";

export function App() {
	const [temperature, setTemperature] = useState(0.5)
	const [videoId, setVideoId] = useState<string | null>(null)

	const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'https://nlw-ai-lake.vercel.app/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
				<div className="flex items-center justify-between border-b px-6 py-3">
					<h1 className="text-lg from-accent-foreground font-bold">Upload_AI</h1>

					<div className="flex items-center gap-3">
						<span className="text-sm text-muted-foreground">
							Developed with 💜 by Caroline Vieira
						</span>

						<Separator orientation="vertical" className="h-6"/>

						<Button>
							<Github className="w-4 h-4 mr-2" />
							GitHub
						</Button>
						<Separator orientation="vertical" className="h-6"/>
						<ToggleThemeMode />
					</div>
				</div>
				<main className="flex-1 flex gap-6 p-6">
					<div className="flex flex-col flex-1 gap-4">
						<div className="grid grid-rows-2 gap-4 flex-1">
							<Textarea 
								className="resize-none  p-4 leading-relaxed"
								placeholder="Enter the prompt for AI..."
								value={input}
								onChange={handleInputChange}
							/>
							<Textarea 
								className="resize-none  p-4 leading-relaxed"
								placeholder="AI-generated result..."
								value={completion}
							/>
						</div>
						<p className="text-sm text-muted-foreground">
							Remember: you can use the variable <code className="text-rose-600">{'{transcription}'}</code> in your prompt to add the content of the transcription of the selected video.
						</p>
					</div>
				

					<aside className="w-80 space-y-6">
						<VideoInputForm onVideoUploaded={setVideoId} />
						<Separator />

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm">Prompt</label>
								<PromptSelect onPromptSelected={setInput} /> 
							</div>

							<div className="space-y-2">
								<label className="text-sm">Model</label>
								<Select disabled defaultValue="gpt3.5">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="gpt3.5"> GPT 3.5-turbo 16k</SelectItem>
									</SelectContent>
								</Select> 
								<span className="block text-sm text-muted-foreground italic">
									You will be able to customize this function soon.
								</span>
							</div>

						<Separator />

						<div className="space-y-4">
							<label className="text-sm">Temperature</label>
								<Slider 
								min={0}
								max={1}
								step={0.1}
								value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
								className="cursor-pointer"
								/>
								<span className="block text-sm text-muted-foreground italic leading-relaxed">
									Higher values tend to make the result more creative and with potential errors.
								</span>
						</div>
						<Separator />

						<Button disabled={isLoading} type="submit" className="w-full first-line:items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/80 px-4 py-2 h-12 ease-in-out">
							Generate
							<Wand2 className="w-4 h-4 ml-2"/>
						</Button>
					</form>
				</aside>
			</main>
    </div>
  )
}


