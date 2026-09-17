import { motion } from 'framer-motion';
import { Mail, MessageCircle } from 'lucide-react';
import {
    GithubIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon,
} from '@/Components/Portfolio/SocialIcons';
import { profile } from '@/Data/portfolio';

const socialIcons = [
    { key: 'github', Icon: GithubIcon },
    { key: 'linkedin', Icon: LinkedinIcon },
    { key: 'twitter', Icon: TwitterIcon },
    { key: 'youtube', Icon: YoutubeIcon },
];

export default function Contact() {
    return (
        <section
            id="contact"
            className="bg-white py-24 dark:bg-gray-900"
        >
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">
                        تواصل معي
                    </h2>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        عندك مشروع أو فكرة؟ يلا نتكلم
                    </p>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        متاح لمشاريع الفريلانس، الاستشارات التقنية، وتصميم برامج
                        تدريبية مخصصة.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a
                            href={`mailto:${profile.email}`}
                            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500"
                        >
                            <Mail size={18} />
                            {profile.email}
                        </a>
                        <a
                            href={profile.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <MessageCircle size={18} />
                            واتساب
                        </a>
                    </div>

                    <div className="mt-10 flex justify-center gap-5">
                        {socialIcons.map(({ key, Icon }) => (
                            <a
                                key={key}
                                href={profile.social[key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:-translate-y-1 hover:bg-brand-600 hover:text-white dark:bg-gray-800 dark:text-gray-300"
                                aria-label={key}
                            >
                                <Icon className="h-[18px] w-[18px]" />
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
