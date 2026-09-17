<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600|cairo:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <meta name="description" content="بورتفوليو شخصي: تطوير Front-End و Back-End، تصميم UI/UX، تسويق رقمي و SEO، تصميم مواقع، وتجارة إلكترونية — بالإضافة لدورات تدريبية عملية عبر منصة دربنا.">
        <meta property="og:title" content="{{ config('app.name') }}">
        <meta property="og:description" content="مطوّر ومصمم متكامل، وصاحب منصة دربنا التعليمية.">
        <meta property="og:type" content="website">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
