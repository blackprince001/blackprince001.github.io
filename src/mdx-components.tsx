import type { MDXComponents } from 'mdx/types'
import 'katex/dist/katex.css'
import Image, { ImageProps } from 'next/image'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
        <Image
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          {...(props as ImageProps)}
        />
      ),
    ...components,
  }
}