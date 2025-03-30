
import { useState } from "react";
import { Bot, Mic, Upload, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MainLayout } from "@/components/layout/MainLayout";

type DetectionResult = {
  isBot: boolean;
  confidence: number;
  features?: {
    name: string;
    value: number;
  }[];
};

const BotDetection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null); // Reset result when new file is selected
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setResult(null);
    
    // In a real implementation, you would start recording audio here
    // For now, we'll simulate recording for 3 seconds
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    analyzeAudio();
  };

  const analyzeAudio = () => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would send audio to an API for analysis
    // For now, we'll simulate analysis with a timeout
    setTimeout(() => {
      const mockResult: DetectionResult = {
        isBot: Math.random() > 0.5, // Random result for demonstration
        confidence: Math.random() * 50 + 50, // Random confidence between 50-100%
        features: [
          { name: "Natural Pauses", value: Math.random() * 100 },
          { name: "Voice Variation", value: Math.random() * 100 },
          { name: "Background Noise", value: Math.random() * 100 },
          { name: "Speech Patterns", value: Math.random() * 100 },
        ],
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const analyzeFile = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Similar to above, simulate analysis
    setTimeout(() => {
      const mockResult: DetectionResult = {
        isBot: Math.random() > 0.5,
        confidence: Math.random() * 50 + 50,
        features: [
          { name: "Natural Pauses", value: Math.random() * 100 },
          { name: "Voice Variation", value: Math.random() * 100 },
          { name: "Background Noise", value: Math.random() * 100 },
          { name: "Speech Patterns", value: Math.random() * 100 },
        ],
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            {result.isBot ? (
              <>
                <Bot className="h-6 w-6 text-red-500 mr-2" />
                Bot Detected
              </>
            ) : (
              <>
                <Activity className="h-6 w-6 text-green-500 mr-2" />
                Human Voice Detected
              </>
            )}
          </CardTitle>
          <CardDescription>
            {result.isBot 
              ? "Our analysis indicates this is likely a bot or synthetic voice."
              : "Our analysis indicates this is likely a human voice."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm font-medium">{result.confidence.toFixed(1)}%</span>
              </div>
              <Progress value={result.confidence} className="h-2" />
            </div>
            
            {result.features && (
              <div className="space-y-3 mt-4">
                <h4 className="font-medium">Analysis Features</h4>
                {result.features.map((feature, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{feature.name}</span>
                      <span className="text-sm">{feature.value.toFixed(1)}%</span>
                    </div>
                    <Progress value={feature.value} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bot Voice Detection</h1>
          <p className="text-muted-foreground max-w-2xl">
            Analyze audio recordings to determine if the voice belongs to a real person or an AI bot.
            This helps protect you from sophisticated phone scams.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Record Audio</CardTitle>
              <CardDescription>
                Record a voice sample to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className="h-24 w-24 rounded-full"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
              >
                <Mic className={`h-10 w-10 ${isRecording ? 'animate-pulse-opacity' : ''}`} />
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              {isRecording ? "Recording... Click to stop" : "Click to start recording"}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Audio</CardTitle>
              <CardDescription>
                Upload an audio file for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="border-2 border-dashed border-muted rounded-lg p-6 w-full text-center">
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <input
                  type="file"
                  id="audio-upload"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isAnalyzing}
                />
                <label
                  htmlFor="audio-upload"
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  Click to upload or drag and drop
                </label>
                {selectedFile && (
                  <p className="mt-2 text-sm font-medium">{selectedFile.name}</p>
                )}
              </div>
              
              <Button
                onClick={analyzeFile}
                disabled={!selectedFile || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze File"}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {renderResult()}
        
        <div className="mt-12 p-6 bg-accent rounded-lg w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">How Bot Detection Works</h2>
          <p className="mb-4">
            Our AI-powered voice analysis system examines several features to distinguish between human and synthetic voices:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Natural speech patterns and pauses</li>
            <li>Voice inflection and emotional variation</li>
            <li>Micro-fluctuations in voice that are hard for AI to replicate</li>
            <li>Background noise analysis</li>
            <li>Response patterns to questions</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            For best results, upload or record at least 5 seconds of clear audio.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default BotDetection;
