// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import {chalkProcessing} from './chalkConfig';
import proxy from 'http-proxy-middleware'
/* eslint-disable no-console */

console.log(chalkProcessing('Opening production build...'));

// Run Browsersync
browserSync({
  port: 4001,
  ui: {
    port: 4002
  },
  open: false,
  ghostMode: false,
  server: {
    baseDir: 'dist',
    middleware: [
      historyApiFallback(),

      proxy('/api', {
        target: 'http://ourcodestyle.localhost:4000',
        changeOrigin: true, // for vhosted sites, changes host header to match to target's host
        logLevel: 'debug'
      }),

      proxy('/graphql', {
        target: 'http://ourcodestyle.localhost:4000',
        changeOrigin: true, // for vhosted sites, changes host header to match to target's host
        logLevel: 'debug'
      }),

      proxy('/cable', {
        target: 'http://ourcodestyle.localhost:7008',
        changeOrigin: false, // for vhosted sites, changes host header to match to target's host
        logLevel: 'debug',
        ws: true
      }),
    ]
  },

  files: [
    'src/*.html'
  ],

  // middleware: [historyApiFallback()]
});
