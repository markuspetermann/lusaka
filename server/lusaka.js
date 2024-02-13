const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const Koa = require("koa");
const Router = require("koa-router");
const koaSend = require("koa-send");
const compress = require("koa-compress");
const helmet = require("koa-helmet");
const walker = require("walker");
const git = require("simple-git");

const config = require("./config/config");


const DEV = process.env.NODE_ENV === "development";
const PROD = process.env.NODE_ENV === "production";

if(DEV) {
    console.log(" ");
    console.log("*** Running in DEVELOPMENT mode ***");
    console.log(" ");
}

var tree = [];


/* Webserver */

const app = new Koa();
const router = new Router();

if(PROD && config.enable_redir) {
    const redir_server = http.createServer((req, res) => {
        res.writeHead(301, { Location: "https://" + req.headers["host"] + req.url });
        res.end();
    });
    redir_server.listen(80);
    console.log("Started redirection server (80 -> 443)");
}

const server = (PROD && config.tls_enabled) ?
    https.createServer({
        key:  fs.readFileSync(config.tls_key, "utf8"), 
        cert: fs.readFileSync(config.tls_cert, "utf8") },
        app.callback() ) :
    http.createServer(app.callback());


/* Koa */

/* Public Routes */

function _parse_md_timestamp(data) {
    const [firstLine] = data.split("\n");
    return firstLine.startsWith(";") ? parseInt(firstLine.slice(1)) : null;
};

function _read_md(_path) {
    let md = {};
    let fd = fs.openSync(_path, "r");

    md.data = fs.readFileSync(fd, { encoding: "utf8" });
    md.time = fs.fstatSync(fd).mtimeMs;
    md.path = _path.replace(/\\/g, "/").substring(config.datadir.length);
    md.name = path.basename(_path, ".md");

    fs.closeSync(fd);

    const md_time = _parse_md_timestamp(md.data);

    if (md_time) {
        md.time = md_time;
        md.data = md.data.substring(md.data.indexOf('\n') + 1);
    }

    return md;
}

async function _get_mds(_path) {
    let stats = fs.lstatSync(_path);
    let mds = [];

    if(DEV) console.log("Markdown requested: " + _path);

    if (stats.isDirectory()) {
        var _p = new Promise((res, rej) => walker(_path)
            .filterDir((dir, stat) => {
                return (dir.substring(dir.length - 4) !== ".git");
            })
            .on("file", (file, stat) => {
                if(file.split(".").pop() == "md")
                    mds.push(_read_md(file));
            })
            .on("end", () => res()));
    } else if (stats.isFile()) {
        if(_path.split(".").pop() == "md")
            mds.push(_read_md(_path));
    }

    await _p;
    mds.sort((a,b) => b.time - a.time);
    return mds;
}

router.get("/favicon.ico", async (ctx, next) => {
    ctx.compress = true;
    await koaSend(ctx, "client/favicon.ico");
});

router.get("/robots.txt", async (ctx, next) => {
    ctx.body = "Sitemap: https://" + ctx.host + "/sitemap.txt\n\nuser-agent: *\nallow: /\n";
});

router.get("/sitemap.txt", async (ctx, next) => {
    let mds = await _get_mds(config.datadir);
    let links = mds.map(_o => "https://" + ctx.host + "/" + _o.path);
    ctx.body = links.join("\n");
});

router.get("/client/(.*)", async (ctx, next) => {
    if(/\.ico$/.test(ctx.path)) ctx.compress = true;
    await koaSend(ctx, ctx.path);
});

/* Retrive folder structure */
router.get("/tree", async (ctx, next) => {
    if(DEV) console.log("Tree requested");
    ctx.body = { tree: tree };
});

/* Retrive single note if id is the full path and filename or
 * multiple notes if id just includes a path */
router.get("/md/:md(.*)", async (ctx, next) => {
    let _path = config.datadir + (ctx.params.md ? ctx.params.md : "");
    if (DEV) console.log("md: " + _path);
    let mds = await _get_mds(_path);
    ctx.body = { mds: mds };
});

/* Serve additional materials, e.g. images, script files, that are stored next
 * to the markdown files */
router.get(/\/support\/(.*\.(jpg|png|py))/, async (ctx, next) => {
    if (DEV) console.log("support: " + __dirname + '/' + config.datadir + ctx.params[0]);
    await koaSend(ctx, ctx.params[0], { root: __dirname + '/' + config.datadir });
});

/* If nothing else matches send index.html */
router.get("(.*)", async (ctx, next) => {
    let isDoc = /(.*)\.md/i;
    if(ctx.path.match(isDoc))
        ctx.set("X-Robots-Tag", "index");
    else
        ctx.set("X-Robots-Tag", "noindex");
    await koaSend(ctx, "client/index.html");
});


var helmet_opts = {};

/* set unsafe CORS headers, for development only !!! */
if(DEV) {
    helmet_opts = { crossOriginResourcePolicy: { policy: "cross-origin" }};
    app.use(async (ctx, next) => {
        ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");
        ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token");
        ctx.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, PATCH");
        ctx.set("Access-Control-Allow-Credentials", "true");
        await next();
    });
}


app.use(helmet(helmet_opts));
app.use(compress());
app.use(router.routes());
app.use(router.allowedMethods());


server.listen(PROD ? config.prod_port : config.dev_port, config.listen);


/* Periodic Tasks */

function _sort_by_name(arr) {
    console.log(arr)
    arr.sort((a, b) => a.name.localeCompare(b.name));
    arr.forEach(item => {
        if (item.children && item.children.length > 0) {
            _sort_by_name(item.children);
        }
    });

    return arr;
};

async function _rescan_data() {
    let dirs = [];
    let newtree = [];
    walker(config.datadir)
    .filterDir((dir, stat) => {
        return (dir.substring(dir.length - 4) !== ".git");
    })
    .on("dir", (dir, stat) => {
        let path = dir.replace(/\\/g,"/").replace(config.datadir,"");
        if(path.length) dirs.push(path);
    })
    .on("end", () => {
        // https://stackoverflow.com/questions/6232753/convert-delimited-string-into-hierarchical-json-with-jquery
        // Added path
        for (let i = 0; i < dirs.length; i++) {
            let chain = dirs[i].split("/");
            let currentNode = newtree;
            let path = "";
            for (let j = 0; j < chain.length; j++) {
                let wantedNode = chain[j];
                let lastNode = currentNode;
                path = path + "/" + wantedNode;
                for (var k = 0; k < currentNode.length; k++) {
                    if (currentNode[k].name == wantedNode) {
                        currentNode = currentNode[k].children;
                        break;
                    }
                }
                // If we couldn"t find an item in this list of children
                // that has the right name, create one:
                if (lastNode == currentNode) {
                    let newNode = currentNode[k] = {
                        name: wantedNode,
                        path: path,
                        children: []
                    };
                    currentNode = newNode.children;
                }
            }
        }
        tree = _sort_by_name(newtree);
        if(DEV) console.log("Tree updated");
    });
};

async function _git_pull() {
    git(config.datadir).pull();
};


_rescan_data(); setInterval(_rescan_data, config.rescan_timeout);

if (config.git_pull_enabled) {
    _git_pull();
    setInterval(_git_pull, config.git_pull_timeout);
}

