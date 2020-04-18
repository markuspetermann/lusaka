module.exports = {
  apps: [{
    name: "lusaka",
    script: "lusaka.js",
    autorestart: true,
    watch: false,
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development",
    }
  }],
  deploy: {
    production : {
      user : "", // Add the user on the remote host used for deployment
      host : "", // Add the remote host
      ref  : "origin/master",
      repo : "git@github.com:markuspetermann/lusaka.git",
      path : "/var/www/lusaka", // Edit the location on the host
      "pre-deploy-local": "",
      "post-deploy": "cd client && \
        npm install && \
        npm run build && \
        cd ../server && \
        npm install && \
        pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      "post-setup": "",
    }
  }
};
