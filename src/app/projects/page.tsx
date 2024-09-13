import { Metadata } from 'next'
import ProjectShowcase from '../(main)/components/projects'


export const metadata: Metadata = {
  title: 'blackprince001 - Projects',
  description: 'Portfolio of open-source projects',
}

export default function Page() {
  return <ProjectShowcase />
}