import { motion } from 'framer-motion';
import './Loader.css';

const Loader = ({ size = 'md', text = '' }) => {
  const sizeMap = { sm: 24, md: 40, lg: 56 };
  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className="loader-container">
      <motion.div
        className="loader-spinner"
        style={{ width: dim, height: dim }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 50 50" className="loader-svg">
          <circle cx="25" cy="25" r="20" fill="none" stroke="url(#loader-gradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray="80 200" />
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
