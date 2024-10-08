import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import MeshRenderSwitch from './components/graphics/render'
import {HelloFx, InequalitiesExample} from './components/maths/graphing'
import ImageGrid from './components/ui/image-grid'
import 'katex/dist/katex.css'
import BlogSuggestion from './components/ui/blog-suggested'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
        <Image
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          {...(props as ImageProps)}
        />
      ),
    MeshRenderSwitch,
    BlogSuggestion,
    ImageGrid,
    HelloFx,
    InequalitiesExample,
    ...components,
  }
}