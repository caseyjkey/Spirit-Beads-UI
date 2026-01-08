module.exports = {
  apps: [{
    name: 'spirit-bead-designs',
    script: 'bun',
    args: 'src/index.ts',
    cwd: '/var/www/spirit-bead-designs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    log_file: '/var/www/spirit-bead-designs/logs/combined.log',
    out_file: '/var/www/spirit-bead-designs/logs/out.log',
    error_file: '/var/www/spirit-bead-designs/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
