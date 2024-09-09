import { Metadata } from 'next'
import ProjectShowcase from '../(main)/components/projects'


export const metadata: Metadata = {
  title: 'Your Name - Projects',
  description: 'Your portfolio of open-source projects',
}

export default function Page() {
  return <ProjectShowcase />
}