import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
require('babel-polyfill');
//引入模板
import App from '../module/App';
ReactDOM.render(
    (<HashRouter>
        <App/>
    </HashRouter>),
    document.getElementById('root')
);

