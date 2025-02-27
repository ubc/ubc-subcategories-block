/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import { HierarchicalTermSelector } from './components/taxonomyHierachySelector';
import { useEntityRecords } from '@wordpress/core-data';
import { Fragment } from 'react';

import { unescape } from 'lodash';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {
	const { attributes, setAttributes, context } = props;
	const { taxonomySlug, selectedTermId, hideEmpty, isLink, tag : Tag } = attributes;
	const { postId, postType } = context;
	const blockProps = useBlockProps();

	const query = 'post' === postType ? {
		per_page: -1,
		hideEmpty: hideEmpty,
		context: 'view',
		child_of: selectedTermId ? selectedTermId : 0,
		post: postId
 	} : {
		per_page: -1,
		hideEmpty: hideEmpty,
		context: 'view',
		child_of: selectedTermId ? selectedTermId : 0,
	};

	const { records: categories, isResolving } = useEntityRecords(
		'taxonomy',
		'category',
		query
	);

	return (
		<Fragment>
			{ ! isResolving && categories && categories.length > 0 ? (
				<Tag { ...blockProps }>
					{ categories.map((cat, index) => {
						return isLink ? <a key={index} href={cat.link} className='single-term'>{unescape( cat.name ).trim()}</a> : <span key={index} className='single-term'>{unescape( cat.name ).trim()}</span>
					}).reduce((prev, curr) => [prev, <span className='term-separator'>, </span>, curr])
					}
				</Tag>
			) : null}
			<InspectorControls>
				<PanelBody title="Select a parent term" className='ubc-subcategory-panel-category' initialOpen={ true }>
					<PanelRow>
						<HierarchicalTermSelector
							taxonomySlug={ taxonomySlug }
							selectedTermId= { selectedTermId }
							onSelectedTermChange={ termId => {
								setAttributes( {
									selectedTermId: termId === selectedTermId ? undefined : termId
								});
							} }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title="Settings" className='ubc-subcategory-panel-settings' initialOpen={ true }>
					<PanelRow>
						<ToggleControl
							label="Link terms"
							help={
								isLink
									? 'Terms will be linked to their archive pages.'
									: 'Terms will not be linked.'
							}
							checked={ isLink }
							onChange={ () => {
								setAttributes({
									isLink: ! isLink
								});
							} }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Hide empty terms"
							help={
								hideEmpty
									? 'Terms that do not have any posts attached will be hidden.'
									: 'Terms that do not have any posts attached will be visible.'
							}
							checked={ hideEmpty }
							onChange={ () => {
								setAttributes({
									hideEmpty: ! hideEmpty
								});
							} }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}