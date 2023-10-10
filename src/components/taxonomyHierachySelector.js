/**
 * External dependencies
 */
 import { unescape as unescapeString } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { CheckboxControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import { buildTermsTree } from './terms';

export const HierarchicalTermSelector = props => {

    const { taxonomySlug, selectedTermId, onSelectedTermChange } = props;

    const {
        availableTerms,
    } = useSelect(
        ( select ) => {
            const { getEntityRecords } = select( coreStore );
            return {
                availableTerms:
                    getEntityRecords( 'taxonomy', taxonomySlug, { per_page: -1 } ) ||
                    [],
            };
        },
        []
    );

    const availableTermsTree = useMemo(
        () => buildTermsTree( availableTerms ),
        // Remove `terms` from the dependency list to avoid reordering every time
        // checking or unchecking a term.
        [ availableTerms ]
    );

    const renderTerms = ( renderedTerms ) => {
        return renderedTerms.map( ( term ) => {
            return (
                <div
                    key={ term.id }
                    className="editor-post-taxonomies__hierarchical-terms-choice"
                >
                    <CheckboxControl
                        checked={ term.id === selectedTermId }
                        onChange={ () => {
                            const termId = parseInt( term.id, 10 );
                            onSelectedTermChange( termId );
                        } }
                        label={ unescapeString( term.name ) }
                    />
                    { !! term.children.length && (
                        <div className="editor-post-taxonomies__hierarchical-terms-subchoices">
                            { renderTerms( term.children ) }
                        </div>
                    ) }
                </div>
            );
        } );
    };

    return (
        <div className='editor-post-taxonomies__hierarchical-terms-list'>
            { renderTerms( availableTermsTree ) }
        </div>
    );
}