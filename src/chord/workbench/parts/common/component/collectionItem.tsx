'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { getDateYear } from 'chord/base/common/time';
import { ICollectionItemViewProps } from 'chord/workbench/parts/common/props/collectionItem';
import { handlePlayCollection } from 'chord/workbench/parts/player/browser/action/playCollection';
import { handleShowCollectionView } from 'chord/workbench/parts/mainView/browser/action/showCollection';
import { handleShowUserProfileViewById } from 'chord/workbench/parts/mainView/browser/action/showUserProfile';

import { CollectionIcon } from 'chord/workbench/parts/common/component/common';

import { showCollectionMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { musicApi } from 'chord/music/core/api';


/**
 * Album item view
 *
 * This view doesn't display collection's songs
 *
 * props.collection is given by parent component
 */
class CollectionItemView extends React.Component<ICollectionItemViewProps, any> {

    constructor(props: ICollectionItemViewProps) {
        super(props);
    }

    render() {
        let collection = this.props.collection;
        let cover = collection.collectionCoverPath || musicApi.resizeImageUrl(collection.origin, collection.collectionCoverUrl, ESize.Large);
        let originIcon = OriginIcon(collection.origin, 'cover-icon xiami-icon');

        let likeAndPlayCount = getLikeAndPlayCount(collection);

        return (
            <div>
                <div draggable={true}>
                    <div className="media-object" style={{ maxWidth: '300px' }}>
                        <div className="media-object-hoverable">
                            <div className="react-contextmenu-wrapper"
                                onContextMenu={(e) => this.props.showCollectionMenu(e, collection)}>

                                {/* Cover */}
                                <div className="cover-art shadow actionable linking cursor-pointer cover-art--with-auto-height"
                                    aria-hidden="true" style={{ width: 'auto', height: 'auto' }}>
                                    <div onClick={() => this.props.handleShowCollectionView(collection)}>
                                        {CollectionIcon}
                                        <div className="cover-art-image cover-art-image-loaded"
                                            style={{ backgroundImage: `url(${cover})` }}></div>
                                    </div>
                                    <button className="cover-art-playback cursor-pointer"
                                        onClick={() => this.props.handlePlayCollection(collection)}>
                                        <svg className="icon-play" viewBox="0 0 85 100"><path fill="currentColor" d="M81 44.6c5 3 5 7.8 0 10.8L9 98.7c-5 3-9 .7-9-5V6.3c0-5.7 4-8 9-5l72 43.3z"><title>PLAY</title></path></svg></button>
                                </div>

                            </div>

                            {/* Collection Name */}
                            <div className="mo-info">
                                <div className="react-contextmenu-wrapper">
                                    <span className="mo-info-name">{collection.collectionName}</span>
                                </div>
                            </div>

                        </div>

                        {/* Collection User Name */}
                        <div className="mo-meta ellipsis-one-line">
                            <span className='link-subtle a-like cursor-pointer'
                                onClick={() => this.props.handleShowUserProfileViewById(collection.userId, collection.userMid)}>
                                {collection.userName}</span>
                        </div>

                        {/* like count and play count */}
                        <div className="mo-meta ellipsis-one-line">
                            <div className="react-contextmenu-wrapper">
                                <span> {likeAndPlayCount} </span>
                            </div>
                        </div>

                        <div className="mo-meta ellipsis-one-line">
                            <div className="react-contextmenu-wrapper">
                                {/* Origin Icon */}
                                <span>{originIcon} {getDateYear(collection.releaseDate)} • {collection.songCount} tracks</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


function mapDispatchToProps(dispatch) {
    return {
        handlePlayCollection: collection => handlePlayCollection(collection).then(act => dispatch(act)),
        handleShowCollectionView: collection => handleShowCollectionView(collection).then(act => dispatch(act)),
        showCollectionMenu: (e, collection) => dispatch(showCollectionMenu(e, collection)),

        handleShowUserProfileViewById: (userId, userMid) => handleShowUserProfileViewById(userId, userMid).then(act => dispatch(act)),
    };
}


export default connect(null, mapDispatchToProps)(CollectionItemView);
