import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

const MotionSection = ({ children, className, delay = 0, id }: MotionSectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 60 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default MotionSection;