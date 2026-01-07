import React from 'react';
import { motion } from 'framer-motion';

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
                {sizes.map((size, index) => (
                    <motion.button
                        key={size.value}
                        className={`size-filter-pill ${activeSize === size.value ? 'active' : ''}`}
                        onClick={() => onSizeChange(size.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {size.label}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default SizeFilter;
