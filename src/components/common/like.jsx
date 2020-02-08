import React from 'react';

const Like = (props) => {
    const { liked, onLikeToogle } = props;
    
    let classes = "fa fa-heart";
    
    if (liked === true)
        classes +="-o";
    
    return <i onClick={ onLikeToogle } style={{cursor:"pointer" }} className={classes} aria-hidden="true"></i>;
}

export default Like;