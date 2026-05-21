import React from 'react';
import './Skeleton.scss';

/**
 * Skeleton Loader Component
 * A highly customizable placeholder for loading states.
 */
export const Skeleton = ({ 
    width, 
    height, 
    variant = 'rect', // 'rect', 'circle', 'rounded'
    className = '', 
    style = {},
    accent = false 
}) => {
    const classes = [
        'skeleton',
        variant === 'circle' ? 'skeleton--circle' : '',
        variant === 'rounded' ? 'skeleton--rounded' : '',
        accent ? 'skeleton--accent' : '',
        className
    ].filter(Boolean).join(' ');

    const inlineStyle = {
        width: width || '100%',
        height: height || '1rem',
        ...style
    };

    return <div className={classes} style={inlineStyle} />;
};

export default Skeleton;
