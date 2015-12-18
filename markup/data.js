module.exports.asset = function (param) { return '/' + param; };
module.exports.path  = function (param) { return param + '.html'; };

module.exports.mainMenu = {
    item1: {
        title: 'Home',
        path:  'index.html'
    },
    item2: {
        title: 'About',
        path:  '#about'
    },
    item3: {
        title: 'Contacts',
        path:  '#contacts'
    }
};