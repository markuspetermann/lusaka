/* configuration file for lusaka-server */

var config = {
    
    /* port the App listens in DEVELOPMENT mode */
    dev_port: 3002,

    /* port the App listens in PRODUCTION mode */
    prod_port: 3002,

    /* address to listen */
    listen: "127.0.0.1",

    /* enable redirection server, redirects requests on port 80 to 443
     * only used when started in PRODUCTION mode */
    enable_redir: false,
    
    /* TLS cert and key files, TLS may be disabled when run behind a reverse proxy,
     * only used when started in PRODUCTION mode */
    tls_enabled: false,
    tls_cert: "",
    tls_key: "",

    /* Markdown root directory, use trailing "/" */
    datadir: "data/",

    /* Enable frequent git pull in datadir */
    git_pull_enabled: true,

    /* Git pull periode in ms */
    git_pull_timeout: 600000,

    /* Rescan timeout */
    rescan_timeout: 120000
}

module.exports = config;
