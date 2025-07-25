'use client'

import ReactMarkdown from 'react-markdown'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import HardBreak from '@tiptap/extension-hard-break'
import Code from '@tiptap/extension-code'
import Strike from '@tiptap/extension-strike'
import TextStyle from '@tiptap/extension-text-style'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'
import { Markdown } from 'tiptap-markdown'
import 'highlight.js/styles/github.css'
import { Button } from './ui/button'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  CornerDownLeft,
  FileCode,
  Image,
  Link,
  Undo,
  Redo,
  Download,
  ChevronDown,
  Eye,
  Edit3,
  Palette,
  Plus,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type DropdownMenuProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="h-9 px-3 hover:bg-gray-50 border-gray-200"
      >
        {trigger}
        <ChevronDown
          className={`ml-2 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[160px]">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  )
}

type DropdownItemProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  isActive: boolean
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2 text-sm hover:bg-gray-50 ${
      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
    }`}
  >
    <Icon className="h-4 w-4 mr-3" />
    {label}
  </button>
)

// Compact Tiptap Editor for Modals
export const TiptapModalEditor = ({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) => {
  const lowlight = createLowlight(common)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Strike,
      TextStyle,
      Code,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      HorizontalRule,
      HardBreak.configure({ keepMarks: false }),
      CodeBlockLowlight.configure({ lowlight }),
      CharacterCount.configure({ limit: 10000 }),
      Placeholder.configure({ placeholder: 'Start writing your description...' }),
      Markdown.configure({ html: true }),
    ],
    content: value || '',
  })

  useEffect(() => {
    if (!editor) return

    const updateContent = () => onChange(editor.storage.markdown.getMarkdown())
    editor.on('update', updateContent)

    return () => {
      editor.off('update', updateContent)
    }
  }, [editor, onChange])

  useEffect(() => {
    if (editor && value !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) return null

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const characterCount = editor.storage.characterCount.characters()
  const characterLimit = 10000

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* Compact Toolbar */}
      <div className="bg-card border-b border-border p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Basic formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('underline') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Headings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Lists */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Code */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('code') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Code2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('codeBlock') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <FileCode className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Quote */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 px-2 text-black dark:text-white hover:bg-accent/20 ${editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : ''}`}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-8 px-2 text-black dark:text-white hover:bg-accent/20"
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-8 px-2 text-black dark:text-white hover:bg-accent/20"
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>

          {/* Character count */}
          <div className="ml-auto text-xs text-black dark:text-white">
            {characterCount}/{characterLimit}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none" />
      </div>
    </div>
  )
}

// Original full Tiptap Editor (keeping for backward compatibility)
const TiptapEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const lowlight = createLowlight(common)
  const [preview, setPreview] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Strike,
      TextStyle,
      Code,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      HorizontalRule,
      HardBreak.configure({ keepMarks: false }),
      CodeBlockLowlight.configure({ lowlight }),
      CharacterCount.configure({ limit: 10000 }),
      Placeholder.configure({ placeholder: 'Start writing your markdown content...' }),
      Markdown.configure({ html: true }),
    ],
    content:
      '# Welcome to Your Markdown Editor\n\nStart creating beautiful content with **markdown** support!',
  })

  useEffect(() => {
    if (!editor) return

    const updateContent = () => onChange(editor.storage.markdown.getMarkdown())
    editor.on('update', updateContent)

    return () => {
      editor.off('update', updateContent)
    }
  }, [editor, onChange])

  if (!editor) return null

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const characterCount = editor.storage.characterCount.characters()
  const wordCount = editor.storage.characterCount.words()
  const characterLimit = 10000

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Format Dropdown */}
            <DropdownMenu
              trigger={
                <>
                  <Palette className="h-4 w-4" />
                  <span className="text-sm font-medium">Format</span>
                </>
              }
              isOpen={openDropdown === 'format'}
              onToggle={() => toggleDropdown('format')}
            >
              <DropdownItem
                icon={Bold}
                label="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
              />
              <DropdownItem
                icon={Italic}
                label="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
              />
              <DropdownItem
                icon={Underline}
                label="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
              />
              <DropdownItem
                icon={Strikethrough}
                label="Strikethrough"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
              />
              <DropdownItem
                icon={Code2}
                label="Inline Code"
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
              />
            </DropdownMenu>

            {/* Headings Dropdown */}
            <DropdownMenu
              trigger={
                <>
                  <Heading1 className="h-4 w-4" />
                  <span className="text-sm font-medium">Headings</span>
                </>
              }
              isOpen={openDropdown === 'headings'}
              onToggle={() => toggleDropdown('headings')}
            >
              <DropdownItem
                icon={Heading1}
                label="Heading 1"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
              />
              <DropdownItem
                icon={Heading2}
                label="Heading 2"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
              />
              <DropdownItem
                icon={Heading3}
                label="Heading 3"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
              />
            </DropdownMenu>

            {/* Insert Dropdown */}
            <DropdownMenu
              trigger={
                <>
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Insert</span>
                </>
              }
              isOpen={openDropdown === 'insert'}
              onToggle={() => toggleDropdown('insert')}
            >
              <DropdownItem
                icon={List}
                label="Bullet List"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
              />
              <DropdownItem
                icon={ListOrdered}
                label="Numbered List"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
              />
              <DropdownItem
                icon={Quote}
                label="Quote"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
              />
              <DropdownItem
                icon={FileCode}
                label="Code Block"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
              />
              <DropdownItem
                icon={Minus}
                label="Horizontal Rule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                isActive={false}
              />
              <DropdownItem
                icon={CornerDownLeft}
                label="Line Break"
                onClick={() => editor.chain().focus().setHardBreak().run()}
                isActive={false}
              />
              <DropdownItem
                icon={Image}
                label="Image"
                onClick={() => {
                  const url = prompt('Enter image URL:')
                  if (url) editor.chain().focus().setImage({ src: url }).run()
                }}
                isActive={false}
              />
              <DropdownItem
                icon={Link}
                label="Link"
                onClick={() => {
                  const url = prompt('Enter link URL:')
                  if (url) editor.chain().focus().setLink({ href: url }).run()
                }}
                isActive={editor.isActive('link')}
              />
            </DropdownMenu>

            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-3 ml-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                className="h-8 px-2"
                disabled={!editor.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                className="h-8 px-2"
                disabled={!editor.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2"
            >
              {preview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {preview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-6">
          {preview ? (
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{editor.storage.markdown.getMarkdown()}</ReactMarkdown>
            </div>
          ) : (
            <EditorContent editor={editor} className="prose prose-lg max-w-none" />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{characterCount} characters</span>
            <span>{wordCount} words</span>
            <span
              className={`${characterCount > characterLimit * 0.9 ? 'text-orange-600' : 'text-gray-600'}`}
            >
              {Math.round((characterCount / characterLimit) * 100)}% of limit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const markdown = editor.storage.markdown.getMarkdown()
                navigator.clipboard.writeText(markdown)
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Copy Markdown
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TiptapEditor
