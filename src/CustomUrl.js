const InternalUrl = require('./InternalUrl');

class CustomUrl extends URL {
    constructor(internalUrl) {
        super(internalUrl);
    }

    isExternal(url) {
        if (!this.isAbsoluteUrl(url)) {
            return false;
        }

        const urlToCompare = new URL(url);

        return this.hostname !== urlToCompare.hostname;
    }

    isAbsoluteUrl(url) {
        const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)\n?/gi;
        const regex = new RegExp(expression);

        return url.match(regex);
    }

    getType(url) {
        if (this.isAbsoluteUrl(url)) {
            if (url.endsWith('/')) url = url.slice(0, -1);
            if (url + '/' === this.href) return 'equal';
        }

        const fragments = url.split('?');
        if (!this.isExternal(url)) return new InternalUrl(fragments[0]).getType();
        else return 'external';
    }

    scrollId(url) {
        const fragments = url.split('?');
        if (!this.isExternal(url)) return new InternalUrl(fragments[0]).scrollId();
        else return false;
    }

    absoluteUrl(url) {
        if (this.isExternal(url)) return url;

        if (!url.startsWith('/') && !url.startsWith('#')) url = '/' + url;
        const absoluteUrl = new URL(`${this.protocol}//${this.host}${url}`);
        return absoluteUrl.href;
    }

    jsonUrl(url) {
        if (this.isExternal(url)) return false;
        if (this.isAbsoluteUrl(url)) return `${url}.json`;
        if (url.startsWith('#')) return false;

        const localUrl = new URL(this.absoluteUrl(url));

        return `${localUrl.protocol}//${localUrl.host}${localUrl.pathname}.json`;
    }
}

module.exports = CustomUrl;