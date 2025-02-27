<?php
/**
 * Plugin Name:       UBC Subcategory Block
 * Description:       Similliar to the category block, but list subcategories from a selected parent category instead.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Kelvin Xu
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ubc-subcategory-block
 *
 * @package           ubc-subcategory-block
 */

namespace UBC\CTLT\BLOCKS\SUBCATEGORY;

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function init() {
	register_block_type(
		__DIR__ . '/build',
		array(
			'render_callback' => __NAMESPACE__ . '\\render_subcategories',
		)
	);

	add_filter( 'rest_category_query', __NAMESPACE__ . '\\extend_category_rest_endpoint', 10, 2 );
}

/**
 * Add child_of support for category rest endpoint.
 *
 * @param array           $prepared_args Array of arguments for get_terms() .
 * @param WP_REST_Request $request The REST API request.
 *
 * @return array overrided array of argument for get_terms().
 */
function extend_category_rest_endpoint( $prepared_args, $request ) {
	if ( null === $request->get_param( 'child_of' ) ) {
		return $prepared_args;
	}

	$child_of                  = (int) $request->get_param( 'child_of' );
	$prepared_args['child_of'] = $child_of;

	return $prepared_args;
}//end extend_category_rest_endpoint()

/**
 * ServerSideRendering callback to render the content of the block.
 *
 * @param array  $attributes block attributes.
 * @param HTML   $content content of the block.
 * @param Object $block current registered block object.
 * @return HTML raw content of the block.
 */
function render_subcategories( $attributes, $content, $block ) {
	$taxonomy_slug = esc_attr( $attributes['taxonomySlug'] );
	$parent_id     = isset( $attributes['selectedTermId'] ) ? (int) $attributes['selectedTermId'] : 0;
	$hide_empty    = boolval( $attributes['hideEmpty'] );
	$is_link       = boolval( $attributes['isLink'] );
	$tag           = esc_attr( $attributes['tag'] );

	$post_id   = (int) $block->context['postId'];
	$post_type = sanitize_title( $block->context['postType'] );

	$terms = array();

	if ( 'post' !== $post_type ) {
		$terms = get_terms(
			$taxonomy_slug,
			array(
				'child_of'   => $parent_id,
				'hide_empty' => $hide_empty,
			),
		);
	} else {
		$terms = wp_get_post_terms(
			$post_id,
			$taxonomy_slug,
			array(
				'child_of'   => $parent_id,
				'hide_empty' => $hide_empty,
			),
		);
	}

	if ( is_wp_error( $terms ) ) {
		return 'Error! Please contact network administrators.';
	}

	$terms = array_map(
		function( $term ) use ( $is_link ) {
			return $is_link ? '<a class="single-term" href="' . esc_url( get_term_link( $term->term_id ) ) . '">' . esc_attr( $term->name ) . '</a>' : '<span class="single-term">' . esc_attr( $term->name ) . '</span>';
		},
		$terms
	);

	return wp_kses_post( '<' . $tag . ( isset( $attributes['className'] ) ? ' class="wp-block-ubc-subcategory ' . $attributes['className'] . '"' : ' class="wp-block-ubc-subcategory"' ) . '>' . join( '<span class="term-separator">, </span>', $terms ) . '</' . $tag . '>' );
}//end render_subcategories()

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */

add_action( 'init', __NAMESPACE__ . '\\init' );
