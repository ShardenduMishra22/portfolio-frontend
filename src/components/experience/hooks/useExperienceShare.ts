import { useState } from 'react'
import { Experience } from '@/data/types.data'

export function useExperienceShare(experience: Experience | null) {
  const [shareClicked, setShareClicked] = useState(false)
  const [copyClicked, setCopyClicked] = useState(false)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

  const handleCopyMarkdown = async () => {
    if (!experience) return

    const markdownContent = `# ${experience.position} at ${experience.company_name}

## Duration
${formatDate(experience.start_date)} - ${formatDate(experience.end_date)}

## Technologies Used
${experience.technologies.map((tech) => `- ${tech}`).join('\n')}

## Description
${experience.description}

${
  experience.certificate_url
    ? `## Certificate
- **Certificate:** ${experience.certificate_url}`
    : ''
}

---
*Generated from experience portfolio*`

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownContent)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = markdownContent
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback: Unable to copy', err)
        }
        document.body.removeChild(textArea)
      }
      setCopyClicked(true)
      setTimeout(() => setCopyClicked(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (!experience) return

    const experienceUrl = `${window.location.origin}/experiences/${experience.company_name}`
    const shareData = {
      title: `${experience.position} at ${experience.company_name}`,
      text: `Check out my experience: ${experience.position} at ${experience.company_name}`,
      url: experienceUrl,
    }

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(experienceUrl)
      setShareClicked(true)
      setTimeout(() => setShareClicked(false), 2000)
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return {
    handleShare,
    handleCopyMarkdown,
    shareClicked,
    copyClicked,
  }
}
