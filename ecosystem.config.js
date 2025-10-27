module.exports = {
  apps: [{
    name: 'telephone-directory',
    script: 'npm',
    args: 'start',
    cwd: '/home/deployer/telephone-directory',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: [
      'node_modules',
      'logs',
      '.git',
      '.next'
    ]
  }]
};