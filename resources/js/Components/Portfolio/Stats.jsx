import { motion } from 'framer-motion';
import { stats } from '@/Data/portfolio';
import useCountUp from '@/Hooks/useCountUp';

function StatItem({ value, suffix, label, index }) {
    const { ref, value: current } = useCountUp(value);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
        >
            <p className="text-4xl font-extrabold text-white sm:text-5xl">
                {current}
                {suffix}
            </p>
            <p className="mt-2 text-sm font-medium text-brand-100">{label}</p>
        </motion.div>
    );
}

export default function Stats() {
    return (
        <section className="bg-gradient-to-l from-brand-700 to-brand-600 py-16">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
                {stats.map((s, i) => (
                    <StatItem key={s.label} index={i} {...s} />
                ))}
            </div>
        </section>
    );
}
