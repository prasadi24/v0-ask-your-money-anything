"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface VoiceAssistantProps {
  onVoiceQuery: (query: string) => void
  isProcessing?: boolean
  response?: string
}

export function VoiceAssistant({ onVoiceQuery, isProcessing = false, response }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [volume, setVolume] = useState(0)
  const [language, setLanguage] = useState("en-IN")

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const speechSynthesis = window.speechSynthesis

      if (SpeechRecognition && speechSynthesis) {
        setIsSupported(true)
        synthRef.current = speechSynthesis

        // Initialize speech recognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = language

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          startVolumeAnimation()
        }

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)

          if (finalTranscript) {
            onVoiceQuery(finalTranscript)
            setTranscript("")
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          stopVolumeAnimation()
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          stopVolumeAnimation()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (utteranceRef.current && synthRef.current) {
        synthRef.current.cancel()
      }
      stopVolumeAnimation()
    }
  }, [language, onVoiceQuery])

  useEffect(() => {
    // Auto-speak response when it changes
    if (response && response.trim()) {
      speakResponse(response)
    }
  }, [response])

  const startVolumeAnimation = () => {
    const animate = () => {
      setVolume(Math.random() * 100)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  const stopVolumeAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setVolume(0)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Failed to start speech recognition:", error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const speakResponse = (text: string) => {
    if (!synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    // Clean text for better speech synthesis
    const cleanText = text.replace(/[₹]/g, "rupees").replace(/\*/g, "").replace(/\n/g, ". ").replace(/\s+/g, " ").trim()

    utteranceRef.current = new SpeechSynthesisUtterance(cleanText)
    utteranceRef.current.lang = language
    utteranceRef.current.rate = 0.9
    utteranceRef.current.pitch = 1
    utteranceRef.current.volume = 0.8

    // Get Indian English voice if available
    const voices = synthRef.current.getVoices()
    const indianVoice =
      voices.find((voice) => voice.lang.includes("en-IN")) || voices.find((voice) => voice.lang.includes("en"))

    if (indianVoice) {
      utteranceRef.current.voice = indianVoice
    }

    utteranceRef.current.onstart = () => setIsSpeaking(true)
    utteranceRef.current.onend = () => setIsSpeaking(false)
    utteranceRef.current.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utteranceRef.current)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else if (response) {
      speakResponse(response)
    }
  }

  if (!isSupported) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MicOff className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Voice features are not supported in your browser. Please use Chrome, Edge, or Safari for the best
              experience.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Voice Input */}
            <div className="flex items-center space-x-2">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className="relative"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </Button>

              {/* Volume Indicator */}
              {isListening && (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-blue-500 rounded-full transition-all duration-100 ${
                        volume > i * 20 ? "h-4" : "h-1"
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Output */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={toggleSpeech} disabled={!response}>
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              {isSpeaking && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs border rounded px-2 py-1 bg-white"
              disabled={isListening}
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">हिंदी</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            {isListening && <Badge className="bg-red-100 text-red-800 animate-pulse">Listening...</Badge>}
            {isProcessing && <Badge className="bg-blue-100 text-blue-800">Processing...</Badge>}
            {isSpeaking && <Badge className="bg-green-100 text-green-800">Speaking...</Badge>}
          </div>
        </div>

        {/* Live Transcript */}
        {transcript && (
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">You said:</div>
            <div className="text-sm font-medium">{transcript}</div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-3 text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>🎤 Click mic to ask questions</span>
            <span>🔊 Auto-plays responses</span>
            <span>🌐 Supports Hindi & English</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Type declarations for Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}
