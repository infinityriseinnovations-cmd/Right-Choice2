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
    // Add title tag support
    add_theme_support('title-tag');

    // Add post thumbnails support
    add_theme_support('post-thumbnails');

    // Add WooCommerce support
    add_theme_support('woocommerce', array(
        'thumbnail_image_width' => 300,
        'single_image_width'    => 600,
        'product_grid'          => array(
            'default_rows'    => 4,
            'min_rows'        => 2,
            'max_rows'        => 8,
            'default_columns' => 4,
            'min_columns'     => 1,
            'max_columns'     => 4,
        ),
    ));
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Register navigation menus
    register_nav_menus(array(
        'primary-menu' => __('Primary Navigation Bar', 'essendaar'),
        'footer-brands' => __('Footer Brands Menu', 'essendaar'),
        'footer-services' => __('Footer Services Menu', 'essendaar'),
    ));

    // HTML5 markup support
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
}
add_action('after_setup_theme', 'essendaar_theme_setup');

/**
 * Enqueue scripts and styles
 */
function essendaar_enqueue_assets() {
    // Google Fonts: Plus Jakarta Sans & Manrope
    wp_enqueue_style('essendaar-fonts', 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap', array(), null);

    // Tailwind Play CDN / Compiled CSS
    wp_enqueue_style('essendaar-theme-style', get_stylesheet_uri(), array(), '1.0.0');

    // Lucide Icons
    wp_enqueue_script('lucide-icons', 'https://unpkg.com/lucide@latest', array(), null, true);

    // Custom Frontend Script
    wp_enqueue_script('essendaar-app', get_template_directory_uri() . '/assets/app.js', array('jquery'), '1.0.0', true);

    wp_localize_script('essendaar-app', 'essendaar_params', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('essendaar_nonce'),
        'cart_url' => function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/cart'),
        'checkout_url' => function_exists('wc_get_checkout_url') ? wc_get_checkout_url() : home_url('/checkout'),
    ));
}
add_action('wp_enqueue_scripts', 'essendaar_enqueue_assets');

/**
 * Custom Currency Symbol (INR / ₹)
 */
function essendaar_custom_currency_symbol($currency_symbol, $currency) {
    if ($currency === 'INR') {
        $currency_symbol = '₹';
    }
    return $currency_symbol;
}
add_filter('woocommerce_currency_symbol', 'essendaar_custom_currency_symbol', 10, 2);

/**
 * Add GST Number and Business Name Fields to WooCommerce Checkout
 */
function essendaar_custom_b2b_checkout_fields($fields) {
    $fields['billing']['billing_company']['label'] = __('Institution / Business Name (Optional)', 'essendaar');
    $fields['billing']['billing_company']['placeholder'] = __('e.g., SVS Matriculation School', 'essendaar');
    
    $fields['billing']['billing_gstin'] = array(
        'type'        => 'text',
        'label'       => __('GSTIN (For 18% GST Input Credit Tax Invoice)', 'essendaar'),
        'placeholder' => __('e.g., 33ABCDE1234F1Z5', 'essendaar'),
        'required'    => false,
        'class'       => array('form-row-wide'),
        'clear'       => true,
        'priority'    => 35,
    );

    return $fields;
}
add_filter('woocommerce_checkout_fields', 'essendaar_custom_b2b_checkout_fields');

/**
 * Save GSTIN to WooCommerce Order Meta
 */
function essendaar_save_b2b_order_meta($order_id) {
    if (!empty($_POST['billing_gstin'])) {
        update_post_meta($order_id, '_billing_gstin', sanitize_text_field($_POST['billing_gstin']));
    }
}
add_action('woocommerce_checkout_update_order_meta', 'essendaar_save_b2b_order_meta');

/**
 * Display GSTIN in Admin Order Details
 */
function essendaar_display_gstin_admin_order_meta($order) {
    $gstin = get_post_meta($order->get_id(), '_billing_gstin', true);
    if (!empty($gstin)) {
        echo '<p><strong>' . __('GSTIN / Tax ID:', 'essendaar') . '</strong> <span style="font-family:monospace; background:#eef2ff; padding:2px 6px; border-radius:4px;">' . esc_html($gstin) . '</span></p>';
    }
}
add_action('woocommerce_admin_order_data_after_billing_address', 'essendaar_display_gstin_admin_order_meta', 10, 1);
