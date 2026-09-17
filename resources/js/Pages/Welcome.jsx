import Contact from '@/Components/Portfolio/Contact';
import CoursesTeaser from '@/Components/Portfolio/CoursesTeaser';
import Hero from '@/Components/Portfolio/Hero';
import PortfolioFooter from '@/Components/Portfolio/PortfolioFooter';
import PortfolioNav from '@/Components/Portfolio/PortfolioNav';
import Projects from '@/Components/Portfolio/Projects';
import Skills from '@/Components/Portfolio/Skills';
import Stats from '@/Components/Portfolio/Stats';
import { profile } from '@/Data/portfolio';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title={`${profile.name} — بورتفوليو شخصي`}>
                <meta
                    name="description"
                    content={profile.bio}
                />
            </Head>

            <div className="bg-white dark:bg-gray-900">
                <PortfolioNav />
                <Hero />
                <Stats />
                <Skills />
                <Projects />
                <CoursesTeaser />
                <Contact />
                <PortfolioFooter />
            </div>
        </>
    );
}
