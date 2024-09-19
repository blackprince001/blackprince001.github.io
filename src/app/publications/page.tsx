import { Metadata } from 'next'
import PublicationShowcase from '../(main)/components/publications'


export const metadata: Metadata = {
  title: 'Publications',
  description: 'Publications made in name of Prince Kwabena Appiah Boadu',
}

export default function Page() {
  return <PublicationShowcase />
}