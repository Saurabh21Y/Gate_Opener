'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useEffect } from 'react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

type ToolbarButton = {
  type: 'button';
  id: string;
  label: string;
  title: string;
  action: (editor: ReturnType<typeof useEditor>) => void;
  isActive?: (editor: ReturnType<typeof useEditor>) => boolean;
};

type ToolbarSeparator = { type: 'sep'; id: string };

const TOOLBAR_ITEMS: Array<ToolbarButton | ToolbarSeparator> = [
  {
    type: 'button',
    id: 'bold',
    label: 'B',
    title: 'Bold',
    action: (e) => e?.chain().focus().toggleBold().run(),
    isActive: (e) => !!e?.isActive('bold'),
  },
  {
    type: 'button',
    id: 'italic',
    label: 'I',
    title: 'Italic',
    action: (e) => e?.chain().focus().toggleItalic().run(),
    isActive: (e) => !!e?.isActive('italic'),
  },
  {
    type: 'button',
    id: 'underline',
    label: 'U',
    title: 'Underline',
    action: (e) => e?.chain().focus().toggleUnderline().run(),
    isActive: (e) => !!e?.isActive('underline'),
  },
  { type: 'sep', id: 'sep1' },
  {
    type: 'button',
    id: 'h1',
    label: 'H1',
    title: 'Heading 1',
    action: (e) => e?.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (e) => !!e?.isActive('heading', { level: 1 }),
  },
  {
    type: 'button',
    id: 'h2',
    label: 'H2',
    title: 'Heading 2',
    action: (e) => e?.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => !!e?.isActive('heading', { level: 2 }),
  },
  {
    type: 'button',
    id: 'h3',
    label: 'H3',
    title: 'Heading 3',
    action: (e) => e?.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => !!e?.isActive('heading', { level: 3 }),
  },
  { type: 'sep', id: 'sep2' },
  {
    type: 'button',
    id: 'ul',
    label: '• List',
    title: 'Bullet List',
    action: (e) => e?.chain().focus().toggleBulletList().run(),
    isActive: (e) => !!e?.isActive('bulletList'),
  },
  {
    type: 'button',
    id: 'ol',
    label: '1. List',
    title: 'Ordered List',
    action: (e) => e?.chain().focus().toggleOrderedList().run(),
    isActive: (e) => !!e?.isActive('orderedList'),
  },
  { type: 'sep', id: 'sep3' },
  {
    type: 'button',
    id: 'alignLeft',
    label: '⬅',
    title: 'Align Left',
    action: (e) => e?.chain().focus().setTextAlign('left').run(),
    isActive: (e) => !!e?.isActive({ textAlign: 'left' }),
  },
  {
    type: 'button',
    id: 'alignCenter',
    label: '⬛',
    title: 'Align Center',
    action: (e) => e?.chain().focus().setTextAlign('center').run(),
    isActive: (e) => !!e?.isActive({ textAlign: 'center' }),
  },
  {
    type: 'button',
    id: 'alignRight',
    label: '➡',
    title: 'Align Right',
    action: (e) => e?.chain().focus().setTextAlign('right').run(),
    isActive: (e) => !!e?.isActive({ textAlign: 'right' }),
  },
  { type: 'sep', id: 'sep4' },
  {
    type: 'button',
    id: 'undo',
    label: '↩',
    title: 'Undo',
    action: (e) => e?.chain().focus().undo().run(),
  },
  {
    type: 'button',
    id: 'redo',
    label: '↪',
    title: 'Redo',
    action: (e) => e?.chain().focus().redo().run(),
  },
];

export default function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none',
        style:
          'min-height: 600px; padding: 24px; background: white; color: #1a1a1a; font-family: system-ui, sans-serif; outline: none; border-radius: 0 0 8px 8px;',
      },
    },
  });

  // Sync external content changes (e.g. template switch)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          alignItems: 'center',
        }}
      >
        {TOOLBAR_ITEMS.map((item) => {
          if (item.type === 'sep') {
            return (
              <div
                key={item.id}
                style={{
                  width: '1px',
                  height: '20px',
                  background: 'rgba(255,255,255,0.1)',
                  margin: '0 4px',
                }}
              />
            );
          }
          const btn = item as ToolbarButton;
          const active = btn.isActive ? btn.isActive(editor) : false;
          return (
            <button
              key={btn.id}
              id={`tiptap-${btn.id}`}
              title={btn.title}
              onClick={() => btn.action(editor)}
              style={{
                background: active ? 'rgba(99,102,241,0.3)' : 'transparent',
                border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
                color: active ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
                padding: '4px 8px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: btn.id === 'bold' ? '700' : btn.id === 'italic' ? '400' : '500',
                fontStyle: btn.id === 'italic' ? 'italic' : 'normal',
                textDecoration: btn.id === 'underline' ? 'underline' : 'none',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                minWidth: '28px',
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
