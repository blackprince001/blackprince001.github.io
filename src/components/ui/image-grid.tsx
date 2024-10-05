import React from 'react';

interface ImageGridProps {
    srcs: string[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ srcs = [] }) => {
    if (srcs.length === 0) {
        return <p>No images available.</p>; // Display a message if no images are present
    }

    return (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
            {srcs.map((src, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={src}
                        alt={`Image ${index + 1}`}
                        width="600"
                        height="600"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;