interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    title?: string;
    content?: string;
}

const Card = ({ children, className = "", hoverable = true }: CardProps) => {
    return (
        <div className={`
            w-full rounded-2xl shadow-md/60 p-4 
            ${hoverable ? 'hover:scale-103' : ''} ${className}
            transition-all duration-300 relative group
            `}
        >
            {children}
        </div>
    );
};

export default Card;