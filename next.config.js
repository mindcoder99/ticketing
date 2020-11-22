modules.exports = {  //this is to make sure nextjs re-renders files after changing them inside docker images
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300  //poll all the files every 300ms to check if any changes
        return config
    }
}