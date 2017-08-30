// /routes/issue.js

const Issues = require('./models/issue.js')

/**
 * Get all issues
 */
route.get('/issues', (req, res) => {
    Issues.findAll()
    .then((data) => {
        res.json(data); res.end();
    })
    .catch((err) => {
       res.status(500); res.end();
    });
});

/**
 * Get issues filtered by `status` param
 */
route.get('/issues/:status', (req, res) => {
    const filter = req.body;

    Issues.filterByStatus(filter)
    .then((data) => {
        res.json(data); res.end();        
    })
    .catch((err) => {
        res.status(500); res.json({ msg: err.message }); res.end();
    });
});

/**
 * Post new issue. Issue id should be autoincrementable.
 * After successfull posting should redirect to `/issue`
 */
route.post('/issues', (req, res) => {
    const issueData = req.body;

    Issues.create(issueData)
    .then(() => {
        res.status(201); res.end();
    })
    .catch((err) => {
        res.status(500); res.json({ msg: err.message }); res.end();
    });
});

/** 
 * Update existing issue. After successfull updating should
 * redirect to `/issue`
 */
route.put('/issues/:issue_id', (req, res) => {
    const issueId = req.body.id;
    const updateData = req.body.updateData;
    
    Issues.update(issueId, updateData)
    .then(() => {
        res.status(201); res.end();
    })
    .catch((err) => {
        res.status(500); res.json({ msg: err.message }); res.end();
    });
});

// /models/issue.js
function update(issueId, updateData) {
    return IssueModel.findOne({ issueId: issueId })
    .then((issue) => {
        Object.keys(issue).forEach((key) => {
           updateData[key] && (issue[key] = updateData[key]);
        });

        return issue.save();
    })
}
