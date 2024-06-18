import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import MeshRender from './components/graphics/render'
import {HelloFx, InequalitiesExample} from './components/maths/graphing'
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
    HelloFx,
    InequalitiesExample,
    ...components,
  }
}