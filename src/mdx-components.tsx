import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import MeshRender from './components/graphics/render'
import 'katex/dist/katex.css'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
        <Image
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          {...(props as ImageProps)}
        />
      ),
    MeshRender,
    ...components,
  }
}