// @/components/Projects/hooks/useProjectShare.ts
import { useState } from 'react'
import { Project } from '@/data/types.data' // Import your actual Project type

export function useProjectShare(project: Project | null) {
  const [shareClicked, setShareClicked] = useState(false)

  const getShareText = () => {
    if (!project) return ''
    return project.description
      ? `Check out ${project.title}: ${project.description.slice(0, 100)}...`
      : `Check out my project: ${project.title}`
  }

  const handleShare = async () => {
    console.log(project)
    if (!project) return

    const projectUrl = window.location.href;
    const shareText = getShareText()

    const shareData = {
      title: project.title,
      text: shareText,
      url: projectUrl,
    }

    try {
      // Try native Web Share API first
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        return
      }

      // Fallback to clipboard
      await copyToClipboard(projectUrl)
    } catch (error) {
      console.error('Error sharing:', error)
      await copyToClipboard(projectUrl)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setShareClicked(true)
      setTimeout(() => {
        setShareClicked(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return {
    handleShare,
    shareClicked,
    getShareText,
    copyToClipboard,
  }
}
