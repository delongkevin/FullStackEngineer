import React from 'react';

interface AppEmbedProps {
    appUrl: string;
    width?: string;
    height?: string;
}

const AppEmbed: React.FC<AppEmbedProps> = ({ appUrl, width = '100%', height = '500px' }) => {
    return (
        <iframe 
            src={appUrl} 
            width={width} 
            height={height} 
            style={{ border: 'none' }} 
            title="Embedded Application"
        />
    );
};

export default AppEmbed;