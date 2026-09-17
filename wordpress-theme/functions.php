<?php
/**
 * Essendaar Suppliers & Facility Care - WordPress Theme Functions
 * Package: Essendaar
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

function essendaar_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
}
add_action('after_setup_theme', 'essendaar_theme_setup');

function essendaar_enqueue_assets() {
    // Fonts & Tailwind
    wp_enqueue_style('essendaar-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap', array(), null);
    wp_enqueue_style('essendaar-icons', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..24,400..700,0..1,0&display=swap', array(), null);
    
    // Tailwind CSS CDN Script for instant high fidelity rendering
    wp_enqueue_script('tailwindcss', 'https://cdn.tailwindcss.com', array(), '3.4.1', false);
    
    // Theme stylesheet
    wp_enqueue_style('essendaar-theme-style', get_stylesheet_uri(), array(), '1.0.0');

    // Built Assets if available in theme assets/
    if (file_exists(get_template_directory() . '/assets/index.js')) {
        wp_enqueue_script('essendaar-bundle', get_template_directory_uri() . '/assets/index.js', array(), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'essendaar_enqueue_assets');

// Custom Currency Symbol (INR / ₹)
add_filter('woocommerce_currency_symbol', function($currency_symbol, $currency) {
    return ($currency === 'INR') ? '₹' : $currency_symbol;
}, 10, 2);
