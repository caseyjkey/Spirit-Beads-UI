import React from 'react';
import { motion } from 'framer-motion';

interface Category {
    slug: string;
    name: string;
}

interface CategoryPillsProps {
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({
    categories,
    activeCategory,
    onCategoryChange
}) => {
    return (
        <div className="category-scroll-container">
            <div className="category-wrapper">
                <motion.button
                    className={`collection-pill ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('all')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    All Collections
                </motion.button>
                {categories.map((cat) => (
                    <motion.button
                        key={cat.slug}
                        className={`pill ${activeCategory === cat.slug ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat.slug)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {cat.name}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default CategoryPills;
