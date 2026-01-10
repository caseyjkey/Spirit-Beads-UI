import React from 'react';

interface SizeFilterProps {
    activeSize: string;
    onSizeChange: (size: string) => void;
}

const SizeFilter: React.FC<SizeFilterProps> = ({
    activeSize,
    onSizeChange
}) => {
    const sizes = [
        { value: 'all', label: 'All' },
        { value: 'classic', label: 'Classic BIC' },
        { value: 'mini', label: 'Mini BIC' }
    ];

    return (
        <div className="size-filter-container">
            <div className="size-filter-wrapper">
                {sizes.map((size) => (
                    <button
                        key={size.value}
                        className={`size-filter-pill ${activeSize === size.value ? 'active' : ''}`}
                        onClick={() => onSizeChange(size.value)}
                        type="button"
                    >
                        {size.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SizeFilter;
