import React from 'react';

interface AppEmbedProps {
    appUrl: string;
    width?: string;
    height?: string;
    title: string; // Make required for accessibility
}

const AppEmbed: React.FC<AppEmbedProps> = ({ appUrl, width = '100%', height = '500px', title }) => {
    return (
        <iframe 
            src={appUrl} 
            width={width} 
            height={height} 
            style={{ border: 'none' }} 
            title={`Interactive demo: ${title}`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
        />
    );
};

export default AppEmbed;