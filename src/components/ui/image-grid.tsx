import React from 'react';

interface ImageGridProps {
    srcs: string[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ srcs = [] }) => {
    if (srcs.length === 0) {
        return <p>No images available.</p>; // Display a message if no images are present
    }

    return (
        <div>
        <div className="flex grid grid-cols-1 gap-2 lg:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {srcs.map((src, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={src}
                        alt={`Image ${index + 1}`}
                        className="object-cover justify-center transition-transform duration-300 w-full md:w-auto hover:scale-105"
                    />
                </div>
            ))}
        </div>
        </div>
    );
};

export default ImageGrid;