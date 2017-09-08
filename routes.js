'use strict';

const // Home = require('./pages/home.jsx')
    , Login = require('./pages/login.jsx')
    , Register = require('./pages/register.jsx')
    , Issue = require('./pages/issue.jsx')
    , IssueEdit = require('./pages/issue_edit.jsx')
    , Issues = require('./pages/issues.jsx')
    , User = require('./pages/user.jsx')
    , NotFound = require('./pages/not_found.jsx')
    , Layout = require('./layout.js');

const reactRouter = require('react-router')
    , Router = reactRouter.Router
    , Route = reactRouter.Router
    , IndexRoute = reactRouter.IndexRoute
    , browserHistory = reactRouter.browserHistory;

const LoginStorage = require('./stores/login.jsx');

function authenticate(nextState, replace) {
    if (LoginStorage.getUser() !== undefined)
        replace('/issues');
    else 
        replace('/login');
}

const Routes = (
    <Router history={browserHistory}>
        <Route path='register' component={Register}/>
        <Route path='login' component={Login}/>
        <Route path='/' component={Layout} onEnter={authenticate}>            
            <Route path='issues' component={Issues}>
                <Route path='issues/:issueId' component={Issue}>
                    <Route path='issues/:issueId/edit' component={IssueEdit}/>
                </Route>
            </Route>
            <Route path='users/:userId' component={User}/>
        </Route>
    </Router>
);

module.exports = Routes;