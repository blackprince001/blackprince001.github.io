import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import MeshRenderSwitch from './components/graphics/render'
import STLRender from './components/graphics/stl'
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
    MeshRenderSwitch,
    STLRender,
    HelloFx,
    InequalitiesExample,
    ...components,
  }
}