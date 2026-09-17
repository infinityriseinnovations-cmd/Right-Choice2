<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-[#f8f9ff] text-[#0A2540] antialiased selection:bg-[#00355f] selection:text-white'); ?>>
<?php wp_body_open(); ?>

<!-- Top Urgent Dispatch & Compliance Bar -->
<div class="bg-[#0A2540] text-white text-xs py-2 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span class="bg-[#006e2d] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                ISO 9001:2015
            </span>
            <span class="text-slate-300">
                Tamilnadu Test House Certified Formulation | Direct Chennai Factory Fulfillment
            </span>
        </div>
        <div class="flex items-center space-x-4 text-[11px] sm:text-xs text-slate-300">
            <a href="tel:+919787979757" class="hover:text-emerald-400 font-semibold transition-colors flex items-center gap-1">
                <span>Direct Desk: +91 97879 79757</span>
            </a>
            <span>•</span>
            <a href="mailto:essendaargroup@gmail.com" class="hover:text-sky-300 transition-colors">
                essendaargroup@gmail.com
            </a>
        </div>
    </div>
</div>

<!-- Main Sticky Header -->
<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        <!-- Logo -->
        <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A2540] to-[#00355f] flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                E
            </div>
            <div>
                <span class="font-headline font-black text-lg tracking-tight text-[#0A2540] block leading-none">
                    ESSENDAAR
                </span>
                <span class="text-[9px] font-bold uppercase tracking-widest text-[#006e2d] block mt-0.5">
                    Suppliers &amp; Facility Care
                </span>
            </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-700 font-headline">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-[#00355f] transition-colors">Home</a>
            <a href="<?php echo esc_url(home_url('/shop')); ?>" class="hover:text-[#00355f] transition-colors">Shop Catalog</a>
            <a href="<?php echo esc_url(home_url('/facility-management')); ?>" class="hover:text-[#00355f] transition-colors">Campus Facility</a>
            <a href="<?php echo esc_url(home_url('/manpower-support')); ?>" class="hover:text-[#00355f] transition-colors">Manpower Support</a>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="hover:text-[#00355f] transition-colors">B2B Procurement Desk</a>
        </nav>

        <!-- Right Quick Actions -->
        <div class="flex items-center space-x-3">
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="hidden sm:inline-flex items-center px-3.5 py-2 bg-[#eff4ff] text-[#00355f] hover:bg-[#dce9ff] text-xs font-bold rounded-xl border border-slate-200 transition-colors">
                Rate Sheet PDF
            </a>
            <a href="<?php echo function_exists('wc_get_cart_url') ? esc_url(wc_get_cart_url()) : esc_url(home_url('/cart')); ?>" class="relative p-2.5 rounded-xl bg-[#006e2d] hover:bg-[#14532D] text-white flex items-center justify-center transition-colors shadow-xs">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <?php if (function_exists('WC') && WC()->cart && WC()->cart->get_cart_contents_count() > 0) : ?>
                    <span class="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                        <?php echo esc_html(WC()->cart->get_cart_contents_count()); ?>
                    </span>
                <?php endif; ?>
            </a>
        </div>

    </div>
</header>
<main id="main-content" class="min-h-screen">
