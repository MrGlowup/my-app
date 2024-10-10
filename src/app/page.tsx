'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload, Sparkles, Image as ImageIcon, X, ChevronDown, ChevronUp } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function ModelTrainingPage() {
  const [files, setFiles] = useState([])
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [error, setError] = useState('')
  const [isTraining, setIsTraining] = useState(false)
  const [useCase, setUseCase] = useState('dating')
  const [gender, setGender] = useState('female')
  const [showMore, setShowMore] = useState(false)

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles].slice(0, 20))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'image/*': ['.jpeg', '.jpg', '.png', '.gif']},
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const handleStartTraining = async () => {
    if (files.length < 10) {
      setError('Please upload at least 10 images before starting the training.')
      return
    }

    setIsTraining(true)
    setError('')

    try {
      // Simulate training process
      for (let i = 0; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setTrainingProgress(i)
      }

      console.log('Training completed. Redirecting to prompt page...')
    } catch (err) {
      setError('An error occurred during training. Please try again.')
    } finally {
      setIsTraining(false)
    }
  }

  const handleDeleteImage = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 space-y-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Model Training</CardTitle>
              <CardDescription>Train your AI model to generate personalized profile images</CardDescription>
            </CardHeader>
          </Card>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Image Purpose</CardTitle>
              <CardDescription>Choose whether to optimize for dating or professional profile images</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="dating" onValueChange={setUseCase}>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-2 border rounded-md p-2 flex-1">
                    <RadioGroupItem value="dating" id="dating" />
                    <Label htmlFor="dating">Dating</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 flex-1">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Professional</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Gender</CardTitle>
              <CardDescription>Tell us your gender to optimize the model training</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="female" onValueChange={setGender}>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-2 border rounded-md p-2 flex-1">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 flex-1">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Upload at least 10 images to train the model. 20 images will provide better results.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Drag & drop images here, or click to select files</p>
                <p className="text-sm text-gray-500 mt-2">
                  (Max 5MB per image, JPEG, PNG, or GIF)
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {files.length} images uploaded
              </p>
              <p className="text-xs text-gray-400">
                Min 10 images (20 images is recommended)
              </p>
            </CardContent>
          </Card>

          <Card className="max-w-2xl mx-auto lg:hidden">
            <CardHeader>
              <CardTitle>My Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="relative aspect-square">
                    {index < files.length ? (
                      <>
                        <Image
                          src={URL.createObjectURL(files[index])}
                          alt={`Uploaded image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {files.length > 3 && (
                <p className="text-sm text-gray-500 mt-4">
                  Plus {files.length - 3} more images
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="max-w-2xl mx-auto">
            <CardContent>
              {isTraining && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Training in progress...</p>
                  <Progress value={trainingProgress} className="h-2" />
                </div>
              )}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleStartTraining}
                disabled={files.length < 10 || isTraining}
                className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isTraining ? 'Training...' : 'Start Training (350 credits)'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 hidden lg:block">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>My Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="relative aspect-square">
                    {index < files.length ? (
                      <>
                        <Image
                          src={URL.createObjectURL(files[index])}
                          alt={`Uploaded image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {files.length > 10 && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Hide {files.length - 10} more images
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show {files.length - 10} more images
                    </>
                  )}
                </Button>
              )}
              {showMore && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {files.slice(10).map((file, index) => (
                    <div key={index + 10} className="relative aspect-square">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded image ${index + 11}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                      <button
                        onClick={() => handleDeleteImage(index + 10)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}