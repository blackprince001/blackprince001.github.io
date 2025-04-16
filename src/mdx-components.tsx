import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import MeshRenderSwitch from './components/graphics/render'
import { HelloFx, InequalitiesExample, Sigmoid } from './components/maths/graphing'
import ImageGrid from './components/ui/image-grid'
import BlogSuggestion from './components/ui/blog-suggested'
import Sidenote, { AutoNumberedSidenote } from './components/ui/sidenotes'
import 'katex/dist/katex.css'
import Quiz from './components/quiz/quiz'
import PreviewLink from "./components/ui/linked-previews"
import RustRunner from './components/code-runner/rust'


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    Sidenote,
    AutoNumberedSidenote,
    MeshRenderSwitch,
    BlogSuggestion,
    ImageGrid,
    HelloFx,
    InequalitiesExample,
    Sigmoid,
    Quiz,
    PreviewLink,
    RustRunner,
    ...components,
  }
}