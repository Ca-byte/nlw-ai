import { FileVideo, Github, Sidebar, Upload, Wand2 } from "lucide-react";
import { ToggleThemeMode } from "./components/ui/ToggleThemeMode";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue  } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg from-accent-foreground font-bold">Upload_AI</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Developed with 💜 by Caroline Vieira</span>

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
            />
            <Textarea 
              className="resize-none  p-4 leading-relaxed"
              placeholder="AI-generated result..."
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Remember: you can use the variable <code className="text-rose-600">{'{transcription}'}</code> in your prompt to add the content of the transcription of the selected video.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label 
            htmlFor="video" 
            className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5">
              Upload video
              <FileVideo className="w-4 h-4"/>
              Select a video
            </label>
            <input type="file" name="video" id="video" accept="video/mp4" className="sr-only" />

            <Separator />
            <div className="space-y-2">
              <Label htmlFor="transcription_prompt" className="text-sm">Transcription prompt</Label>
              <Textarea 
                id="transcription_prompt" 
                className="h-20 leading-relaxed resize-none"
                placeholder="Include keywords mentioned in the video, separated by commas (,)."
              />
            </div>
            <Button type="submit" className="w-full first-line:items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/80 px-4 py-2 h-12 ease-in-out">
              Upload video
            <Upload className="h-4 w-4 ml-2"/>
            </Button>
          </form>
          <Separator />

          <form className="space-y-6">
          <div className="space-y-2">
              <label className="text-sm">Prompt</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Youtube Video title</SelectItem>
                  <SelectItem value="description">Youtube Video description overview</SelectItem>
                </SelectContent>
              </Select> 
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
              className="cursor-pointer"
              />
              <span className="block text-sm text-muted-foreground italic leading-relaxed">
              Higher values tend to make the result more creative and with potential errors.
              </span>
            </div>
            <Separator />

            <Button type="submit" className="w-full first-line:items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/80 px-4 py-2 h-12 ease-in-out">
              Generate
              <Wand2 className="w-4 h-4 ml-2"/>
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}


