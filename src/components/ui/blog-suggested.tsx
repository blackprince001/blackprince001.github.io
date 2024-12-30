import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BlogSuggestionProps {
  title?: string;
  link?: string;
}

const BlogSuggestion: React.FC<BlogSuggestionProps> = ({
  title = "Related Post",
  link = ""
}) => {
  return (
    <div className='flex py-4 justify-center'>
    <Card className="bg-zinc-800 max-w-md">
      <CardContent className="p-4">
        <div className="flex items-start space-x-2">
          <div className="flex-grow px-8">
            <h3 className="text-white mb-2" style={{fontSize: 16}}>{title}</h3>
            <Link 
              href={link}
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center text-sm group"
            >
              Read More Here
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default BlogSuggestion;