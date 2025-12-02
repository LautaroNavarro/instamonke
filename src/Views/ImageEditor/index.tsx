import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const ImageContainer = styled.div<{
  backgroundImage: string
  calculatedWidth: number
  calculatedHeight: number
}>`
  width: ${props => props.calculatedWidth}px;
  height: ${props => props.calculatedHeight}px;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  background-image: url(${props => props.backgroundImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const EditorScreen = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const EditorHeader = styled.div`
  margin-top: 40px;
  margin-left: 40px;
  margin-right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const EditorActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props =>
    props.variant === 'primary'
      ? `
    color: #184624;
    background-color: #F3EFCD;

    &:hover:not(:disabled) {
      box-shadow: 0 0px 15px #F3EFCD;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
      : `
    background: transparent;
    border: 1px solid #F3EFCD;
    color: #F3EFCD;

    &:hover {
      background: #f3efcd95;
    }
  `}

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem;
  }
`

const ButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`

const ButtonImage = styled.img`
  display: none;
  width: 24px;
  height: 24px;
  object-fit: contain;

  @media (max-width: 768px) {
    display: block;
  }
`

const ImageContainerWrapper = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ImageContainerOver = styled.div`
  position: relative;
  overflow: hidden;
`

const PlacementContainer = styled.div<{ isSelected?: boolean }>`
  position: absolute;
  cursor: move;
  z-index: ${props => (props.isSelected ? 20 : 10)};
  transition: transform 0.1s ease-out;
`

const PlacementImage = styled.img<{ isSelected?: boolean }>`
  display: block;
  user-select: none;
  pointer-events: none;
  filter: ${props =>
    props.isSelected
      ? 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.6)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
      : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'};
`

const ResizeHandle = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  background: #667eea;
  border: 2px solid white;
  border-radius: 50%;
  cursor: nwse-resize;
  z-index: 21;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #764ba2;
    transform: scale(1.1);
  }
`

const DeleteButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background: #ff4444;
  user-select: none;
  border: 2px solid white;
  border-radius: 50%;
  color: white;
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  z-index: 21;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 0;

  &:hover {
    background: #cc0000;
    transform: scale(1.1);
  }
`

const DragHandle = styled.div<{ isSelected?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  cursor: move;
  z-index: 19;
  border: 2px dashed ${props => (props.isSelected ? 'rgba(102, 126, 234, 0.5)' : 'transparent')};
  border-radius: 4px;
  pointer-events: ${props => (props.isSelected ? 'auto' : 'none')};
`

const SpinningBanana = styled.img`
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  z-index: 100;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: #184624;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
`

const ModalText = styled.p`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`

const ModalTextSubtle = styled.p`
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #f3efcd;
  border-radius: 8px;
  background: transparent;
  color: #f3efcd;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;

  &:hover {
    background: #f3efcd;
    color: #184624;
  }
`

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #f3efcd;
  border-radius: 8px;
  background: rgba(243, 239, 205, 0.1);
  color: #f3efcd;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(243, 239, 205, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #f3efcd;
    background: rgba(243, 239, 205, 0.15);
  }
`

const ModalSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #f3efcd;
  border-radius: 8px;
  background: rgba(243, 239, 205, 0.1);
  color: #f3efcd;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f3efcd;
    background: rgba(243, 239, 205, 0.15);
  }

  option {
    background: #184624;
    color: #f3efcd;
  }
`

const ModalLabel = styled.label`
  display: block;
  color: #f3efcd;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
`

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const ModalButtonSecondary = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #f3efcd;
  border-radius: 8px;
  background: transparent;
  color: #f3efcd;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;

  &:hover {
    background: rgba(243, 239, 205, 0.1);
  }
`

const ModalButtonPrimary = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #f3efcd;
  border-radius: 8px;
  background: #f3efcd;
  color: #184624;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;

  &:hover:not(:disabled) {
    background: rgba(243, 239, 205, 0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ModalFormContent = styled.div`
  text-align: left;
`

const ImageEditor = ({
  uploadedImage,
  onReset,
}: {
  uploadedImage: string
  onReset: () => void
}) => {
  const [placements, setPlacements] = useState<
    {
      xRatio: number
      yRatio: number
      scale: number
      sizeRatio: number
      monkeNumber: string
      monkeImageNoBg: string
    }[]
  >([])
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [calculatedWidth, setCalculatedWidth] = useState<number>(0)
  const [calculatedHeight, setCalculatedHeight] = useState<number>(0)
  const [aspectRatio, setAspectRatio] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFollowModal, setShowFollowModal] = useState<boolean>(false)
  const [showInputModal, setShowInputModal] = useState<boolean>(false)
  const [showMissingMonkeModal, setShowMissingMonkeModal] = useState<boolean>(false)
  const [pendingClickPosition, setPendingClickPosition] = useState<{ x: number; y: number } | null>(
    null
  )
  const [monkeNumberInput, setMonkeNumberInput] = useState<string>('')
  const [generation, setGeneration] = useState<string>('Generation 3')

  const [dragState, setDragState] = useState<{
    isDragging: boolean
    isResizing: boolean
    placementIndex: number
    startX: number
    startY: number
    startXRatio: number
    startYRatio: number
    startSizeRatio: number
  } | null>(null)
  const justFinishedDragRef = useRef<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const getImageDimensions = (
    base64Image: string
  ): Promise<{ width: number; height: number; aspectRatio: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        })
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = base64Image
    })
  }

  const calculateSize = (aspectRatio: number): { width: number; height: number } => {
    const availableWidth = window.innerWidth * 0.8
    const availableHeight = window.innerHeight * 0.8
    let width = availableWidth
    let height = availableWidth / aspectRatio

    if (height > availableHeight) {
      height = availableHeight
      width = availableHeight * aspectRatio
    }

    return { width, height }
  }

  useEffect(() => {
    ;(async () => {
      const imageDimensions = await getImageDimensions(uploadedImage)
      setAspectRatio(imageDimensions.aspectRatio)
      const { width, height } = calculateSize(imageDimensions.aspectRatio)
      setCalculatedWidth(width)
      setCalculatedHeight(height)
    })()
  }, [uploadedImage])

  useEffect(() => {
    if (aspectRatio === 0) return

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(() => {
        const { width, height } = calculateSize(aspectRatio)
        setCalculatedWidth(width)
        setCalculatedHeight(height)
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [aspectRatio])

  const deletePlacement = useCallback(
    (index: number) => {
      setPlacements(prev => prev.filter((_, idx) => idx !== index))
      if (selectedIndex === index) {
        setSelectedIndex(null)
      } else if (selectedIndex !== null && selectedIndex > index) {
        setSelectedIndex(selectedIndex - 1)
      }
    },
    [selectedIndex]
  )

  const handleMouseDown = (e: React.MouseEvent, index: number, isResizeHandle: boolean = false) => {
    e.stopPropagation()

    if (e.button === 2) {
      e.preventDefault()
      deletePlacement(index)
      return
    }

    if (calculatedWidth === 0 || calculatedHeight === 0) return

    const rect = imageContainerRef.current?.getBoundingClientRect()
    if (!rect) return

    const placement = placements[index]
    if (!placement) return

    setSelectedIndex(index)
    setDragState({
      isDragging: !isResizeHandle,
      isResizing: isResizeHandle,
      placementIndex: index,
      startX: e.clientX,
      startY: e.clientY,
      startXRatio: placement.xRatio,
      startYRatio: placement.yRatio,
      startSizeRatio: placement.sizeRatio,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState || calculatedWidth === 0 || calculatedHeight === 0) return

      const rect = imageContainerRef.current?.getBoundingClientRect()
      if (!rect) return

      const deltaX = e.clientX - dragState.startX
      const deltaY = e.clientY - dragState.startY

      if (dragState.isDragging) {
        const deltaXRatio = deltaX / calculatedWidth
        const deltaYRatio = deltaY / calculatedHeight

        setPlacements(prev =>
          prev.map((placement, idx) =>
            idx === dragState.placementIndex
              ? {
                  ...placement,
                  xRatio: dragState.startXRatio + deltaXRatio,
                  yRatio: dragState.startYRatio + deltaYRatio,
                }
              : placement
          )
        )
      } else if (dragState.isResizing) {
        const minDimension = Math.min(calculatedWidth, calculatedHeight)
        const avgDelta = (deltaX + deltaY) / 2
        const deltaRatio = avgDelta / minDimension

        const newSizeRatio = Math.max(0.01, dragState.startSizeRatio + deltaRatio)

        setPlacements(prev =>
          prev.map((placement, idx) =>
            idx === dragState.placementIndex
              ? {
                  ...placement,
                  sizeRatio: newSizeRatio,
                }
              : placement
          )
        )
      }
    },
    [dragState, calculatedWidth, calculatedHeight]
  )

  const handleMouseUp = useCallback(() => {
    if (dragState) {
      setSelectedIndex(dragState.placementIndex)
      justFinishedDragRef.current = true
      setTimeout(() => {
        justFinishedDragRef.current = false
      }, 100)
    }
    setDragState(null)
  }, [dragState])

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState, handleMouseMove, handleMouseUp])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIndex !== null) {
        e.preventDefault()
        deletePlacement(selectedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, deletePlacement])

  const handleReset = () => {
    setPlacements([])
    setSelectedIndex(null)
    onReset()
  }

  const handleDownload = async () => {
    if (!uploadedImage || placements.length === 0) return

    setIsLoading(true)

    try {
      const imageDimensions = await getImageDimensions(uploadedImage)
      const naturalWidth = imageDimensions.width
      const naturalHeight = imageDimensions.height
      const naturalAspectRatio = imageDimensions.aspectRatio

      const { width: displayWidth, height: displayHeight } = calculateSize(naturalAspectRatio)

      const canvas = document.createElement('canvas')
      canvas.width = naturalWidth
      canvas.height = naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      const baseImg = new Image()
      baseImg.src = uploadedImage
      await new Promise((resolve, reject) => {
        baseImg.onload = resolve
        baseImg.onerror = reject
      })
      ctx.drawImage(baseImg, 0, 0)

      for (const placement of placements) {
        const monkeImg = new Image()
        monkeImg.crossOrigin = 'anonymous'
        monkeImg.src = placement.monkeImageNoBg

        await new Promise(resolve => {
          monkeImg.onload = () => {
            const x = placement.xRatio * naturalWidth
            const y = placement.yRatio * naturalHeight

            const scale = naturalWidth / displayWidth
            const minDisplayDimension = Math.min(displayWidth, displayHeight)
            const size = placement.sizeRatio * minDisplayDimension * scale

            const monkeAspectRatio = monkeImg.width / monkeImg.height
            const drawWidth = size
            const drawHeight = size / monkeAspectRatio

            ctx.save()
            ctx.drawImage(monkeImg, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight)
            ctx.restore()
            resolve(undefined)
          }
          monkeImg.onerror = () => {
            console.error('Failed to load monke image:', placement.monkeImageNoBg)
            resolve(undefined)
          }
        })
      }

      canvas.toBlob(blob => {
        if (!blob) {
          throw new Error('Failed to create blob')
        }

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'monke-masked-image.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setShowFollowModal(true)
      })
    } catch (err) {
      console.error('Failed to download image:', err)
      alert('Failed to download image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    if (dragState || justFinishedDragRef.current) return

    if (selectedIndex !== null) return

    if (calculatedWidth === 0 || calculatedHeight === 0) return

    const rect = imageContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    let clickedMonkeIndex: number | null = null
    placements.forEach((placement, index) => {
      const x = placement.xRatio * calculatedWidth
      const y = placement.yRatio * calculatedHeight
      const minDimension = Math.min(calculatedWidth, calculatedHeight)
      const size = placement.sizeRatio * minDimension
      const halfSize = size / 2

      if (
        clickX >= x - halfSize &&
        clickX <= x + halfSize &&
        clickY >= y - halfSize &&
        clickY <= y + halfSize
      ) {
        clickedMonkeIndex = index
      }
    })

    if (clickedMonkeIndex !== null) {
      setSelectedIndex(clickedMonkeIndex)
      return
    }

    setPendingClickPosition({ x: clickX, y: clickY })
    setMonkeNumberInput('')
    setGeneration('Generation 3')
    setShowInputModal(true)
  }

  const handlePlacementClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setSelectedIndex(index)
  }

  const handleInputModalSubmit = async () => {
    if (!monkeNumberInput.trim() || !pendingClickPosition) {
      return
    }

    setShowInputModal(false)
    setIsLoading(true)

    try {
      const monkeNoBgUrl = `/monkes/gen3/${monkeNumberInput.trim()}.png`

      const xRatio = pendingClickPosition.x / calculatedWidth
      const yRatio = pendingClickPosition.y / calculatedHeight

      const minDimension = Math.min(calculatedWidth, calculatedHeight)
      const size = (calculatedHeight * calculatedWidth) / 100
      const sizeRatio = Math.sqrt(size) / minDimension

      setPlacements([
        ...placements,
        {
          xRatio,
          yRatio,
          scale: 1,
          sizeRatio,
          monkeNumber: monkeNumberInput.trim(),
          monkeImageNoBg: monkeNoBgUrl,
        },
      ])
      setPendingClickPosition(null)
      setMonkeNumberInput('')
    } catch (err) {
      console.error('Failed to load monke:', err)
      alert('Failed to load monke image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputModalCancel = () => {
    setShowInputModal(false)
    setPendingClickPosition(null)
    setMonkeNumberInput('')
  }

  return (
    <>
      <EditorScreen>
        <EditorHeader>
          <img src="/logo.png" alt="Logo" style={{ width: '200px' }} />
          <EditorActions>
            <Button variant="secondary" onClick={() => setShowMissingMonkeModal(true)}>
              <ButtonImage src="/exclamation.png" alt="Missing monkey" />
              <ButtonText>Missing monke?</ButtonText>
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <ButtonImage src="/reload.png" alt="Reset" />
              <ButtonText>Reset</ButtonText>
            </Button>
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={placements.length === 0 || isLoading}
            >
              <ButtonImage src="/download.png" alt="Download Image" />
              <ButtonText>Download Image</ButtonText>
            </Button>
          </EditorActions>
        </EditorHeader>
        <ImageContainerWrapper>
          <ImageContainerOver
            onClick={() => {
              if (!justFinishedDragRef.current) {
                setSelectedIndex(null)
              }
            }}
          >
            <ImageContainer
              calculatedWidth={calculatedWidth}
              calculatedHeight={calculatedHeight}
              backgroundImage={uploadedImage}
              ref={imageContainerRef}
              onClick={handleImageClick}
              style={{
                cursor: isLoading ? 'wait' : selectedIndex !== null ? 'default' : 'crosshair',
                pointerEvents: selectedIndex !== null ? 'none' : 'auto',
              }}
            />
            {placements.map((placement, index) => {
              const x = placement.xRatio * calculatedWidth
              const y = placement.yRatio * calculatedHeight
              const minDimension = Math.min(calculatedWidth, calculatedHeight)
              const size = placement.sizeRatio * minDimension
              const isSelected = selectedIndex === index

              return (
                <PlacementContainer
                  key={index}
                  isSelected={isSelected}
                  style={{
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={e => handlePlacementClick(e, index)}
                >
                  <PlacementImage
                    src={placement.monkeImageNoBg}
                    alt={`Monke ${placement.monkeNumber}`}
                    isSelected={isSelected}
                    draggable={false}
                    style={{
                      width: size,
                      height: size,
                      objectFit: 'contain',
                    }}
                  />
                  {isSelected && (
                    <>
                      <ResizeHandle
                        onMouseDown={e => handleMouseDown(e, index, true)}
                        onContextMenu={e => {
                          e.preventDefault()
                          deletePlacement(index)
                        }}
                        title="Resize"
                      />
                      <DeleteButton
                        onClick={e => {
                          e.stopPropagation()
                          deletePlacement(index)
                        }}
                        onMouseDown={e => e.stopPropagation()}
                        title="Delete"
                        aria-label="Delete monke"
                      >
                        ×
                      </DeleteButton>
                      <DragHandle
                        isSelected={isSelected}
                        onMouseDown={e => handleMouseDown(e, index, false)}
                        title="Drag to move"
                      />
                    </>
                  )}
                </PlacementContainer>
              )
            })}
          </ImageContainerOver>
        </ImageContainerWrapper>
      </EditorScreen>
      {isLoading && (
        <LoadingOverlay>
          <SpinningBanana src="/banana.png" alt="Loading..." />
        </LoadingOverlay>
      )}
      {showFollowModal && (
        <ModalOverlay onClick={() => setShowFollowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalText>Thanks for using InstaMonke!</ModalText>
            <ModalTextSubtle>
              If it helped, follow me on X to stay updated with new features.
            </ModalTextSubtle>
            <ModalButton onClick={() => window.open('https://x.com/lautaroweb3', '_blank')}>
              Open X account
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
      {showInputModal && (
        <ModalOverlay onClick={handleInputModalCancel}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalText>Add SMB Monke</ModalText>
            <ModalFormContent>
              <ModalLabel htmlFor="generation">Generation</ModalLabel>
              <ModalSelect
                id="generation"
                value={generation}
                onChange={e => setGeneration(e.target.value)}
              >
                <option value="Generation 3">Generation 3</option>
              </ModalSelect>
              <ModalLabel htmlFor="monke-number">SMB Monke Number</ModalLabel>
              <ModalInput
                id="monke-number"
                type="text"
                placeholder="Enter the SMB Monke number"
                value={monkeNumberInput}
                onChange={e => setMonkeNumberInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleInputModalSubmit()
                  } else if (e.key === 'Escape') {
                    handleInputModalCancel()
                  }
                }}
                autoFocus
              />
              <ModalButtonGroup>
                <ModalButtonSecondary onClick={handleInputModalCancel}>Cancel</ModalButtonSecondary>
                <ModalButtonPrimary
                  onClick={handleInputModalSubmit}
                  disabled={!monkeNumberInput.trim()}
                >
                  Add Monke
                </ModalButtonPrimary>
              </ModalButtonGroup>
            </ModalFormContent>
          </ModalContent>
        </ModalOverlay>
      )}
      {showMissingMonkeModal && (
        <ModalOverlay onClick={() => setShowMissingMonkeModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalText>Help us complete the collection!</ModalText>
            <ModalTextSubtle>
              This is an open source project. If you find a missing monke, please create an issue in
              the GitHub repository or create a pull request.
            </ModalTextSubtle>
            <ModalButton onClick={() => window.open('https://github.com/LautaroNavarro/instamonke', '_blank')}>
              Open Repository
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  )
}

export default ImageEditor
