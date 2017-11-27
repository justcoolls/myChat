import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter,Route} from 'react-router-dom';
//引入模板
import App from '../module/App';
ReactDOM.render(
    (<HashRouter>
        <App>
            {/*<Route exact path="/" component={workStation}/>*/}
        </App>
    </HashRouter>),
    document.getElementById('root')
);

