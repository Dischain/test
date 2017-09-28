// app.jsx
import React from 'react';
import { render } from 'react-dom';

import Navbar from './components/Navbar.jsx';
import PreviewContainer from './components/PreviewContainer.jsx';
import Footer from './components/Footer.jsx';

render(
    <div className={'container'}>
        <Navbar />
        <PreviewContainer />
        <Footer />
    </div>,
    document.getElementById('app')
);

// ./components/PreviewContainer.jsx
import React from 'react';
import { Provider } from 'react-redux';

import Editor from './Editor.jsx';
import Preview from './Preview.jsx';

import configureStore from './store/configureStore.js';

const store = configureStore({source: ''});

export default () => {
    return (
        <div className={'row'}>
            <Provider store={store}>
                <Editor />
                <Preview />
            </Provider>
        </div>
    );
};

// ./components/Editor.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Editor extend Component {
    render() {
        return (
            <div className={'col-md-6'}>
                <input type='text' onChange={this.props.onSourceChange} text={this.props.source}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => { source: state.source };
const mapDispatchToProps = (dispatch) => { onTextChange: dispatch.sourceChange};

export dafault connect(mapStateToProps, mapDispatchToProps)(Editor);

// ./components/Preview.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Remarkable from 'ract-remarcable';

class Preview extend Component {
    render() {
        return (
            <div className={'col-md-6'}>
                <Remarkable source={this.props.source}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => { source: state.source };
export dafault connect(mapStateToProps)(Preview);

// actions/source.js
export function sourceChange(event) {
    return { type: 'SOURCE_TEXT_CHANGE', source: event.target.text };
}
// reducers/source.js
export function sourceChange(state='', action) {
    if (action.type = 'SOURCE_TEXT_CHANGE')
        return action.source;
    else 
        return state;
}
// reducers/index.js
export { combineReducers } from 'redux';
export { sourceChange } from './reducers/source.js';

export default combineReducers({sourceChange});

// ./store/configureStore.js
import { createStore } from 'redux';

import rootReducer from '../reducers';

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState);
};
