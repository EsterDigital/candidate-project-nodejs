// Load the model (data access) layer
const dal = require('./dal.js'),
    /* 
        CCC 6/7: Provide simple validation[/sanitization] and appropriate HTTP statuses in the response
    */
    pass = (obj) => {
        return !/(.*(\$|\\")|[iI]d":[^\d])/.test(JSON.stringify(obj));
    },
    code = (res, hsc, dat = undefined) => {
        let scs = {
            200: "OK",
            201: "Created",
            400: "Bad Request",
            401: "Unauthorized",
            404: "Not Found",
            500: "Server Error"
        },
        flg = hsc === 500;
        res.status(hsc).send({
            status: hsc, 
            data: flg ? undefined : dat,
            message: flg ? String(dat) : scs[hsc]
        });
    }

// Expose the controller
module.exports = {
    create_user: async (req, res) => {
        try {
            /* 
                CCC 7/7: Ensure that all incoming [mutation] requests contain an 'authorization' header (set from 'dev-tool/postman > headers > key > val')
            */
            if (!req.headers.authorization) {
                code(res, 401);
            } else if (!pass(req.body)) {
                code(res, 400);
            } else {
                let dat = await dal.create_user(req.body);
                code(res, 201, dat);
            } 
        } catch (msg) {
            code(res, 500, msg)
        }
    },
    read_comments: async (req, res) => {
        try {
            let dat = await dal.read_comments(Number(req.params.pid));
            dat.length ? code(res, 200, dat) : code(res, 404);
        } catch (msg) {
            code(res, 500, msg)
        }
    },
    update_post: async (req, res) => {
        try {
            if (!req.headers.authorization) {
                code(res, 401);
            } else if (!pass(req.body)) {
                code(res, 400);
            } else {
                let dat = await dal.update_post(req.body);
                code(res, 201, dat);
            } 
        } catch (msg) {
            code(res, 500, msg)
        }
    },
    delete_comment: async (req, res) => {
        try {
            if (!req.headers.authorization) {
                code(res, 401);
            } else {
                let dat = await dal.delete_comment(Number(req.params.cid));
                dat ? code(res, 200) : code(res, 404);
            }
        } catch (msg) {
            code(res, 500, msg)
        }
    }
}
