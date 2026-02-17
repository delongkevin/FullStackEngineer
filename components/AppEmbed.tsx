import React from 'react';

interface AppEmbedProps {
    appUrl: string;
    width?: string;
    height?: string;
    title?: string;
}

const AppEmbed: React.FC<AppEmbedProps> = ({ appUrl, width = '100%', height = '500px', title = 'Embedded Application' }) => {
    return (
        <iframe 
            src={appUrl} 
            width={width} 
            height={height} 
            style={{ border: 'none' }} 
            title={title}
            aria-label={title}
        />
    );
};

export default AppEmbed;