import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import MeshRenderSwitch from './components/graphics/render'
import { HelloFx, InequalitiesExample, Sigmoid } from './components/maths/graphing'
import ImageGrid from './components/ui/image-grid'
import BlogSuggestion from './components/ui/blog-suggested'
import { MarginNoteMarker, AutoNumberedMarginNote } from './components/ui/margin-notes'
import 'katex/dist/katex.css'
import Quiz from './components/quiz/quiz'
import PreviewLink from "./components/ui/linked-previews"
import RustRunner from './components/code-runner/rust'
import GoRunner from './components/code-runner/golang'
import CodeSnippet from './components/code-runner/code-snippet'


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    Sidenote: MarginNoteMarker,
    AutoNumberedSidenote: AutoNumberedMarginNote,
    MarginNoteMarker,
    AutoNumberedMarginNote,
    MeshRenderSwitch,
    BlogSuggestion,
    ImageGrid,
    HelloFx,
    InequalitiesExample,
    Sigmoid,
    Quiz,
    PreviewLink,
    RustRunner,
    GoRunner,
    CodeSnippet,
    ...components,
  }
}