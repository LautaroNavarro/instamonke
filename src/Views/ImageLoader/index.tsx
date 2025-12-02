import { useRef } from 'react'
import styled from 'styled-components'

const UploadScreen = styled.div`
  min-height: 100dvh;
  width: 100dvw;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UploadContainer = styled.div`
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 2rem;
  font-size: 1.1rem;
`

const UploadArea = styled.div`
  border: 3px dashed rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #f3efcd;
    transform: translateY(-2px);
  }
`

const UploadText = styled.p`
  margin: 0.5rem 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.1rem;
`

interface ImageLoaderProps {
  onImageUpload: (imageUrl: string) => void
}

export default function ImageLoader({ onImageUpload }: ImageLoaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = event => {
        onImageUpload(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <UploadScreen>
      <UploadContainer>
        <img src="/logo.png" alt="Logo" style={{ width: '200px' }} />
        <Subtitle>Add your monke to any picture</Subtitle>
        <UploadArea onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <img src="/image.png" alt="Logo" style={{ width: '100px' }} />
          <UploadText>Click to upload an image</UploadText>
        </UploadArea>
      </UploadContainer>
    </UploadScreen>
  )
}
