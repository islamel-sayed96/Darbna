// كل محتوى صفحة البورتفوليو الشخصية في مكان واحد — عدّل هنا بدل ما تدور
// جوه الكومبوننتس. غيّر اسمك وصورتك وروابطك وخبراتك من هنا.

export const profile = {
    name: 'إسلام سيد',
    roles: [
        'مطوّر Front-End',
        'مطوّر Back-End',
        'مصمم UI/UX',
        'متخصص تسويق رقمي و SEO',
        'مصمم مواقع',
        'خبير تجارة إلكترونية',
    ],
    bio: 'بصمم وبطوّر منتجات ويب متكاملة من الفكرة للإطلاق — واجهات سريعة وواضحة، باك إند قوي وآمن، وتجربة استخدام بتحول الزوار لعملاء. وبجانب كده بقدّم دورات تدريبية عملية بشارك فيها كل خبرتي في البرمجة والتصميم والتسويق.',
    email: 'contact@darbna.test',
    whatsapp: 'https://wa.me/201000000000',
    social: {
        github: 'https://github.com/islamel-sayed96',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        youtube: 'https://youtube.com',
    },
};

export const stats = [
    { value: 5, suffix: '+', label: 'سنوات خبرة' },
    { value: 40, suffix: '+', label: 'مشروع منجز' },
    { value: 1200, suffix: '+', label: 'طالب' },
    { value: 15, suffix: '+', label: 'دورة تدريبية' },
];

export const skills = [
    {
        icon: 'Code2',
        title: 'Front-End Development',
        desc: 'واجهات React سريعة، متجاوبة، وبمعايير Accessibility وأداء عالي.',
    },
    {
        icon: 'Server',
        title: 'Back-End Development',
        desc: 'أنظمة Laravel/PHP قوية، APIs آمنة، وقواعد بيانات مصممة كويس.',
    },
    {
        icon: 'PenTool',
        title: 'UI/UX Design',
        desc: 'تصميم تجربة استخدام مدروسة من الـ wireframe للـ prototype النهائي.',
    },
    {
        icon: 'TrendingUp',
        title: 'التسويق الرقمي و SEO',
        desc: 'استراتيجيات تسويق محتوى وتحسين ظهور في محركات البحث بنتائج قابلة للقياس.',
    },
    {
        icon: 'LayoutTemplate',
        title: 'تصميم مواقع',
        desc: 'مواقع تعريفية وهبوط (Landing Pages) بتصميم عصري وهوية بصرية مميزة.',
    },
    {
        icon: 'ShoppingCart',
        title: 'التجارة الإلكترونية',
        desc: 'متاجر إلكترونية متكاملة من بوابات الدفع للشحن لإدارة المخزون.',
    },
];

export const projects = [
    {
        title: 'دربنا — منصة كورسات أونلاين',
        desc: 'منصة تعليمية متكاملة: كورسات فيديو، اختبارات تفاعلية، شهادات، حصص مباشرة، واشتراكات — مبنية بـ Laravel و React.',
        tags: ['Laravel', 'React', 'Inertia.js', 'Tailwind'],
        gradient: 'from-brand-500 to-brand-800',
        href: '/courses',
        cta: 'تصفح المنصة',
    },
    {
        title: 'متجر إلكتروني متكامل',
        desc: 'متجر بتجربة شراء سلسة، بوابة دفع، وإدارة مخزون وطلبات من لوحة تحكم مخصصة.',
        tags: ['E-commerce', 'UI/UX', 'SEO'],
        gradient: 'from-accent-400 to-accent-700',
        href: '#',
        cta: 'عرض التفاصيل',
    },
    {
        title: 'هوية بصرية وحملة تسويقية',
        desc: 'تصميم هوية بصرية كاملة وإدارة حملة تسويق رقمي رفعت نسبة التحويل بشكل ملحوظ.',
        tags: ['Branding', 'Marketing', 'SEO'],
        gradient: 'from-slate-600 to-slate-900',
        href: '#',
        cta: 'عرض التفاصيل',
    },
];

export const subjects = [
    {
        title: 'HTML & CSS للمبتدئين',
        lessons: 24,
        quizzes: 6,
        hasMaterial: true,
    },
    {
        title: 'JavaScript من الصفر للاحتراف',
        lessons: 38,
        quizzes: 10,
        hasMaterial: true,
    },
    {
        title: 'React عملي',
        lessons: 30,
        quizzes: 8,
        hasMaterial: true,
    },
];
