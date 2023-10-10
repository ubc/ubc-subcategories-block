/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	icon: <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" focusable="false"><path d="M20 4H4v1.5h16V4zm-2 9h-3c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2zm.5 5c0 .3-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v3zM4 9.5h9V8H4v1.5zM9 13H6c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2zm.5 5c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v3z" fillRule="evenodd" clipRule="evenodd"></path></svg>
} );
