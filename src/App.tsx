import { useState } from 'react'
import ImageLoader from './Views/ImageLoader'
import ImageEditor from './Views/ImageEditor/index'

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
  }

  const handleReset = () => {
    setUploadedImage(null)
  }

  if (!uploadedImage) {
    return <ImageLoader onImageUpload={handleImageUpload} />
  }

  return <ImageEditor uploadedImage={uploadedImage} onReset={handleReset} />
}

export default App
