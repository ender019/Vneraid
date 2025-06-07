import React, { useState } from 'react';
import { useParams } from 'react-router-dom';  


// import List from '../components/list';

const BotSettings = () => {
    const { hash } = useParams();
    return(
        <>
            <div className='bot_info'>
                bot {hash}
            </div>
            <div className='bot_stat'>
                bot
            </div>
            <div className='bot_settings'>
                bot
            </div>
        </>
    );
};

export default BotSettings